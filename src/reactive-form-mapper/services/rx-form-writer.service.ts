import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { fromPairs } from 'lodash';
import { FieldDescriptor, FieldType } from '../descriptors/field-descriptor';
import { FormMapperStore } from '../store/form-mapper-store';
import { Class } from '../types';
import { Injectable } from '@angular/core';

@Injectable()
export class RxFormWriterService {

	public writeFormArray<T>(type: Class<T>, value: T[]): FormArray {
		return new FormArray(value == null ? [] : value.map(item => this.writeFormGroup(type, item)));
	}

	public writeFormGroup<T>(type: Class<T>, value: T): FormGroup {
		const formControls = FormMapperStore.instance.fields.filter(input => input.target === type && input.fieldType === FieldType.FORM_CONTROL).map(formControl => this.writeFormControlField(value, formControl));
		const formGroups = FormMapperStore.instance.fields.filter(input => input.target === type && input.fieldType === FieldType.FORM_GROUP).map(formControl => this.writeFormGroupField(value, formControl));
		return new FormGroup(fromPairs([...formControls, ...formGroups]));
	}

	private writeFormControlField<T>(targetValue: T, formControlDescriptor: FieldDescriptor): [string, AbstractControl] {
		const fieldValue = targetValue == null ? null : targetValue[formControlDescriptor.propertyName];
		return [formControlDescriptor.propertyName, new FormControl(fieldValue)];
	}

	private writeFormGroupField<T>(targetValue: T, formGroupDescriptor: FieldDescriptor): [string, AbstractControl] {
		const fieldValue = targetValue == null ? null : targetValue[formGroupDescriptor.propertyName];
		const control = formGroupDescriptor.isArray ?
			this.writeFormArray(formGroupDescriptor.clazz, fieldValue) :
			this.writeFormGroup(formGroupDescriptor.clazz, fieldValue);
		return [formGroupDescriptor.propertyName, control];
	}
}
