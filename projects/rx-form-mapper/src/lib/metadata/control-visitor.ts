import { FormControlMetadata } from './form-control-metadata';
import { FormGroupMetadata } from './form-group-metadata';
import { FormMetadata } from './form-metadata';
import { FormArrayMetadata } from './form-array-metadata';
import { CustomControlMetadata } from './custom-control-metadata';

export interface ControlVisitor<T> {
	visitCustomControlMetadata(customControlMetadata: CustomControlMetadata): T;
	visitFormArrayMetadata(formArrayMetadata: FormArrayMetadata): T;
	visitFormControlMetadata(formControlMetadata: FormControlMetadata): T;
	visitFormGroupMetadata(formGroupMetadata: FormGroupMetadata): T;
	visitFormMetadata(formMetadata: FormMetadata): T;
}
