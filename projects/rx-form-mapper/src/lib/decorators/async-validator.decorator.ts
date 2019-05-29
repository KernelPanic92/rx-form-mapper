import { AsyncValidatorFn } from '@angular/forms';
import 'reflect-metadata';
import { FormMapperStore } from '../store/form-mapper-store';
import { Class } from '../types';
import { isFunction, isNil } from '../utils';

export function AsyncValidator<T>(serviceClass: Class<T>, factoryMethod: keyof T, methodArguments?: any[]): (target: Object, propertyName?: string) => void;
export function AsyncValidator(AsyncValidator: AsyncValidatorFn): (target: Object, propertyName?: string) => void;
export function AsyncValidator(validatorOrServiceClass: AsyncValidatorFn | Class<any>, methodFactoryName?: string, methodArguments?: any[]): (target: Object, propertyName?: string) => void {
	return (targetObject: Object, propertyName?: string) => {
		const target = isNil(propertyName) ? targetObject : targetObject.constructor as any;
		if (isFunction(validatorOrServiceClass) && isNil(methodFactoryName)) {
			FormMapperStore.getInstance().asyncValidators.push({
				type: 'AsyncValidatorFn',
				propertyName,
				target,
				validator: validatorOrServiceClass
			});
		} else if (!isNil(validatorOrServiceClass.constructor)) {
			FormMapperStore.getInstance().asyncValidators.push({
				type: 'ServiceMethodFactory',
				propertyName,
				target,
				service: validatorOrServiceClass,
				methodFactoryName,
				methodArguments
			});
		}

	};
}
