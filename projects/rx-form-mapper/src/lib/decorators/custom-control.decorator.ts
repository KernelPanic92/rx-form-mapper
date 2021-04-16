import { Type } from '@angular/core';
import { isNil } from 'lodash';
import 'reflect-metadata';
import { RxValidator, RxAsyncValidator } from '..';
import { CustomControlMapper } from '../interfaces/custom-control-mapper';
import { UpdateOn } from '../types';
import { ModelBinder } from './../bind/model-binder';

export interface CustomControlOpts {
	mapper: Type<CustomControlMapper>,
	validators?: RxValidator | RxValidator[];
	asyncValidators?: RxAsyncValidator | RxAsyncValidator[];
	updateOn?: UpdateOn;
}

export function CustomControl(mapper: Type<CustomControlMapper>): (target: any, propertyName: string) => void;
export function CustomControl(opts: CustomControlOpts): (target: any, propertyName: string) => void;
export function CustomControl(optsOrMapper: Type<CustomControlMapper> | CustomControlOpts): (target: any, propertyName: string) => void {
	return (target: any, propertyName: string) => {

		if (isNil(optsOrMapper)) {
			throw new Error(`unexpected CustomControl configuration: ${optsOrMapper}`);
		}

		if (typeof(optsOrMapper) !== 'object') {
			optsOrMapper = { mapper: optsOrMapper };
		}

		ModelBinder.instance.bindCustomControl(target, propertyName, optsOrMapper);
	};
}
