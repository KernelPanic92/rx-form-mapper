import { ControlVisitor } from './control-visitor';
import { ValidableMetadata } from './validable-metadata';

export class FormControlMetadata extends ValidableMetadata {

	public accept<T>(visitor: ControlVisitor<T>): T {
		return visitor.visitFormControlMetadata(this);
	}

}
