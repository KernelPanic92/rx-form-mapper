import { coerceArray } from '../utils';

describe('utils', () => {

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
