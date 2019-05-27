import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import { fromPairs, get, isEqual, isNil, map } from 'lodash';
import { EFieldType, FieldDescriptor } from '../descriptors/field-descriptor';
import { FormMapperStore } from '../store/form-mapper-store';
import { Class } from '../types';
import { FormValidatorAssignerService } from './form-validator-assigner.service';

@Injectable()
export class RxFormWriterService {

	constructor(private readonly formValidatorAssigner: FormValidatorAssignerService) {}
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
		const fields = FormMapperStore.getInstance().findClassFields(type).map(f => this.writeFormField(value, f));
		const formGroup = new FormGroup(fromPairs([...fields]));
		this.formValidatorAssigner.assignValidators(type, formGroup);
		return formGroup;
	}

	private writeFormField<T>(targetValue: T, FieldDescriptor: FieldDescriptor): [string, AbstractControl] {
		const fieldValue = get(targetValue, FieldDescriptor.propertyName);
		const fieldType = FieldDescriptor.fieldType;
		let control: AbstractControl;
		if (fieldType === EFieldType.FORM_CONTROL) {
			control = new FormControl(fieldValue);
		} else if (fieldType === EFieldType.FORM_GROUP && !FieldDescriptor.isArray) {
			control = this.writeFormGroup(FieldDescriptor.clazz, fieldValue);
		} else if (fieldType === EFieldType.FORM_GROUP && FieldDescriptor.isArray) {
			control = this.writeFormArray(FieldDescriptor.clazz, fieldValue);
		} else {
			throw new Error(`unexpected type at '${FieldDescriptor.propertyName}'`);
		}
		return [FieldDescriptor.propertyName, control];
	}
}