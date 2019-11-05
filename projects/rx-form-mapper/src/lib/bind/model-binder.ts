import { Type } from '@angular/core';
import { AsyncValidator, AsyncValidatorFn, Validator, ValidatorFn } from '@angular/forms';
import 'reflect-metadata';
import { ControlType, MetadataDesignTypes, ModelMetadata } from '.';
import { CustomControlMapper } from '../interfaces/custom-control-mapper';
import { coerceArray, get } from '../utils';
import { AbstractControlOpts } from './../decorators/abstract-control-opts';

class ModelBinder {
	private metadataKey = 'rx-form-mapper-metadata';

	public getMetadata(target: Type<any>): ModelMetadata {
		const defaultModelDescriptor: ModelMetadata = {
			asyncValidators: [],
			validators: [],
			properties: {}
		};
		const reflectedMetadata = Reflect.getMetadata(this.metadataKey, target);
		return Object.assign({}, defaultModelDescriptor, reflectedMetadata);
	}

	public bindForm(target: Type<any>, opts: AbstractControlOpts) {
		const metadata: ModelMetadata = this.getMetadata(target);
		metadata.asyncValidators = coerceArray(get(opts, 'asyncValidators', []));
		metadata.validators = coerceArray(get(opts, 'validators', []));
		metadata.updateOn = get(opts, 'updateOn');
		this.setMetadata(target, metadata);
	}

	public bindCustomControl(target: any, propertyName: string, mapper: Type<CustomControlMapper>, opts: AbstractControlOpts) {
		const metadata: ModelMetadata = this.getMetadata(target.constructor);

		metadata.properties[propertyName] = {
			asyncValidators: coerceArray(get(opts, 'asyncValidators', [])),
			validators: coerceArray(get(opts, 'validators', [])),
			propertyType: Reflect.getMetadata(MetadataDesignTypes.TYPE, target, propertyName),
			type: ControlType.CUSTOM,
			updateOn: get(opts, 'updateOn', void 0),
			customMapper: mapper
		};

		this.setMetadata(target.constructor, metadata);
	}

	public bindFormControl(target: {constructor: Type<any>}, propertyName: string, opts?: AbstractControlOpts): void {
		this.bindFormControlOrGroup(target, propertyName, ControlType.FORM_CONTROL, opts);
	}

	public bindFormGroup(target: {constructor: Type<any>}, propertyName: string, opts?: AbstractControlOpts): void {
		this.bindFormControlOrGroup(target, propertyName, ControlType.FORM_GROUP, opts);
	}

	public bindFormArray(target: {constructor: Type<any>}, propertyName: string, opts: AbstractControlOpts): void {
		const metadata: ModelMetadata = this.getMetadata(target.constructor);

		metadata.properties[propertyName] = {
			asyncValidators: coerceArray(get(opts, 'asyncValidators', [])),
			validators: coerceArray(get(opts, 'validators', [])),
			propertyType: Reflect.getMetadata(MetadataDesignTypes.TYPE, target, propertyName),
			propertyGenericArgumentType: get(opts, 'type'),
			type: ControlType.FORM_ARRAY,
			updateOn: get(opts, 'updateOn', void 0)
		};

		this.setMetadata(target.constructor, metadata);
	}

	private bindFormControlOrGroup(target: {constructor: Type<any>}, propertyName: string, controlType: ControlType.FORM_CONTROL | ControlType.FORM_GROUP, opts?: AbstractControlOpts): void {
		const metadata: ModelMetadata = this.getMetadata(target.constructor);

		metadata.properties[propertyName] = {
			asyncValidators: coerceArray(get(opts, 'asyncValidators', [])),
			validators: coerceArray(get(opts, 'validators', [])),
			propertyType: get(opts, 'type', Reflect.getMetadata(MetadataDesignTypes.TYPE, target, propertyName)),
			type: controlType,
			updateOn: get(opts, 'updateOn', void 0)
		};

		this.setMetadata(target.constructor, metadata);
	}

	private setMetadata(target: Type<any>, metadata: ModelMetadata) {
		Reflect.defineMetadata(this.metadataKey, metadata, target);
	}
}

export const modelBinder = new ModelBinder();
