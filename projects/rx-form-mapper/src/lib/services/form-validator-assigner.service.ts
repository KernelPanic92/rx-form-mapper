import { Injectable, InjectFlags, Injector, Type } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, FormGroup, Validator, ValidatorFn } from '@angular/forms';
import { FieldDescriptor } from '../descriptors/field-descriptor';
import { ValidatorDescriptor } from '../descriptors/validator-descriptor';
import { FormMapperStore } from '../store/form-mapper-store';
import { Class } from '../types';
import { isNil } from '../utils';
import { ValidatorInjector } from './validator.injector';

@Injectable()
export class FormValidatorAssignerService {

	constructor(private readonly injector: Injector) {}

	public assignValidators<T>(type: Class<T>, form: FormGroup) {
		if (isNil(form)) return;
		this.setValidators(type, form);
		FormMapperStore.getInstance().findClassFields(type)
			.forEach(fieldDescriptor => {
				this.setValidators(type, form, fieldDescriptor);
			});
	}

	private setValidators<T>(type: Class<T>, abstractControl: AbstractControl, fieldDescriptor?: FieldDescriptor) {
		const control = this.extractControl(abstractControl, fieldDescriptor);
		if (isNil(control)) return;
		const store = FormMapperStore.getInstance();
		const validatorDescriptors = fieldDescriptor ? store.findPropertyValidators(type, fieldDescriptor.propertyName) : store.findClassValidators(type);
		validatorDescriptors.forEach(v => this.setValidator(control, v));
	}

	private setValidator(control: AbstractControl, validatorDescriptor: ValidatorDescriptor): void {

		const controlValidator = validatorDescriptor.async ? control.asyncValidator : control.validator;
		const validator = this.buildValidator(validatorDescriptor);
		const validators = [validator];
		if (!isNil(controlValidator)) {
			validators.push(controlValidator);
		}

		if (validatorDescriptor.async) {
			control.setAsyncValidators(validators as any);
		} else {
			control.setValidators(validators as any);
		}
	}

	private buildValidator(validatorDescriptor: ValidatorDescriptor): Validator | ValidatorFn | AsyncValidator | AsyncValidatorFn {
		if (validatorDescriptor.isFunction) return validatorDescriptor.validator as any;
		const validatorInjector = new ValidatorInjector(this.injector, validatorDescriptor);
		// tslint:disable-next-line: no-bitwise
		const isInjectable = !isNil(validatorInjector.get(validatorDescriptor.validator as Type<any>, null, InjectFlags.Optional | InjectFlags.Self));

		return isInjectable ? validatorInjector.get(validatorDescriptor.validator) : new (validatorDescriptor.validator as any)();
	}

	private extractControl(control: AbstractControl, fieldDescriptor?: FieldDescriptor): AbstractControl {
		if (!control) return void 0;
		return fieldDescriptor ? control.get(fieldDescriptor.propertyName) : control;
	}
}
