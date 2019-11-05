import { Type } from '@angular/core';
import { AsyncValidator, AsyncValidatorFn, Validator, ValidatorFn } from '@angular/forms';

export interface AbstractControlOpts {
	validators?: Type<Validator> | ValidatorFn | (Type<Validator> | ValidatorFn)[];
	asyncValidators?: Type<AsyncValidator> | AsyncValidatorFn | (Type<AsyncValidator> | AsyncValidatorFn) [];
	updateOn?: 'change' | 'blur' | 'submit';
	type?: Type<any>;
}
