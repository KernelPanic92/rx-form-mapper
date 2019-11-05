import { Type } from '@angular/core';
import 'reflect-metadata';
import { modelBinder } from '../bind/model-binder';
import { FormArrayOpts } from './form-array-control-opts';

export function FormArray(type: Type<any>): (target: Object, propertyName: string) => void;
export function FormArray(opts: FormArrayOpts): (target: Object, propertyName: string) => void;
export function FormArray(optsOrType: FormArrayOpts | Type<any>): (target: Object, propertyName: string) => void {
	return (target: any, propertyName: string) => {

		const defaultFormArrayOpts: FormArrayOpts = typeof(optsOrType) === 'object' ? optsOrType : {
			type: optsOrType
		};

		modelBinder.bindFormArray(target, propertyName, defaultFormArrayOpts);
	};
}
