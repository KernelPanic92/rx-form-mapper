import 'reflect-metadata';
import { EFieldType } from '../descriptors/field-descriptor';
import { MetadataDesignTypes } from '../reflect-metadata-design-types';
import { FormMapperStore } from '../store/form-mapper-store';

export function FormControl(): (target: Object, propertyName: string) => void {
	return (target: Object, propertyName: string) => {
		FormMapperStore.getInstance().fields.push({
			clazz: Reflect.getMetadata(MetadataDesignTypes.TYPE, target, propertyName),
			propertyName,
			target: target.constructor,
			isArray: false,
			fieldType: EFieldType.FORM_CONTROL
		});
	};
}
