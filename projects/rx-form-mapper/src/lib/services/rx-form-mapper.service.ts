import { Injectable, Injector, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isNil } from 'lodash';
import { ModelBinder } from '../bind';
import { CustomMapperResolver } from './custom-mapper-resolver';
import { FormReader } from './form-reader';
import { FormWriter } from './form-writer';
import { ValidatorResolver } from './validator-resolver';

@Injectable()
export class RxFormMapper {
	constructor(private readonly injector: Injector) {}

	public writeForm<T>(value: T): FormGroup;
	public writeForm<T>(value: T, type: Type<T>): FormGroup;
	public writeForm<T>(value: T, type?: Type<T>): FormGroup {
		if (isNil(value) && isNil(type)) {
			throw new Error('type cannot be inferred implicitly');
		}

		const valueType = type ?? Object.getPrototypeOf(value).constructor;
		const formWriter = new FormWriter(value, new CustomMapperResolver(this.injector), new ValidatorResolver(this.injector));
		return ModelBinder.instance.getMetadata(valueType).accept(formWriter) as FormGroup;

	}

	public readForm<T>(form: FormGroup, type: Type<T> ): T {
		if (isNil(type)) {
			throw new Error('type cannot be inferred implicitly');
		}

		if (isNil(form)) {
			return void(0);
		}

		const formReader = new FormReader(form, this.injector);
		return ModelBinder.instance.getMetadata(type).accept(formReader);
	}
}
