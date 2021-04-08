import { Type } from '@angular/core';
import 'reflect-metadata';
import {  MetadataDesignTypes } from '.';
import { CustomControlOpts, FormArrayOpts, FormControlOpts, FormOpts } from '../decorators';
import { FormMetadata } from '../metadata';

export class ModelBinder {

	private metadataKey = 'rx-form-mapper-metadata';

	public static readonly instance = new ModelBinder();

	private constructor() {}

	public getMetadata(target: Type<any>): FormMetadata {
		if (!Reflect.hasMetadata(this.metadataKey, target)) {
			Reflect.defineMetadata(this.metadataKey, new FormMetadata(target), target);
		}

		return Reflect.getMetadata(this.metadataKey, target);
	}

	public bindForm(target: Type<any>, opts: FormOpts) {
		const formMetadata: FormMetadata = this.getMetadata(target);
		formMetadata.setValidators(opts);
	}

	public bindCustomControl(target: {constructor: Type<any>}, propertyName: string, opts: CustomControlOpts) {
		this.getMetadata(target.constructor).setCustomControl(propertyName, opts.mapper, opts);
	}

	public bindFormControl(target: {constructor: Type<any>}, propertyName: string, opts?: FormControlOpts): void {
		this.getMetadata(target.constructor).setFormControl(propertyName, opts);
	}

	public bindFormGroup(target: {constructor: Type<any>}, propertyName: string, type?: Type<any>): void {
		const propertyType = type ?? Reflect.getMetadata(MetadataDesignTypes.TYPE, target, propertyName);
		const propertyFormMetadata = this.getMetadata(propertyType);
		this.getMetadata(target.constructor).setFormGroup(propertyName, propertyFormMetadata);
	}

	public bindFormArray(target: {constructor: Type<any>}, propertyName: string, opts: FormArrayOpts): void {
		const itemFormMetadata = this.getMetadata(opts.type);
		this.getMetadata(target.constructor).setFormArray(propertyName, itemFormMetadata, opts);
	}

}
