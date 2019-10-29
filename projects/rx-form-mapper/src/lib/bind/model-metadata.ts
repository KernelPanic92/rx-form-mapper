import { Type } from '@angular/core';
import { AsyncValidator, AsyncValidatorFn, Validator, ValidatorFn } from '@angular/forms';
import { PropertyMetadata } from '.';

export interface ModelMetadata {
	validators: (Type<Validator> | ValidatorFn)[];
	asyncValidators: (Type<AsyncValidator> | AsyncValidatorFn) [];
	properties: {[name: string]: PropertyMetadata};
}
