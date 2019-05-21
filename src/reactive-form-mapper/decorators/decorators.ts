import 'reflect-metadata';
import { FormMapperStore } from '../store/form-mapper-store';
import { MetadataDesignTypes } from '../reflect-metadata-design-types';
import { Class } from '../types';
import { FieldType } from '../descriptors/field-descriptor';

export function FormControl(): (target: Object, propertyName: string) => void {
	return (target: Object, propertyName: string) => {
		FormMapperStore.instance.fields.push({
			clazz: Reflect.getMetadata(MetadataDesignTypes.TYPE, target, propertyName),
			propertyName,
			target: target.constructor,
			isArray: false,
			fieldType: FieldType.FORM_CONTROL
		});
	};
}

export function FormGroup(): (target: Object, propertyName: string) => void;
export function FormGroup(type: () => Class<any>): (target: Object, propertyName: string) => void;
export function FormGroup(type?: () => Class<any>): (target: Object, propertyName: string) => void {
	return (target: Object, propertyName: string) => {
		const reflectedType = Reflect.getMetadata(MetadataDesignTypes.TYPE, target, propertyName);
		const isArray = reflectedType === Array;
		const clazz = type == null ? reflectedType : type();

		FormMapperStore.instance.fields.push({
			clazz,
			propertyName,
			target: target.constructor,
			isArray,
			fieldType: FieldType.FORM_GROUP
		});
	};
}
