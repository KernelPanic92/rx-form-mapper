import { Injectable, InjectFlags, Injector, Type } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, FormArray, FormControl, FormGroup, Validator, ValidatorFn } from '@angular/forms';
import { ValidatorMetadata } from './../bind/validator-metadata';

import { ControlType } from '../bind';
import { PropertyMetadata } from '../bind/property-metadata';
import { get, isNil } from '../utils';
import { modelBinder } from './../bind/model-binder';

interface AbstractControlOptions {
	validators: ValidatorFn[];
	asyncValidators: AsyncValidatorFn[];
	updateOn?: 'change' | 'blur' | 'submit';
}
@Injectable()
export class RxFormWriterService {

	constructor(private readonly injector: Injector) {}

	public writeModel<T>( value: T, type: Type<T>, parentAbstractControlOptions?: AbstractControlOptions): FormGroup {
		if (isNil(type)) throw new Error('type must be specified');

		const metadata = modelBinder.getMetadata(type);
		let abstractControlOptions = this.buildAbstractControlOptions(metadata);
		abstractControlOptions = this.mergeAbstractControlOptions(abstractControlOptions, parentAbstractControlOptions);

		const fieldsMetadata: {[name: string]: PropertyMetadata} = metadata.properties;
		const fieldKeys = Object.keys(fieldsMetadata);
		const fields: { [name: string]: AbstractControl } = {};
		for (const fieldKey of fieldKeys) {
			const fieldInitialValue = get(value, fieldKey);
			const fieldMetadata = fieldsMetadata[fieldKey];
			fields[fieldKey] = this.writeProperty(fieldMetadata, fieldInitialValue);
		}
		const formGroup = new FormGroup(fields, abstractControlOptions);
		return formGroup;
	}

	private mergeAbstractControlOptions(abstractControlOptions: AbstractControlOptions, parentAbstractControlOptions: AbstractControlOptions): AbstractControlOptions {
		if (!parentAbstractControlOptions) return Object.assign({}, abstractControlOptions);
		return {
			asyncValidators: [...abstractControlOptions.asyncValidators, ...parentAbstractControlOptions.asyncValidators],
			validators: [...abstractControlOptions.validators, ...parentAbstractControlOptions.validators],
			updateOn: isNil(parentAbstractControlOptions.updateOn) ? abstractControlOptions.updateOn : parentAbstractControlOptions.updateOn
		};
	}

	private writeProperty(propertyMetadata: PropertyMetadata, value: any): AbstractControl {
		const abstractControlOptions = this.buildAbstractControlOptions(propertyMetadata);
		let abstractControl: AbstractControl;
		if (propertyMetadata.type === ControlType.FORM_CONTROL) {
			abstractControl = new FormControl(value, abstractControlOptions);
		} else if (propertyMetadata.type === ControlType.FORM_GROUP) {
			abstractControl = this.writeModel(value, propertyMetadata.propertyType, abstractControlOptions);
		} else if (propertyMetadata.type === ControlType.FORM_ARRAY) {
			const controls = isNil(value) ? [] : (value as Array<any>).map(item => this.writeModel(item, propertyMetadata.propertyGenericArgumentType));
			abstractControl = new FormArray(controls, abstractControlOptions);
		} else if (propertyMetadata.type === ControlType.CUSTOM) {
			if (isNil(propertyMetadata.customMapper)) throw new Error('undefined custom mapper');
			const customMapper = new propertyMetadata.customMapper();
			abstractControl = customMapper.writeForm(value, propertyMetadata.propertyType, abstractControlOptions);
		}

		return abstractControl;
	}

	private buildAbstractControlOptions(metadata: ValidatorMetadata): AbstractControlOptions {
		return {
			validators: metadata.validators.map(v => this.buildValidator(v)),
			asyncValidators: metadata.asyncValidators.map(v => this.buildAsyncValidator(v)),
			updateOn: metadata.updateOn
		};
	}

	private buildValidator(validator: ValidatorFn | Type<Validator>): any {
		if (!this.isValidatorType(validator)) return validator;
		let validatorInstance = this.injector.get(validator, null, InjectFlags.Optional);
		validatorInstance = isNil(validatorInstance) ? new validator() : validatorInstance;

		return (c: AbstractControl) => validatorInstance.validate(c);
	}

	private buildAsyncValidator(validator: AsyncValidatorFn | Type<AsyncValidator>): AsyncValidatorFn {
		if (!this.isAsyncValidatorType(validator)) return validator;
		let validatorInstance = this.injector.get(validator, null, InjectFlags.Optional);
		validatorInstance = isNil(validatorInstance) ? new validator() : validatorInstance;
		return (c: AbstractControl) => validatorInstance.validate(c);
	}

	private isValidatorType(value: ValidatorFn | Type<Validator>): value is Type<Validator> {
		return !!value.prototype.validate;
	}

	private isAsyncValidatorType(value: AsyncValidatorFn | Type<AsyncValidator>): value is Type<AsyncValidator> {
		return !!value.prototype.validate;
	}
}
