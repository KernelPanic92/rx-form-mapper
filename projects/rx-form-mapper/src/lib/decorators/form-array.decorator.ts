import { Type } from '@angular/core';
import 'reflect-metadata';
import { isFunction } from 'util';
import { modelBinder } from '../bind/model-binder';
import { FormArrayDecoratorOpts } from './form-array-opts.decorator';

type PartialFormArrayOpts = Partial<FormArrayDecoratorOpts> & Pick<FormArrayDecoratorOpts, 'type'>;

export function FormArray(type: Type<any>): (target: Object, propertyName: string) => void;
export function FormArray(opts: PartialFormArrayOpts): (target: Object, propertyName: string) => void;
export function FormArray(optsOrType: PartialFormArrayOpts | Type<any>): (target: Object, propertyName: string) => void {
	return (target: any, propertyName: string) => {

		const defaultFormGroupDecoratorOpts: FormArrayDecoratorOpts = {
			asyncValidators: [],
			validators: [],
			type: undefined
		};

		const formArrayDecoratorOpts: FormArrayDecoratorOpts = Object.assign({}, defaultFormGroupDecoratorOpts, isFunction(optsOrType) ? {type: optsOrType} : optsOrType );

		modelBinder.bindFormArray(target, propertyName, formArrayDecoratorOpts);
	};
}
