import { ValidatorFn } from '@angular/forms';
import { isNil } from 'lodash';
import 'reflect-metadata';
import { FormMapperStore } from '../store/form-mapper-store';

export function Validator(validator: ValidatorFn): (target: Object, propertyName?: string) => void {
	return (target: Object, propertyName?: string) => {
		if (isNil(validator)) return;
		FormMapperStore.instance.validators.push({
			target: isNil(propertyName) ? target : target.constructor as any,
			validator,
			propertyName,
		});
	};
}
