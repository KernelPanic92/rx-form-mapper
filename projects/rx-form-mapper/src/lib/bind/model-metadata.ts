import { Type } from '@angular/core';
import { AsyncValidator, AsyncValidatorFn, Validator, ValidatorFn } from '@angular/forms';
import { PropertyMetadata } from '.';
import { ValidatorMetadata } from '.';

export interface ModelMetadata extends ValidatorMetadata {
	validators: (Type<Validator> | ValidatorFn)[];
	asyncValidators: (Type<AsyncValidator> | AsyncValidatorFn) [];
	updateOn?: 'change' | 'blur' | 'submit';
	properties: {[name: string]: PropertyMetadata};
}
