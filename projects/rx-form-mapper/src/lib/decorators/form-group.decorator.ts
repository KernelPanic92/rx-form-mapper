import 'reflect-metadata';
import { EFieldType } from '../descriptors/field-descriptor';
import { MetadataDesignTypes } from '../reflect-metadata-design-types';
import { FormMapperStore } from '../store/form-mapper-store';
import { Class } from '../types';
import { isNil } from '../utils';

export function FormGroup(): (target: Object, propertyName: string) => void;
export function FormGroup(type: () => Class<any>): (target: Object, propertyName: string) => void;
export function FormGroup(type?: () => Class<any>): (target: Object, propertyName: string) => void {
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
