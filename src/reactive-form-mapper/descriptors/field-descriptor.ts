import { Class } from '../types';

export enum FieldType {
	FORM_CONTROL = 'FORM_CONTROL',
	FORM_GROUP = 'FORM_GROUP'
}

export interface FieldDescriptor {
	target: Function;
	propertyName: string;
	fieldType: FieldType;
	clazz: Class<any>;
	isArray: boolean;
}
