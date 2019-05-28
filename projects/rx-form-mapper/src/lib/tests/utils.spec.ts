import { filter, fromPairs, get, head, isNil, map, size, trim } from '../utils';

describe('utils', () => {

	it('isNil should return true', () => {
		expect(isNil(null)).toBeTruthy();
		expect(isNil(undefined)).toBeTruthy();
	});

	it('isNil should return false', () => {
		expect(isNil(1)).toBeFalsy();
	});

	it('map should return empty array', () => {
		expect(map(null, n => n)).toEqual([]);
	});

	it('map should return array of fields', () => {
		expect(map([{name: 'name'}], n => n.name)).toEqual(['name']);
	});

	it('filter should return empty array', () => {
		expect(filter(null, n => n)).toEqual([]);
	});

	it('filter should return filtered array', () => {
		expect(filter([{name: 'name'}], n => n.name !== 'name')).toEqual([]);
	});

	it('size should return zero', () => {
		expect(size(undefined)).toEqual(0);
		expect(size(null)).toEqual(0);
		expect(size([])).toEqual(0);
	});

	it('size should return length of array', () => {
		expect(size([7])).toEqual(1);
	});

	it('head should return undefined', () => {
		expect(head(undefined)).toEqual(undefined);
		expect(head(null)).toEqual(undefined);
	});

	it('head should return first element of array', () => {
		expect(head([1, 2, 3])).toEqual(1);
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

	it('get should return empty object', () => {
		expect(fromPairs(null)).toEqual({});
		expect(fromPairs(undefined)).toEqual({});
		expect(fromPairs([])).toEqual({});
	});

	it('get should return object with specific property', () => {
		expect(fromPairs([['name', 'name']])).toEqual({name: 'name'});
	});
});
