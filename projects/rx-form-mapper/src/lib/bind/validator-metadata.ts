import { Type } from '@angular/core';
import { AsyncValidator, AsyncValidatorFn, Validator, ValidatorFn } from '@angular/forms';

export interface ValidatorMetadata {
	validators: (Type<Validator> | ValidatorFn)[];
	asyncValidators: (Type<AsyncValidator> | AsyncValidatorFn) [];
	updateOn?: 'change' | 'blur' | 'submit';
}
