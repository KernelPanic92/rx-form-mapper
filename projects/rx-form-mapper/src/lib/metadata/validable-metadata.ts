import { RxValidator, RxAsyncValidator, UpdateOn } from '..';
import { coerceArray } from '../utils';
import { ControlMetadata } from './control-metadata';
import { ControlVisitor } from './control-visitor';

export interface ValidationOpts {
	validators?: RxValidator | RxValidator[];
	asyncValidators?: RxAsyncValidator | RxAsyncValidator[];
	updateOn?: UpdateOn;
}

export abstract class ValidableMetadata implements ControlMetadata {

	private _validators: RxValidator[] = [];
	private _asyncValidators: RxAsyncValidator[] = [];
	private _updateOn: UpdateOn;

	public abstract accept<T>(visitor: ControlVisitor<T>): T;

	public setValidators(opts?: ValidationOpts): void {
		this._validators = coerceArray(opts?.validators);
		this._asyncValidators = coerceArray(opts?.asyncValidators);
		this._updateOn = opts?.updateOn;
	}

	public get validators(): RxValidator[] {
		return this._validators;
	}

	public get asyncValidators(): RxAsyncValidator[] {
		return this._asyncValidators;
	}

	public get updateOn(): UpdateOn {
		return this._updateOn;
	}

}
