import 'reflect-metadata';
import { FormMapperStore } from '../store/form-mapper-store';
import { MetadataDesignTypes } from '../reflect-metadata-design-types';
import { Class } from '../types';
import { FieldType } from '../descriptors/field-descriptor';
import { isNil } from 'lodash';

export function FormGroup(): (target: Object, propertyName: string) => void;
export function FormGroup(type: () => Class<any>): (target: Object, propertyName: string) => void;
export function FormGroup(type?: () => Class<any>): (target: Object, propertyName: string) => void {
	return (target: Object, propertyName: string) => {
		const reflectedType = Reflect.getMetadata(MetadataDesignTypes.TYPE, target, propertyName);
		const isArray = reflectedType === Array;
		const clazz = isNil(type) ? reflectedType : type();

		FormMapperStore.instance.fields.push({
			clazz,
			propertyName,
			target: target.constructor,
			isArray,
			fieldType: FieldType.FORM_GROUP
		});
	};
}
