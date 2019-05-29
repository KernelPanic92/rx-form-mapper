import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import { RxFormMapperConverter } from '../classes/rx-form-mapper-converter';
import { EFieldType, FieldDescriptor } from '../descriptors/field-descriptor';
import { FormMapperStore } from '../store/form-mapper-store';
import { Class } from '../types';
import { fromPairs, get, isNil, map } from '../utils';
import { FormValidatorAssignerService } from './form-validator-assigner.service';

@Injectable()
export class RxFormWriterService {

	constructor(private readonly formValidatorAssigner: FormValidatorAssignerService) {}
	public writeFormArray<T>(type: Class<T>, values: T[]): FormArray {
		if (isNil(type) || type as any === Array) {
			throw new Error(`unexpected type [${type ? type.name : type}]`);
		}
		return new FormArray(map(values, item => this.writeFormGroup(type, item)));
	}

	public writeFormGroup<T>(type: Class<T>, value: T): FormGroup {
		if (isNil(type) || type as any === Array) {
			throw new Error(`unexpected type [${type ? type.name : type}]`);
		}
		const fields = FormMapperStore.getInstance().findClassFields(type).map(f => this.writeFormField(value, f));
		const formGroup = new FormGroup(fromPairs([...fields]));
		this.formValidatorAssigner.assignValidators(type, formGroup);
		return formGroup;
	}

	private writeFormField<T>(targetValue: T, fieldDescriptor: FieldDescriptor): [string, AbstractControl] {
		const fieldValue = get(targetValue, fieldDescriptor.propertyName);
		const fieldType = fieldDescriptor.fieldType;
		let control: AbstractControl;
		if (fieldType === EFieldType.FORM_CONTROL) {
			control = new FormControl(fieldValue);
		} else if (fieldType === EFieldType.FORM_GROUP && !fieldDescriptor.isArray) {
			control = this.writeFormGroup(fieldDescriptor.clazz, fieldValue);
		} else if (fieldType === EFieldType.FORM_GROUP && fieldDescriptor.isArray) {
			control = this.writeFormArray(fieldDescriptor.clazz, fieldValue);
		} else if (EFieldType.CUSTOM_CONVERTER) {
			const converterType = fieldDescriptor.converterFn ? fieldDescriptor.converterFn() : undefined;
			if (isNil(converterType)) throw new Error(`unexpected type '${converterType}' at '${fieldDescriptor.propertyName}'`);
			const converterInstance: RxFormMapperConverter<any> = new (converterType as any)();
			control = converterInstance.toForm(fieldDescriptor.clazz, fieldValue);
		} else {
			throw new Error(`unexpected type at '${fieldDescriptor.propertyName}'`);
		}
		return [fieldDescriptor.propertyName, control];
	}
}
