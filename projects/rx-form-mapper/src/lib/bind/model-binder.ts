import { Type } from '@angular/core';
import { AsyncValidator, AsyncValidatorFn, Validator, ValidatorFn } from '@angular/forms';
import 'reflect-metadata';
import { EFieldType, MetadataDesignTypes, ModelMetadata } from '.';
import { FormArrayDecoratorOpts, FormControlDecoratorOpts, FormGroupDecoratorOpts } from '../decorators';

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

	public bindFormControl(target: {constructor: Type<any>}, propertyName: string, decorator: FormControlDecoratorOpts): void {
		const metadata: ModelMetadata = this.getMetadata(target.constructor);

		metadata.properties[propertyName] = {
			asyncValidators: decorator.asyncValidators,
			validators: decorator.validators,
			propertyType: Reflect.getMetadata(MetadataDesignTypes.TYPE, target, propertyName),
			fieldType: EFieldType.FORM_CONTROL
		};

		this.setMetadata(target.constructor, metadata);
	}

	public bindFormGroup(target: {constructor: Type<any>}, propertyName: string, decorator: FormGroupDecoratorOpts): void {
		const metadata: ModelMetadata = this.getMetadata(target.constructor);

		metadata.properties[propertyName] = {
			asyncValidators: decorator.asyncValidators || [],
			validators: decorator.validators || [],
			propertyType: Reflect.getMetadata(MetadataDesignTypes.TYPE, target, propertyName),
			fieldType: EFieldType.FORM_GROUP
		};

		this.setMetadata(target.constructor, metadata);
	}

	public bindFormArray(target: {constructor: Type<any>}, propertyName: string, decorator: FormArrayDecoratorOpts): void {
		const metadata: ModelMetadata = this.getMetadata(target.constructor);

		metadata.properties[propertyName] = {
			asyncValidators: decorator.asyncValidators,
			validators: decorator.validators,
			propertyType: Reflect.getMetadata(MetadataDesignTypes.TYPE, target, propertyName),
			propertyGenericArgumentType: decorator.type,
			fieldType: EFieldType.FORM_ARRAY
		};

		this.setMetadata(target.constructor, metadata);
	}

	public bindValidators(target: Type<any>, validators: (Type<Validator> | ValidatorFn)[]): void {
		const metadata: ModelMetadata = this.getMetadata(target);

		metadata.validators = [...metadata.validators, ...validators];

		this.setMetadata(target, metadata);
	}

	public bindAsyncValidators(target: Type<any>, validators: (Type<AsyncValidator> | AsyncValidatorFn)[]): void {
		const metadata: ModelMetadata = this.getMetadata(target);
		metadata.asyncValidators = [...metadata.asyncValidators, ...validators];
		this.setMetadata(target, metadata);
	}

	private setMetadata(target: Type<any>, metadata: ModelMetadata) {
		Reflect.defineMetadata(this.metadataKey, metadata, target);
	}
}

export const modelBinder = new ModelBinder();
