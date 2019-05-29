
import { RxFormMapperConverter } from '../classes/rx-form-mapper-converter';
import { EFieldType } from '../descriptors/field-descriptor';
import { MetadataDesignTypes } from '../reflect-metadata-design-types';
import { FormMapperStore } from '../store/form-mapper-store';
import { Class } from '../types';

export function Converter<T extends RxFormMapperConverter<any>>(converterFn: () => Class<T>) {
	return (targetObject: Object, propertyName: string) => {
		const clazz = Reflect.getMetadata(MetadataDesignTypes.TYPE, targetObject, propertyName);

		FormMapperStore.getInstance().fields.push({
			target: targetObject.constructor,
			clazz,
			propertyName,
			isArray: false,
			fieldType: EFieldType.CUSTOM_CONVERTER,
			converterFn
		});
	};
}
