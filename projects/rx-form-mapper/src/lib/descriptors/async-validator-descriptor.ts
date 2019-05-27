import { AsyncValidatorFn } from '@angular/forms';
import { Class } from '../types';

export interface ServiceMethodFactoryAsyncValidatorDescriptor {
	target: Function;
	propertyName?: string;
	type: 'ServiceMethodFactory';
	service: Class<any>;
	methodFactoryName: string;
	methodArguments?: any[];
}

export interface ValidatorFnAsyncValidatorDescriptor {
	target: Function;
	propertyName?: string;
	type: 'AsyncValidatorFn';
	validator: AsyncValidatorFn;
}

export type AsyncValidatorDescriptor = ServiceMethodFactoryAsyncValidatorDescriptor | ValidatorFnAsyncValidatorDescriptor;
