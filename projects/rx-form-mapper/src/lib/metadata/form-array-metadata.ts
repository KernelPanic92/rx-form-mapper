import { ControlVisitor } from './control-visitor';
import { FormMetadata } from './form-metadata';
import { ValidableMetadata } from './validable-metadata';

export class FormArrayMetadata extends ValidableMetadata {

	public constructor(public readonly itemForm: FormMetadata) {
		super();
	}

	public accept<T>(visitor: ControlVisitor<T>): T {
		return visitor.visitFormArrayMetadata(this);
	}

}
