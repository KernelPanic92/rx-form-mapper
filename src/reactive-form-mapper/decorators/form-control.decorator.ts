import 'reflect-metadata';
import { FormMapperStore } from '../store/form-mapper-store';
import { MetadataDesignTypes } from '../reflect-metadata-design-types';
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
