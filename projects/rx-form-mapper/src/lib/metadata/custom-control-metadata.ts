
import { Type } from '@angular/core';
import { CustomControlMapper } from '../interfaces';
import { ControlVisitor } from './control-visitor';
import { ValidableMetadata } from './validable-metadata';

export class CustomControlMetadata extends ValidableMetadata {

	public constructor(public readonly mapper: Type<CustomControlMapper>) {
		super();
	}

	public accept<T>(visitor: ControlVisitor<T>): T {
		return visitor.visitCustomControlMetadata(this);
	}

}
