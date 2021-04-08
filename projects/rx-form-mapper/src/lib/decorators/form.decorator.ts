import 'reflect-metadata';
import { RxValidator, RxAsyncValidator, UpdateOn } from '..';
import { ModelBinder } from '../bind/model-binder';

export interface FormOpts {
	validators?: RxValidator | RxValidator[];
	asyncValidators?: RxAsyncValidator | RxAsyncValidator[];
	updateOn?: UpdateOn;
}

export function Form(opts?: FormOpts): (target: any) => void {
	return (target: any) => {
		ModelBinder.instance.bindForm(target, opts);
	};
}
