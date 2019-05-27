import { filter, isNil } from 'lodash';
import { AsyncValidatorDescriptor } from '../descriptors/async-validator-descriptor';
import { FieldDescriptor } from '../descriptors/field-descriptor';
import { ValidatorDescriptor } from '../descriptors/validator-descriptor';
import { Class } from '../types';
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
	public readonly asyncValidators: AsyncValidatorDescriptor[] = [];
	private constructor() {}

	public findClassFields(type: Class<any>) {
		return filter(this.fields, field => field.target === type);
	}

	public findClassValidators(type: Class<any>): ValidatorDescriptor[] {
		return filter(this.validators, validator => validator.target === type && isNil(validator.propertyName));
	}

	public findPropertyValidators(type: Class<any>, propertyName: string): ValidatorDescriptor[] {
		return filter(this.validators, validator => validator.target === type && validator.propertyName === propertyName);
	}

	public findClassAsyncValidators(type: Class<any>): AsyncValidatorDescriptor[] {
		return filter(this.asyncValidators, validator => validator.target === type && isNil(validator.propertyName));
	}

	public findPropertyAsyncValidators(type: Class<any>, propertyName: string): AsyncValidatorDescriptor[] {
		return filter(this.asyncValidators, validator => validator.target === type && validator.propertyName === propertyName);
	}
}
