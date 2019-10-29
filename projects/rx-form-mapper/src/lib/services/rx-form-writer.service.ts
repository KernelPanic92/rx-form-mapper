import { Injectable, InjectFlags, Injector, Type } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, FormArray, FormControl, FormGroup, Validator, ValidatorFn} from '@angular/forms';
import { EFieldType } from '../bind';
import { PropertyMetadata } from '../bind/property-metadata';
import { get, isNil } from '../utils';
import { modelBinder } from './../bind/model-binder';

@Injectable()
export class RxFormWriterService {

	constructor(private readonly injector: Injector) {}

	public writeModel<T>(type: Type<T>, model: T): FormGroup {
		if (isNil(type)) throw new Error('type must be specified');
		const metadata = modelBinder.getMetadata(type);
		const fieldsMetadata: {[name: string]: PropertyMetadata} = metadata.properties;
		const fieldKeys = Object.keys(fieldsMetadata);
		const fields: { [name: string]: AbstractControl } = {};
		for (const fieldKey of fieldKeys) {
			const fieldInitialValue = get(model, fieldKey);
			const fieldMetadata = fieldsMetadata[fieldKey];
			fields[fieldKey] = this.writeProperty(fieldMetadata, fieldInitialValue);
		}
		const formGroup = new FormGroup(fields);
		this.setValidators(formGroup, metadata.validators, metadata.asyncValidators);
		return formGroup;
	}

	private writeProperty(propertyMetadata: PropertyMetadata, value: any): AbstractControl {
		let abstractControl: AbstractControl;
		if (propertyMetadata.fieldType === EFieldType.FORM_CONTROL) {
			abstractControl = new FormControl(value);
		} else if (propertyMetadata.fieldType === EFieldType.FORM_GROUP) {
			abstractControl = this.writeModel(propertyMetadata.propertyType, value);
		} else if (propertyMetadata.fieldType === EFieldType.FORM_ARRAY) {
			const controls = isNil(value) ? [] : (value as Array<any>).map(item => this.writeModel(propertyMetadata.propertyGenericArgumentType, item));
			abstractControl = new FormArray(controls);
		}
		this.setValidators(abstractControl, propertyMetadata.validators, propertyMetadata.asyncValidators);
		return abstractControl;
	}

	private setValidators(abstractControl: AbstractControl, validators: (Type<Validator> | ValidatorFn)[], AsyncValidators: (Type<AsyncValidator> | AsyncValidatorFn)[]) {
		const controlValidators = validators.map(v => this.buildValidator(v));
		const existingValidator = abstractControl.validator;
		if (existingValidator) {
			controlValidators.push(existingValidator);
		}
		abstractControl.setValidators(controlValidators);

		const controlAsyncValidators = AsyncValidators.map(v => this.buildAsyncValidator(v));
		const existingAsyncValidator = abstractControl.asyncValidator;

		if (existingAsyncValidator) {
			controlAsyncValidators.push(existingAsyncValidator);
		}

		abstractControl.setAsyncValidators(controlAsyncValidators);
	}

	private buildValidator(validator: ValidatorFn | Type<Validator>): any {
		if (!this.isValidatorType(validator)) return validator;
		let validatorInstance = this.injector.get(validator, null, InjectFlags.Optional);
		validatorInstance = validatorInstance == null ? new validator() : validatorInstance;

		return (c: AbstractControl) => validatorInstance.validate(c);
	}

	private buildAsyncValidator(validator: AsyncValidatorFn | Type<AsyncValidator>): AsyncValidatorFn {
		if (!this.isAsyncValidatorType(validator)) return validator;
		let validatorInstance = this.injector.get(validator, null, InjectFlags.Optional);
		validatorInstance = validatorInstance == null ? new validator() : validatorInstance;
		return (c: AbstractControl) => validatorInstance.validate(c);
	}

	private isValidatorType(value: ValidatorFn | Type<Validator>): value is Type<Validator> {
		return !!value.prototype.validate;
	}

	private isAsyncValidatorType(value: AsyncValidatorFn | Type<AsyncValidator>): value is Type<AsyncValidator> {
		return !!value.prototype.validate;
	}
}
