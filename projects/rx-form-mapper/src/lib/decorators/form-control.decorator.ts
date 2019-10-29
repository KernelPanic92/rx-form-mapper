import 'reflect-metadata';
import { modelBinder } from './../bind/model-binder';
import { FormControlDecoratorOpts } from './form-control-opts.decorator';

export function FormControl(opts?: Partial<FormControlDecoratorOpts>): (target: any, propertyName: string) => void {
	return (target: any, propertyName: string) => {
		const defaultFormControlDecoratorOpts: FormControlDecoratorOpts = {
			asyncValidators: [],
			validators: []
		};

		const formControlDecoratorOpts: FormControlDecoratorOpts = Object.assign({}, defaultFormControlDecoratorOpts, opts);
		modelBinder.bindFormControl(target, propertyName, formControlDecoratorOpts);
	};
}
