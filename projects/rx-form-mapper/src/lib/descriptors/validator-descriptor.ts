import { Type } from '@angular/core';
import { AsyncValidator, AsyncValidatorFn, Validator, ValidatorFn } from '@angular/forms';

export interface ValidatorDescriptor {
	target: Function;
	validator: ValidatorFn | Type<Validator> | AsyncValidatorFn | Type<AsyncValidator>;
	propertyName?: string;
	async: boolean;
	isFunction: boolean;
}
