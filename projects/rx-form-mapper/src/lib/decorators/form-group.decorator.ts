import 'reflect-metadata';
import { modelBinder } from '../bind/model-binder';
import { FormGroupDecoratorOpts } from './form-group-opts.decorator';

export function FormGroup(opts?: Partial<FormGroupDecoratorOpts>): (target: any, propertyName: string) => void {
	return (target: any, propertyName: string) => {
		const defaultFormGroupDecoratorOpts: FormGroupDecoratorOpts = {
			asyncValidators: [],
			validators: []
		};
		const formGroupDecoratorOpts: FormGroupDecoratorOpts = Object.assign({}, defaultFormGroupDecoratorOpts, opts);

		modelBinder.bindFormGroup(target, propertyName, formGroupDecoratorOpts);
	};
}
