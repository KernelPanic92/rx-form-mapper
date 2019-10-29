import { Type } from '@angular/core';
import { Validator, ValidatorFn } from '@angular/forms';
import 'reflect-metadata';
import { modelBinder } from './../bind/model-binder';

export function Validators(...validators: (Type<Validator> | ValidatorFn)[]): (target: Object) => void {
	return (target: any) => {
		modelBinder.bindValidators(target, validators || []);
	};
}
