import { FieldDescriptor } from '../descriptors/field-descriptor';
import { ValidatorDescriptor } from '../descriptors/validator-descriptor';
import { Class } from '../types';
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

	public findClassFields(type: Class<any>) {
		return filter(this.fields, field => field.target === type);
	}

	public findClassValidators(type: Class<any>): ValidatorDescriptor[] {
		return filter(this.validators, validator => validator.target === type && isNil(validator.propertyName));
	}

	public findPropertyValidators(type: Class<any>, propertyName: string): ValidatorDescriptor[] {
		return filter(this.validators, validator => validator.target === type && validator.propertyName === propertyName);
	}
}
