import { Type } from '@angular/core';
import { AsyncValidator, AsyncValidatorFn } from '@angular/forms';
import 'reflect-metadata';
import { modelBinder } from '../bind/model-binder';

export function AsyncValidators(...validators: (Type<AsyncValidator> | AsyncValidatorFn)[]): (target: Object, propertyName?: string) => void {
	return (target: any, propertyName?: string) => {
		modelBinder.bindAsyncValidators(target, validators || []);
	};
}
