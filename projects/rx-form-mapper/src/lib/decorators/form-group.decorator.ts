import { Type } from '@angular/core';
import 'reflect-metadata';
import { EFieldType } from '../descriptors/field-descriptor';
import { MetadataDesignTypes } from '../reflect-metadata-design-types';
import { FormMapperStore } from '../store/form-mapper-store';
import { isNil } from '../utils';

export function FormGroup(): (target: Object, propertyName: string) => void;
export function FormGroup(type: () => Type<any>): (target: Object, propertyName: string) => void;
export function FormGroup(type?: () => Type<any>): (target: Object, propertyName: string) => void {
	return (target: Object, propertyName: string) => {
		const reflectedType = Reflect.getMetadata(MetadataDesignTypes.TYPE, target, propertyName);
		const isArray = reflectedType === Array;
		const clazz = isNil(type) ? reflectedType : type();

		FormMapperStore.getInstance().fields.push({
			clazz,
			propertyName,
			target: target.constructor,
			isArray,
			fieldType: EFieldType.FORM_GROUP
		});
	};
}
