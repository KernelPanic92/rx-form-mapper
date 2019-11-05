import 'reflect-metadata';
import { modelBinder } from '../bind/model-binder';
import { AbstractControlOpts } from './abstract-control-opts';

export function FormGroup(opts?: AbstractControlOpts): (target: any, propertyName: string) => void {
	return (target: any, propertyName: string) => {
		modelBinder.bindFormGroup(target, propertyName, opts);
	};
}
