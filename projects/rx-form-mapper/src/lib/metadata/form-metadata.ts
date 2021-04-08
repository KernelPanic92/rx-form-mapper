import { Type } from '@angular/core';
import { CustomControlMapper } from '../interfaces';
import { ControlVisitor } from './control-visitor';
import { CustomControlMetadata } from './custom-control-metadata';
import { FormArrayMetadata } from './form-array-metadata';
import { FormControlMetadata } from './form-control-metadata';
import { FormGroupMetadata } from './form-group-metadata';
import { ValidableMetadata, ValidationOpts } from './validable-metadata';

type FormPropertyMetadata = FormControlMetadata | FormGroupMetadata | FormArrayMetadata;

export class FormMetadata extends ValidableMetadata {

	private _controls: {[key: string]: FormPropertyMetadata} = {};

	public constructor(public readonly type: Type<any>) {
		super();
	}

	public accept<T>(visitor: ControlVisitor<T>): T {
		return visitor.visitFormMetadata(this);
	}

	public get controls(): {[key: string]: FormPropertyMetadata} {
		return this._controls;
	}

	public setFormControl(name: string, opts: ValidationOpts): void {
		const control = new FormControlMetadata();
		control.setValidators(opts);
		this.controls[name] = control;
	}

	public setFormGroup(name: string, form: FormMetadata): void {
		const control = new FormGroupMetadata(form);
		this.controls[name] = control;
	}

	public setCustomControl(name: string, mapper: Type<CustomControlMapper>, opts: ValidationOpts): void {
		const control = new CustomControlMetadata(mapper);
		control.setValidators(opts);
		this.controls[name] = control;
	}

	public setFormArray(name: string, itemform: FormMetadata, opts: ValidationOpts): void {
		const control = new FormArrayMetadata(itemform);
		control.setValidators(opts);
		this.controls[name] = control;
	}

}
