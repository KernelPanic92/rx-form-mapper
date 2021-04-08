import { InjectFlags, Injector, Type } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { CustomControlMapper } from '..';
import { ControlVisitor, CustomControlMetadata, FormArrayMetadata, FormControlMetadata, FormGroupMetadata, FormMetadata } from '../metadata';

export class FormReader implements ControlVisitor<any> {

	public constructor(private readonly control: AbstractControl, private readonly injector: Injector) {}

	public visitCustomControlMetadata(customControlMetadata: CustomControlMetadata): any {
		return this.resolveCustomMapper(customControlMetadata.mapper).readForm(this.control);
	}

	public visitFormArrayMetadata(formArrayMetadata: FormArrayMetadata) {
		if (!this.control) {
			return void 0;
		}

		if (!(this.control instanceof FormArray)) {
			throw new Error('controller is not FormArray instance');
		}

		return this.control.controls.map(control => {
			const subFormReader = this.copyPrototype(control);
			return formArrayMetadata.itemForm.accept(subFormReader);
		});
	}

	public visitFormControlMetadata(formControlMetadata: FormControlMetadata) {
		if (!this.control) {
			return void 0;
		}

		if (!(this.control instanceof FormControl)) {
			throw new Error('controller is not FormControl instance');
		}

		return this.control.value;
	}

	public visitFormGroupMetadata(formGroupMetadata: FormGroupMetadata) {
		if (!this.control) {
			return void 0;
		}

		if (!(this.control instanceof FormGroup)) {
			throw new Error('controller is not FormGroup instance');
		}

		return this.visitFormMetadata(formGroupMetadata.form);
	}

	public visitFormMetadata(formMetadata: FormMetadata) {
		if (!this.control) {
			return void 0;
		}

		const value = new formMetadata.type();
		const formGroup: FormGroup = this.control as FormGroup;

		for (const [key, controlMetadata] of Object.entries(formMetadata.controls)) {
			const formField = formGroup.controls[key];
			const formFieldReader = this.copyPrototype(formField);
			value[key] = controlMetadata.accept(formFieldReader);
		}

		return value;
	}

	private resolveCustomMapper(mapperType: Type<CustomControlMapper>): CustomControlMapper {
		return this.injector.get(mapperType, null, InjectFlags.Optional) ?? new mapperType();
	}

	private copyPrototype(control: AbstractControl): FormReader {
		return new FormReader(control, this.injector);
	}

}
