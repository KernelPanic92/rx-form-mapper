import { AsyncValidator, AsyncValidatorFn, Validator, ValidatorFn } from '@angular/forms';
import { Class } from '../types';

export interface ValidatorDescriptor {
	target: Function;
	validator: ValidatorFn | Class<Validator> | AsyncValidatorFn | Class<AsyncValidator>;
	propertyName?: string;
	async: boolean;
	isFunction: boolean;
}
