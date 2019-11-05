import { Type } from '@angular/core';
import { ControlType, ValidatorMetadata } from '.';
import { CustomControlMapper } from '../interfaces/custom-control-mapper';

export interface PropertyMetadata extends ValidatorMetadata {
	propertyType: Type<any>;
	propertyGenericArgumentType?: Type<any>;
	type: ControlType;
	customMapper?: Type<CustomControlMapper>;
}
