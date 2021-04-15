import { Type } from '@angular/core';
import { isFunction, isNil } from 'lodash';
import 'reflect-metadata';
import { RxValidator, RxAsyncValidator, UpdateOn, isType } from '..';
import { ModelBinder } from '../bind/model-binder';

export interface FormArrayOpts {
	validators?: RxValidator | RxValidator[];
	asyncValidators?: RxAsyncValidator | RxAsyncValidator[];
	updateOn?: UpdateOn;
	type: Type<any>;
}

export function FormArray(type: Type<any>): (target: Object, propertyName: string) => void;
export function FormArray(opts: FormArrayOpts): (target: Object, propertyName: string) => void;
export function FormArray(optsOrType: FormArrayOpts | Type<any>): (target: Object, propertyName: string) => void {
	return (target: any, propertyName: string) => {

		if (isNil(optsOrType)) {
			throw new Error(`unexpected FormArray configuration: ${optsOrType}`);
		}

		if (isType(optsOrType)) {
			optsOrType = { type: optsOrType };
		}

		ModelBinder.instance.bindFormArray(target, propertyName, optsOrType);
	};
}
