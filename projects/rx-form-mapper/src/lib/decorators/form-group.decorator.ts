import { Type } from '@angular/core';
import 'reflect-metadata';
import { ModelBinder } from '../bind/model-binder';

export function FormGroup(type?: Type<any>): (target: any, propertyName: string) => void {
	return (target: any, propertyName: string) => {
		ModelBinder.instance.bindFormGroup(target, propertyName, type);
	};
}
