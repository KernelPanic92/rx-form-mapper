import { ValidatorFn } from '@angular/forms';
import 'reflect-metadata';
import { FormMapperStore } from '../store/form-mapper-store';
import { isNil } from '../utils';

export function Validator(validator: ValidatorFn): (target: Object, propertyName?: string) => void {
	return (target: Object, propertyName?: string) => {
		FormMapperStore.getInstance().validators.push({
			target: isNil(propertyName) ? target : target.constructor as any,
			validator,
			propertyName,
		});
	};
}
