import { coerceArray } from '../utils';

describe('utils', () => {

	it('coerceArray should return array when value is array', () => {
		expect(coerceArray([1])).toEqual([1]);
	});

	it('coerceArray should return array when value is empty array', () => {
		expect(coerceArray([])).toEqual([]);
	});

	it('coerceArray should return array when value is not array', () => {
		expect(coerceArray(1)).toEqual([1]);
	});

	it('coerceArray should return array when value is undefined', () => {
		expect(coerceArray(undefined)).toEqual([]);
	});

});
