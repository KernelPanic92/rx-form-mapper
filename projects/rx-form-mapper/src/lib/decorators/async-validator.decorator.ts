import { AsyncValidatorFn } from '@angular/forms';
import { isFunction, isNil } from 'lodash';
import 'reflect-metadata';
import { FormMapperStore } from '../store/form-mapper-store';
import { Class } from '../types';

export function AsyncValidator<T>(serviceClass: Class<T>, factoryMethod: keyof T, methodArguments?: any[]): (target: Object, propertyName?: string) => void;
export function AsyncValidator(AsyncValidator: AsyncValidatorFn): (target: Object, propertyName?: string) => void;
export function AsyncValidator(validatorOrServiceClass: AsyncValidatorFn | Class<any>, methodFactoryName?: string, methodArguments?: any[]): (target: Object, propertyName?: string) => void {
	return (target: Object, propertyName?: string) => {
		if (isFunction(validatorOrServiceClass) && isNil(methodFactoryName)) {
			FormMapperStore.getInstance().asyncValidators.push({
				type: 'AsyncValidatorFn',
				propertyName,
				target: isNil(propertyName) ? target : target.constructor as any,
				validator: validatorOrServiceClass
			});
		} else if (!isNil(validatorOrServiceClass.constructor)) {
			FormMapperStore.getInstance().asyncValidators.push({
				type: 'ServiceMethodFactory',
				propertyName,
				target: isNil(propertyName) ? target : target.constructor as any,
				service: validatorOrServiceClass,
				methodFactoryName,
				methodArguments
			});
		}

	};
}
