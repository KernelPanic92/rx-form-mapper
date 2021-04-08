import { Type } from '@angular/core';
import { Validator, ValidatorFn, AsyncValidator, AsyncValidatorFn } from '@angular/forms';

export type RxValidator = Validator | ValidatorFn | Type<Validator>;
export type RxAsyncValidator = AsyncValidator | AsyncValidatorFn | Type<AsyncValidator>;
export type UpdateOn = 'change' | 'blur' | 'submit' | null | undefined;
