import { ControlMetadata } from './control-metadata';
import { ControlVisitor } from './control-visitor';
import { FormMetadata } from './form-metadata';

export class FormGroupMetadata implements ControlMetadata {

	public constructor(public readonly form: FormMetadata) {}

	public accept<T>(visitor: ControlVisitor<T>): T {
		return visitor.visitFormGroupMetadata(this);
	}

}
