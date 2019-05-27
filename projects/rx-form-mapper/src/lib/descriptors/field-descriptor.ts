import { Class } from '../types';

export enum EFieldType {
	FORM_CONTROL = 'FORM_CONTROL',
	FORM_GROUP = 'FORM_GROUP'
}

export interface FieldDescriptor {
	target: Function;
	propertyName: string;
	fieldType: EFieldType;
	clazz: Class<any>;
	isArray: boolean;
}
