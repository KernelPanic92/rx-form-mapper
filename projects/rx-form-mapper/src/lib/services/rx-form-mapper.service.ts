import { Injectable, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isNil } from '../utils';
import { RxFormReaderService } from './rx-form-reader.service';
import { RxFormWriterService } from './rx-form-writer.service';

@Injectable()
export class RxFormMapper {
	constructor(private readonly formWriter: RxFormWriterService, private readonly formReader: RxFormReaderService) {}

	public writeForm<T>(clazz: Type<T>): FormGroup;
	public writeForm<T>(value: T): FormGroup;
	public writeForm<T>(clazz: Type<T>, value: T): FormGroup;
	public writeForm<T>(clazzOrValue: Type<T> | T, value?: T): FormGroup {
		if (isNil(clazzOrValue)) throw new Error(`unexpected [${clazzOrValue}] type`);
		const clazz = typeof(clazzOrValue) === 'function' ? clazzOrValue : Object.getPrototypeOf(clazzOrValue).constructor;
		value = typeof(clazzOrValue) === 'function' ? value : clazzOrValue;
		return this.formWriter.writeModel(clazz, value);
	}

	public readForm<T>(clazz: Type<T>, form: FormGroup): T {
		return this.formReader.readFormGroup(clazz, form);
	}
}
