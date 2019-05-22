import { FieldDescriptor } from '../descriptors/field-descriptor';
import { Class } from '../types';
import { filter } from 'lodash';

export class FormMapperStore {

	public readonly fields: FieldDescriptor[] = [];
	private constructor() {}

	public static get instance(): FormMapperStore {
		const formMapperStoreKey = 'FormMapperStore';
		const store = typeof(window) === undefined ? window : global;
		if (!store[formMapperStoreKey]) {
			store[formMapperStoreKey] = new FormMapperStore();
		}
		return store[formMapperStoreKey];
	}

	findFieldsByTarget(type: Class<any>) {
		return filter(this.fields, field => field.target === type);
	}
}
