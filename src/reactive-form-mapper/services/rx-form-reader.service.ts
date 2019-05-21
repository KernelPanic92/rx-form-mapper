import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { fromPairs } from 'lodash';
import { FieldDescriptor, FieldType } from '../descriptors/field-descriptor';
import { FormMapperStore } from '../store/form-mapper-store';
import { Class } from '../types';
import { Injectable } from '@angular/core';

@Injectable()
export class RxFormReaderService {

	public readFormArray<T>(type: Class<T>, form: FormArray): T[] {
		if (form == null) { return null; }
		return form.controls.map(control => this.readFormGroup(type, control as FormGroup));
	}

	public readFormGroup<T>(type: Class<T>, form: FormGroup): T {
		if (form == null) { return null; }
		const formControls = FormMapperStore.instance.fields.filter(input => input.target === type && input.fieldType === FieldType.FORM_CONTROL).map(formControl => this.readFormControlField(form, formControl));
		const formGroups = FormMapperStore.instance.fields.filter(input => input.target === type && input.fieldType === FieldType.FORM_GROUP).map(formControl => this.readFormGroupField(form, formControl));
		return Object.assign(new (type as any)(), fromPairs([ ...formControls, ...formGroups]));
	}

	private readFormControlField<T>(form: AbstractControl, fieldDescriptor: FieldDescriptor): [string, any] {
		const control = form.get(fieldDescriptor.propertyName);
		let fieldValue;
		if (control == null) {
			fieldValue = null;
		} else if (control instanceof FormControl && !fieldDescriptor.isArray) {
			fieldValue = control.value;
		} else {
			const AbstractControlType = Object.getPrototypeOf(control).constructor;
			throw new Error(`unexpected [${AbstractControlType.name}] at '${fieldDescriptor.propertyName}'`);
		}
		return [fieldDescriptor.propertyName, fieldValue];
	}

	private readFormGroupField<T>(form: AbstractControl, fieldDescriptor: FieldDescriptor): [string, any] {
		const control = form.get(fieldDescriptor.propertyName);
		let fieldValue;
		if (control == null) {
			fieldValue = null;
		} else if (control instanceof FormArray && fieldDescriptor.isArray) {
			fieldValue = this.readFormArray(fieldDescriptor.clazz, control);
		} else if (control instanceof FormGroup && !fieldDescriptor.isArray) {
			fieldValue = this.readFormGroup(fieldDescriptor.clazz, control);
		} else {
			throw new Error(`unexpected [${Object.getPrototypeOf(control).constructor.name}] at '${fieldDescriptor.propertyName}'`);
		}
		return [fieldDescriptor.propertyName, fieldValue];
	}
}
