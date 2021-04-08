import { InjectFlags, Injector, Type } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormArray, Validator, ValidatorFn, FormControl, FormGroup } from '@angular/forms';

import { CustomControlMapper } from '../interfaces';
import { ControlVisitor, CustomControlMetadata, FormArrayMetadata, FormControlMetadata, FormGroupMetadata, FormMetadata, ValidableMetadata } from '../metadata';
import { CustomMapperResolver } from './custom-mapper-resolver';
import { ValidatorResolver } from './validator-resolver';

export class FormWriter implements ControlVisitor<AbstractControl> {

	public constructor(private readonly value: any, private readonly customMapperResolver: CustomMapperResolver, private readonly validatorResolver: ValidatorResolver) {}

	public visitCustomControlMetadata(customControlMetadata: CustomControlMetadata): AbstractControl {
		const mapper = this.customMapperResolver.resolve(customControlMetadata.mapper);
		return mapper.writeForm(this.value, this.buildAbstractControlOptions(customControlMetadata))
	}

	public visitFormArrayMetadata(formArrayMetadata: FormArrayMetadata): AbstractControl {
		const values: any[] = this.value ?? [];
		const controls: AbstractControl[] = [];

		for (const item of values) {
			const subWriter = this.copyPrototype(item);
			const control = formArrayMetadata.itemForm.accept(subWriter);
			controls.push(control);
		}

		return new FormArray(controls, this.buildAbstractControlOptions(formArrayMetadata));
	}

	public visitFormControlMetadata(formControlMetadata: FormControlMetadata): AbstractControl {
		return new FormControl(this.value, this.buildAbstractControlOptions(formControlMetadata));
	}

	public visitFormGroupMetadata(formGroupMetadata: FormGroupMetadata): AbstractControl {
		return this.visitFormMetadata(formGroupMetadata.form);
	}

	public visitFormMetadata(formMetadata: FormMetadata): AbstractControl {
		const controls: { [key: string]: AbstractControl } = {};

		for (const [key, controlMetadata] of Object.entries(formMetadata.controls)) {
			const fieldValue = this.value?.[key];
			const subWriter = this.copyPrototype(fieldValue);
			controls[key] = controlMetadata.accept(subWriter);
		}

		return new FormGroup(controls, this.buildAbstractControlOptions(formMetadata));
	}


	private buildAbstractControlOptions(metadata: ValidableMetadata): AbstractControlOptions {
		return {
			validators: metadata.validators.map(v => this.validatorResolver.resolve(v)),
			asyncValidators: metadata.asyncValidators.map(v => this.validatorResolver.resolve(v)),
			updateOn: metadata.updateOn
		};
	}

	private copyPrototype(value: any): FormWriter {
		return new FormWriter(value, this.customMapperResolver, this.validatorResolver);
	}

}
