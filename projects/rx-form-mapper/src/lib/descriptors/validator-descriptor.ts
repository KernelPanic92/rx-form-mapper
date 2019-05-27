import { ValidatorFn } from '@angular/forms';

export interface ValidatorDescriptor {
	target: Function;
	validator: ValidatorFn;
	propertyName?: string;
}
