import { coerceArray, get, isFunction, isNil, size, trim } from '../utils';

describe('utils', () => {

	it('isNil should return true', () => {
		expect(isNil(null)).toBeTruthy();
		expect(isNil(undefined)).toBeTruthy();
	});

	it('isNil should return false', () => {
		expect(isNil(1)).toBeFalsy();
	});

	it('size should return zero', () => {
		expect(size(undefined)).toEqual(0);
		expect(size(null)).toEqual(0);
		expect(size([])).toEqual(0);
	});

	it('size should return length of array', () => {
		expect(size([7])).toEqual(1);
	});

	it('trim should return empty string', () => {
		expect(trim(undefined)).toEqual('');
		expect(trim('')).toEqual('');
		expect(trim(' ')).toEqual('');
	});

	it('get should return undefined', () => {
		expect(get(undefined, 'path')).toEqual(undefined);
	});

	it('get should return initial value', () => {
		expect(get({name: 'name'}, undefined)).toEqual({name: 'name'});
		expect(get({name: 'name'}, '')).toEqual({name: 'name'});
		expect(get({name: 'name'}, ' ')).toEqual({name: 'name'});
	});

	it('get should return undefined when field is not present', () => {
		expect(get({}, 'person.name')).toEqual(undefined);
	});

	it('isFunction should return true', () => {
		expect(isFunction(() => null)).toBeTruthy();
	});

	it('coerceArray should return array when value is array', () => {
		expect(Array.isArray(coerceArray([]))).toBeTruthy();
	});

	it('coerceArray should return array when value is not array', () => {
		expect(Array.isArray(coerceArray(1))).toBeTruthy();
	});

	it('coerceArray should return array when value is undefined', () => {
		expect(Array.isArray(coerceArray(undefined))).toBeTruthy();
	});
});
