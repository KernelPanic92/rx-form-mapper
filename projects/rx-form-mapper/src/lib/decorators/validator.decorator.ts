import { Type } from '@angular/core';
import { AsyncValidator, AsyncValidatorFn, Validator, ValidatorFn } from '@angular/forms';
import 'reflect-metadata';
import { FormMapperStore } from '../store/form-mapper-store';
import { isNil } from '../utils';

export function Validator(validator: Type<AsyncValidator>, type: 'async'): (target: Object, propertyName?: string) => void;
export function Validator(validator: AsyncValidatorFn, type: 'async'): (target: Object, propertyName?: string) => void;
export function Validator(validator: Type<Validator>): (target: Object, propertyName?: string) => void;
export function Validator(validator: ValidatorFn): (target: Object, propertyName?: string) => void;
export function Validator(validator: Type<Validator> | ValidatorFn | Type<AsyncValidator> | AsyncValidatorFn, type?: 'async'): (target: Object, propertyName?: string) => void {
	return (target: Object, propertyName?: string) => {
		const isFunction = isNil(validator.prototype.validate);

		FormMapperStore.getInstance().validators.push({
			target: isNil(propertyName) ? target : target.constructor as any,
			validator,
			propertyName,
			isFunction,
			async: type === 'async'
		});
	};
}
