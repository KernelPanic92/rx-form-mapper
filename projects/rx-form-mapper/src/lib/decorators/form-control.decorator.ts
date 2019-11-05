import 'reflect-metadata';
import { modelBinder } from './../bind/model-binder';
import { AbstractControlOpts } from './abstract-control-opts';

export function FormControl(opts?: AbstractControlOpts): (target: any, propertyName: string) => void {
	return (target: any, propertyName: string) => {

		modelBinder.bindFormControl(target, propertyName, opts);
	};
}
