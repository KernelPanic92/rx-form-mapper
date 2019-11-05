import { Type } from '@angular/core';
import { AbstractControl, AbstractControlOptions } from '@angular/forms';

export interface CustomControlMapper {
	writeForm(value: any, type: Type<any>, abstractControlOptions: AbstractControlOptions): AbstractControl;
	readForm(control: AbstractControl, type: Type<any>): any;
}
