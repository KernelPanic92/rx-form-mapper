import { Type } from '@angular/core';
import { castArray, isFunction, isNil, negate } from 'lodash';

const isNotNil = negate(isNil);

export function coerceArray<T>(value: T | ReadonlyArray<T>): Array<T> {
	return castArray(value).filter(isNotNil);
}

export function isType(value: any): value is Type<any> {
	return isFunction(value);
}
