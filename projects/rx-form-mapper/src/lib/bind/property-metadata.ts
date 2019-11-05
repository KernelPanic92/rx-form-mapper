import { Type } from '@angular/core';
import { ControlType, ValidatorMetadata } from '.';

export interface PropertyMetadata extends ValidatorMetadata {
	propertyType: Type<any>;
	propertyGenericArgumentType?: Type<any>;
	type: ControlType;
}
