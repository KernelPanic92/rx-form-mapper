import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { fromPairs, get, map, isNil, isEqual } from 'lodash';
import { FieldDescriptor, FieldType } from '../descriptors/field-descriptor';
import { FormMapperStore } from '../store/form-mapper-store';
import { Class } from '../types';
import { Injectable } from '@angular/core';

@Injectable()
export class RxFormWriterService {

	public writeFormArray<T>(type: Class<T>, values: T[]): FormArray {
		if (isNil(type) || isEqual(type, Array)) {
			throw new Error(`unexpected type [${type ? type.name : type}]`);
		}
		return new FormArray(map(values, item => this.writeFormGroup(type, item)));
	}

	public writeFormGroup<T>(type: Class<T>, value: T): FormGroup {
		if (isNil(type) || isEqual(type, Array)) {
			throw new Error(`unexpected type [${type ? type.name : type}]`);
		}
		const fields = FormMapperStore.instance.findFieldsByTarget(type).map(f => this.writeFormField(value, f));
		return new FormGroup(fromPairs([...fields]));
	}

	private writeFormField<T>(targetValue: T, FieldDescriptor: FieldDescriptor): [string, AbstractControl] {
		const fieldValue = get(targetValue, FieldDescriptor.propertyName);
		const fieldType = FieldDescriptor.fieldType;
		let control: AbstractControl;
		if (fieldType === FieldType.FORM_CONTROL) {
			control = new FormControl(fieldValue);
		} else if (fieldType === FieldType.FORM_GROUP && !FieldDescriptor.isArray) {
			control = this.writeFormGroup(FieldDescriptor.clazz, fieldValue);
		} else if (fieldType === FieldType.FORM_GROUP && FieldDescriptor.isArray) {
			control = this.writeFormArray(FieldDescriptor.clazz, fieldValue)
		} else {
			throw new Error(`unexpected type at '${FieldDescriptor.propertyName}'`);
		}
		return [FieldDescriptor.propertyName, control];
	}
}
