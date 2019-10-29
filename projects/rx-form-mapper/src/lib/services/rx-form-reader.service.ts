import { Injectable, Type } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { EFieldType } from '../bind';
import { PropertyMetadata } from '../bind/property-metadata';
import { isNil } from '../utils';
import { modelBinder } from './../bind/model-binder';

@Injectable()
export class RxFormReaderService {

	public readFormGroup<T>(type: Type<T>, form: FormGroup): T {
		if (isNil(form)) { return void 0; }
		const metadata = modelBinder.getMetadata(type);
		const modelInstance = new type();
		const fieldKeys = Object.keys(metadata.properties);

		for (const fieldKey of fieldKeys) {
			const fieldMetadata = metadata.properties[fieldKey];
			try {
				modelInstance[fieldKey] = this.readFormField(fieldMetadata, form.get(fieldKey));
			} catch (error) {
				throw new Error(`something wrong during reading property ${fieldKey}`);
			}
		}

		return modelInstance;
	}

	private readFormField(fieldMetadata: PropertyMetadata, abstractControl: AbstractControl): any {
		let fieldValue: any;
		if (isNil(abstractControl)) {
			fieldValue = void 0;
		} else if (fieldMetadata.fieldType === EFieldType.FORM_CONTROL) {
			if (!(abstractControl instanceof FormControl)) throw new Error('controller is not FormControl instance');
			fieldValue = abstractControl.value;
		} else if (fieldMetadata.fieldType === EFieldType.FORM_GROUP) {
			if (!(abstractControl instanceof FormGroup)) throw new Error('controller is not FormGroup instance');
			fieldValue = this.readFormGroup(fieldMetadata.propertyType, abstractControl);
		} else if (fieldMetadata.fieldType === EFieldType.FORM_ARRAY) {
			if (!(abstractControl instanceof FormArray)) throw new Error('controller is not FormArray instance');
			fieldValue = abstractControl.controls.map(fg => this.readFormGroup(fieldMetadata.propertyGenericArgumentType, fg as FormGroup));
		}
		return fieldValue;
	}
}
