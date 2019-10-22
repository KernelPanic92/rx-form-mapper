import { Type } from '@angular/core';
import { FieldDescriptor } from '../descriptors/field-descriptor';
import { ValidatorDescriptor } from '../descriptors/validator-descriptor';
import { filter, isNil } from '../utils';
declare const global;
declare const window;
export class FormMapperStore {

	public static getInstance(): FormMapperStore {
		const formMapperStoreKey = 'FormMapperStore';
		const store = typeof(window) === undefined ? window : global;
		if (!store[formMapperStoreKey]) {
			store[formMapperStoreKey] = new FormMapperStore();
		}
		return store[formMapperStoreKey];
	}

	public readonly fields: FieldDescriptor[] = [];
	public readonly validators: ValidatorDescriptor[] = [];
	private constructor() {}

	public findClassFields(type: Type<any>) {
		return filter(this.fields, field => field.target === type);
	}

	public findClassValidators(type: Type<any>): ValidatorDescriptor[] {
		return filter(this.validators, validator => validator.target === type && isNil(validator.propertyName));
	}

	public findPropertyValidators(type: Type<any>, propertyName: string): ValidatorDescriptor[] {
		return filter(this.validators, validator => validator.target === type && validator.propertyName === propertyName);
	}
}
