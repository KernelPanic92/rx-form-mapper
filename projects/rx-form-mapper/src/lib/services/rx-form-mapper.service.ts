import { Injectable, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isNil } from '../utils';
import { RxFormReaderService } from './rx-form-reader.service';
import { RxFormWriterService } from './rx-form-writer.service';

@Injectable()
export class RxFormMapper {
	constructor(private readonly formWriter: RxFormWriterService, private readonly formReader: RxFormReaderService) {}

	public writeForm<T>(value: T): FormGroup;
	public writeForm<T>(value: T, type: Type<T>): FormGroup;
	public writeForm<T>(value: T, type?: Type<T>): FormGroup {
		if (isNil(value) && isNil(type)) throw new Error('type cannot be inferred implicitly');
		const valueType = isNil(type) ? Object.getPrototypeOf(value).constructor : type;

		return this.formWriter.writeModel(value, valueType);
	}

	public readForm<T>(form: FormGroup, type: Type<T> ): T {
		return this.formReader.readFormGroup(form, type);
	}
}
