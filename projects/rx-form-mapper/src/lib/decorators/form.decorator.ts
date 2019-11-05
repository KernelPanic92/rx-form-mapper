import 'reflect-metadata';
import { modelBinder } from '../bind/model-binder';
import { FormOpts } from './form-opts';

export function Form(opts?: FormOpts): (target: any) => void {
	return (target: any) => {
		modelBinder.bindForm(target, opts);
	};
}
