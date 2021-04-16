import { Injectable, InjectFlags, Injector } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { isFunction } from 'lodash';
import { RxAsyncValidator, RxValidator } from '../types';

@Injectable()
export class ValidatorResolver {

	public constructor(private readonly injector: Injector) {}

	public resolve(validator: RxAsyncValidator): AsyncValidatorFn;
	public resolve(validator: RxValidator): ValidatorFn;
	public resolve(validator: any): any {

		if (this.isValidatorFn(validator)) {
			return validator;
		}

		let validatorInstance = null;

		if (this.isValidatorInstance(validator)) {
			validatorInstance = validator;
		} else {
			validatorInstance = this.injector.get(validator as any, null, InjectFlags.Optional);
			validatorInstance ??= new validator();
		}

		return (c: AbstractControl) => validatorInstance.validate(c);

	}

	private isValidatorFn(value: any): boolean {
		return isFunction(value) && !value.prototype.validate;
	}

	private isValidatorInstance(value: any): boolean {
		return 'validate' in value;
	}
}
