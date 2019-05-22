import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { RxFormReaderService } from './rx-form-reader.service';
import { RxFormWriterService } from './rx-form-writer.service';
import { Class } from '../types';
import { isNil, clone } from 'lodash';

@Injectable()
export class RxFormMapper {
	constructor(private readonly formWriter: RxFormWriterService, private readonly formReader: RxFormReaderService) {}

	public writeForm<T>(value: T[]): FormArray;
	public writeForm<T>(value: T): FormGroup;
	public writeForm<T>(clazz: Class<T>, value: T[]): FormArray;
	public writeForm<T>(clazz: Class<T>, value: T): FormGroup;
	public writeForm<T>(clazzOrValue: Class<T> | T | T[], value?: T | T[]): FormArray | FormGroup {
		if (isNil(clazzOrValue)) throw new Error(`unexpected [${clazzOrValue}] type`);
		const clazz = typeof(clazzOrValue) === 'function' ? clazzOrValue : Object.getPrototypeOf(clazzOrValue).constructor;
		value = typeof(clazzOrValue) === 'function'? value : clazzOrValue;
		if (Array.isArray(value)) {
			return this.formWriter.writeFormArray(clazz, value);
		} else {
			return this.formWriter.writeFormGroup(clazz, value);
		}
	}

	public readForm<T>(clazz: Class<T>, form: FormGroup): T;
	public readForm<T>(clazz: Class<T>, form: FormArray): T[];
	public readForm<T>(clazz: Class<T>, form: FormArray | FormGroup): T | T[] {
		if (form instanceof FormArray) {
			return this.formReader.readFormArray(clazz, form);
		} else {
			return this.formReader.readFormGroup(clazz, form);
		}
	}
}
