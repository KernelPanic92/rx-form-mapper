import { Injectable, Injector } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { get, head, isFunction, isNil, size } from 'lodash';
import { FieldDescriptor } from '../descriptors/field-descriptor';
import { FormMapperStore } from '../store/form-mapper-store';
import { Class } from '../types';

@Injectable()
export class FormValidatorAssignerService {

	constructor(private readonly injector: Injector) {}

	public assignValidators<T>(type: Class<T>, form: FormGroup) {
		if (isNil(form)) return;
		this.setValidators(type, form);
		this.setAsyncValidators( type, form);
		FormMapperStore.getInstance().findClassFields(type)
			.forEach(fieldDescriptor => {
				this.setValidators(type, form, fieldDescriptor);
				this.setAsyncValidators(type, form, fieldDescriptor);
			});
	}

	private setValidators<T>(type: Class<T>, abstractControl: AbstractControl, fieldDescriptor?: FieldDescriptor) {
		const control = fieldDescriptor ? abstractControl.get(fieldDescriptor.propertyName) : abstractControl;
		if (isNil(control)) return;
		const store = FormMapperStore.getInstance();
		const validatorDescriptors = fieldDescriptor ? store.findPropertyValidators(type, fieldDescriptor.propertyName) : store.findClassValidators(type);
		let validators = validatorDescriptors.map(v => v.validator);
		const controlValidator = control.validator;
		if (controlValidator) {
			validators = [...validators, controlValidator];
		}
		control.setValidators(size(validators) > 1 ? validators : head(validators));
	}

	private setAsyncValidators<T>( type: Class<T>, control: AbstractControl, fieldDescriptor?: FieldDescriptor) {
		if (isNil(control)) return;
		const store = FormMapperStore.getInstance();
		const validatorDescriptors = fieldDescriptor ? store.findPropertyAsyncValidators(type, fieldDescriptor.propertyName) : store.findClassAsyncValidators(type);
		const validators: AsyncValidatorFn[] = [];
		for (const descriptor of validatorDescriptors) {
			if (descriptor.type === 'AsyncValidatorFn') {
				validators.push(descriptor.validator);
			}
			if (descriptor.type === 'ServiceMethodFactory') {
				const service = this.injector.get(descriptor.service);
				const factoryMethod: Function = get(service, descriptor.methodFactoryName);
				if (isNil(factoryMethod)) {
					throw new Error(`No method '${descriptor.methodFactoryName}' in service [${descriptor.service.constructor.name}]`);
				}
				const methodArguments = descriptor.methodArguments || [];
				const validator = factoryMethod.call(service, ...methodArguments);
				if (isNil(validator) || !isFunction(validator)) {
					throw new Error(`Unexpected '${validator}' result at method factory '${descriptor.methodFactoryName}' in service [${descriptor.service.constructor.name}]`);
				}
				validators.push(validator);
			}
		}
		const controlValidator = control.asyncValidator;
		if (controlValidator) {
			validators.push(controlValidator);
		}
		control.setAsyncValidators(size(validators) > 1 ? validators : head(validators));
	}

}
