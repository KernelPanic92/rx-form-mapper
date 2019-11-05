import { Injectable, Type } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { PropertyMetadata } from '../bind/property-metadata';
import { isNil } from '../utils';
import { ControlType } from './../bind/control-type';
import { modelBinder } from './../bind/model-binder';

@Injectable()
export class RxFormReaderService {

	public readFormGroup<T>(form: FormGroup, type: Type<T>): T {
		if (isNil(form)) { return void 0; }
		if (isNil(type)) throw new Error('type cannot be inferred implicitly');

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
		} else if (fieldMetadata.type === ControlType.FORM_CONTROL) {
			if (!(abstractControl instanceof FormControl)) throw new Error('controller is not FormControl instance');
			fieldValue = abstractControl.value;
		} else if (fieldMetadata.type === ControlType.FORM_GROUP) {
			if (!(abstractControl instanceof FormGroup)) throw new Error('controller is not FormGroup instance');
			fieldValue = this.readFormGroup(abstractControl, fieldMetadata.propertyType);
		} else if (fieldMetadata.type === ControlType.FORM_ARRAY) {
			if (!(abstractControl instanceof FormArray)) throw new Error('controller is not FormArray instance');
			fieldValue = abstractControl.controls.map(fg => this.readFormGroup(fg as FormGroup, fieldMetadata.propertyGenericArgumentType));
		}
		return fieldValue;
	}
}
