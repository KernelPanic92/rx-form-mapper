import { Type } from '@angular/core';
import 'reflect-metadata';
import { CustomControlMapper } from '../interfaces/custom-control-mapper';
import { modelBinder } from './../bind/model-binder';
import { AbstractControlOpts } from './abstract-control-opts';

export function CustomControl<T>(mapper: Type<CustomControlMapper>, opts?: AbstractControlOpts): (target: any, propertyName: string) => void {
	return (target: any, propertyName: string) => {

		modelBinder.bindCustomControl(target, propertyName, mapper, opts);
	};
}
