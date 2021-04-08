import { AbstractControl, AbstractControlOptions } from '@angular/forms';


export interface CustomControlMapper {
	writeForm(value: any, abstractControlOptions: AbstractControlOptions): AbstractControl;
	readForm(control: AbstractControl): any;
}
