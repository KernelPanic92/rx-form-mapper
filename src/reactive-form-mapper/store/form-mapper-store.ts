import { FieldDescriptor } from '../descriptors/field-descriptor';

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
}
