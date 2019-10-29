import { Type } from '@angular/core';
import { AsyncValidator, AsyncValidatorFn, Validator, ValidatorFn } from '@angular/forms';

export interface FormArrayDecoratorOpts {
	type: Type<any>;
	validators: (Type<Validator> | ValidatorFn)[];
	asyncValidators: (Type<AsyncValidator> | AsyncValidatorFn) [];
}
