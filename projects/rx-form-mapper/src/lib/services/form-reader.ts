import { Type } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ControlVisitor, CustomControlMetadata, FormArrayMetadata, FormControlMetadata, FormGroupMetadata, FormMetadata } from '../metadata';
import { CustomMapperResolver } from './custom-mapper-resolver';

export class FormReader implements ControlVisitor<any> {

	public constructor(private readonly control: AbstractControl, private readonly customMapperResolver: CustomMapperResolver) {}

	public visitCustomControlMetadata(customControlMetadata: CustomControlMetadata): any {
		return this.customMapperResolver.resolve(customControlMetadata.mapper).readForm(this.control);
	}

	public visitFormArrayMetadata(formArrayMetadata: FormArrayMetadata): any {
		if (!this.control) {
			return void(0);
		}

		this.checkControlType(this.control, FormArray);

		return (this.control as FormArray).controls.map(control => {
			const subFormReader = this.copyPrototype(control);
			return formArrayMetadata.itemForm.accept(subFormReader);
		});
	}

	public visitFormControlMetadata(formControlMetadata: FormControlMetadata): any {
		if (!this.control) {
			return void(0);
		}

		this.checkControlType(this.control, FormControl);

		return this.control.value;
	}

	public visitFormGroupMetadata(formGroupMetadata: FormGroupMetadata): any {
		return this.visitFormMetadata(formGroupMetadata.form);
	}

	public visitFormMetadata(formMetadata: FormMetadata): any {
		if (!this.control) {
			return void(0);
		}

		this.checkControlType(this.control, FormGroup);

		const value = new formMetadata.type();
		const formGroup: FormGroup = this.control as FormGroup;

		for (const [key, controlMetadata] of Object.entries(formMetadata.controls)) {
			const formField = formGroup.controls[key];
			const formFieldReader = this.copyPrototype(formField);
			value[key] = controlMetadata.accept(formFieldReader);
		}

		return value;
	}

	private copyPrototype(control: AbstractControl): FormReader {
		return new FormReader(control, this.customMapperResolver);
	}

	private checkControlType(control: AbstractControl, type: Type<any>): void {
		if (control instanceof type) {
			return;
		}

		throw new Error(`control is not ${type.name} instance`);
	}

}
