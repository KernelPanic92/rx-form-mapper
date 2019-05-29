import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Class } from '../types';
import { isNil } from '../utils';
import { RxFormReaderService } from './rx-form-reader.service';
import { RxFormWriterService } from './rx-form-writer.service';

@Injectable()
export class RxFormMapper {
	constructor(private readonly formWriter: RxFormWriterService, private readonly formReader: RxFormReaderService) {}

	public writeForm<T>(value: T[]): AbstractControl;
	public writeForm<T>(value: T): AbstractControl;
	public writeForm<T>(clazz: Class<T>, value: T[]): AbstractControl;
	public writeForm<T>(clazz: Class<T>, value: T): AbstractControl;
	public writeForm<T>(clazzOrValue: Class<T> | T | T[], value?: T | T[]): AbstractControl {
		if (isNil(clazzOrValue)) throw new Error(`unexpected [${clazzOrValue}] type`);
		const clazz = typeof(clazzOrValue) === 'function' ? clazzOrValue : Object.getPrototypeOf(clazzOrValue).constructor;
		value = typeof(clazzOrValue) === 'function' ? value : clazzOrValue;
		if (Array.isArray(value)) {
			return this.formWriter.writeFormArray(clazz, value);
		} else {
			return this.formWriter.writeFormGroup(clazz, value);
		}
	}

	public readForm<T>(clazz: Class<T>, form: AbstractControl): T;
	public readForm<T>(clazz: Class<T>, form: FormArray): T[];
	public readForm<T>(clazz: Class<T>, form: AbstractControl): T | T[] {
		if (form instanceof FormArray) {
			return this.formReader.readFormArray(clazz, form);
		} else {
			return this.formReader.readFormGroup(clazz, form);
		}
	}
}
