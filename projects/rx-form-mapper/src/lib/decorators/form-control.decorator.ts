import 'reflect-metadata';
import { RxAsyncValidator, RxValidator, UpdateOn } from '../types';
import { ModelBinder } from './../bind/model-binder';

export interface FormControlOpts {
	validators?: RxValidator | RxValidator[];
	asyncValidators?: RxAsyncValidator | RxAsyncValidator[];
	updateOn?: UpdateOn;
}

export function FormControl(opts?: FormControlOpts): (target: any, propertyName: string) => void {
	return (target: any, propertyName: string) => {
		ModelBinder.instance.bindFormControl(target, propertyName, opts);
	};
}
