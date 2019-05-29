import { RxFormMapperConverter } from '../classes/rx-form-mapper-converter';
import { Class } from '../types';

export enum EFieldType {
	FORM_CONTROL = 'FORM_CONTROL',
	FORM_GROUP = 'FORM_GROUP',
	CUSTOM_CONVERTER = 'CUSTOM_CONVERTER'
}

export interface FieldDescriptor {
	target: Function;
	propertyName: string;
	fieldType: EFieldType;
	clazz: Class<any>;
	isArray: boolean;
	converterFn?: () => Class<RxFormMapperConverter<any>>;
}
