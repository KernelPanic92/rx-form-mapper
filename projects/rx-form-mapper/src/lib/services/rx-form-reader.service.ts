import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { fromPairs, isEqual, isNil, map } from 'lodash';
import { EFieldType, FieldDescriptor } from '../descriptors/field-descriptor';
import { FormMapperStore } from '../store/form-mapper-store';
import { Class } from '../types';

@Injectable()
export class RxFormReaderService {

	public readFormArray<T>(type: Class<T>, form: FormArray): T[] {
		if (isNil(form)) {
			return void 0;
		}

		if (! (form instanceof FormArray)) {
			throw new Error(`unexpected [${this.getClassName(form)}] at [${type.name || type.constructor.name}]`);
		}

		if (isEqual(type, Array)) {
			throw new Error(`unexpected [Array] type`);
		}

		return map(form.controls, control => this.readFormGroup(type, control as FormGroup));
	}

	public readFormGroup<T>(type: Class<T>, form: FormGroup): T {
		if (isNil(form)) { return void 0; }
		if (! (form instanceof FormGroup)) {
			throw new Error(`unexpected [${this.getClassName(form)}] at [${type.name || type.constructor.name}]`);
		}
		const fields = FormMapperStore.getInstance().findClassFields(type).map(f => this.readFormField(form, f));
		return Object.assign(new (type as any)(), fromPairs(fields));
	}

	private readFormField(form: AbstractControl, fieldDescriptor: FieldDescriptor): [string, any] {
		const control = form.get(fieldDescriptor.propertyName);
		let fieldValue: any;
		if (isNil(control)) {
			fieldValue = void 0;
		} else if (control instanceof FormControl && fieldDescriptor.fieldType === EFieldType.FORM_CONTROL) {
			fieldValue = control.value;
		} else if (control instanceof FormGroup && fieldDescriptor.fieldType === EFieldType.FORM_GROUP && !fieldDescriptor.isArray) {
			fieldValue = this.readFormGroup(fieldDescriptor.clazz, control);
		} else if (control instanceof FormArray && fieldDescriptor.fieldType === EFieldType.FORM_GROUP && fieldDescriptor.isArray) {
			fieldValue = this.readFormArray(fieldDescriptor.clazz, control);
		} else {
			const expected = fieldDescriptor.isArray && fieldDescriptor.fieldType === EFieldType.FORM_GROUP ? 'FORM_ARRAY' : fieldDescriptor.fieldType;
			throw new Error(`unexpected [${this.getClassName(control)}] at '${fieldDescriptor.propertyName}' in [${fieldDescriptor.target.name}]. Expected ${expected}`);
		}
		return [fieldDescriptor.propertyName, fieldValue];
	}

	private getClassName<T>(instance: T): string {
		return Object.getPrototypeOf(instance).constructor.name;
	}
}
