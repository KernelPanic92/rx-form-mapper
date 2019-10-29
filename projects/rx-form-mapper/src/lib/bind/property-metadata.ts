import { Type } from '@angular/core';
import { AsyncValidator, AsyncValidatorFn, Validator, ValidatorFn } from '@angular/forms';
import { EFieldType } from '.';

export interface PropertyMetadata {
	validators: (Type<Validator> | ValidatorFn)[];
	asyncValidators: (Type<AsyncValidator> | AsyncValidatorFn) [];
	propertyType: Type<any>;
	propertyGenericArgumentType?: Type<any>;
	fieldType: EFieldType;
}
