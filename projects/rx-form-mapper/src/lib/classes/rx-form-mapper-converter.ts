import { AbstractControl } from '@angular/forms';
import { Class } from '../types';

export abstract class RxFormMapperConverter<T> {
	public abstract toModel(type: Class<T>, abstractControl: AbstractControl): T;
	public abstract toForm(type: Class<T>, value: T): AbstractControl;
}
