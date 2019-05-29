export function isFunction(value: any): value is (...args: any[]) => any {
	return typeof(value) === 'function';
}
export function isNil(value: any): boolean { return value == null; }

export function map<T, V>(value: ArrayLike<T>, callback: (value: T, index: number, array: T[]) => V): V[] {
	if (isNil(value)) return [];
	return Array.from(value).map(callback);
}

export function filter<T>(value: ArrayLike<T>, callback: (value: T, index: number, array: T[]) => any, thisArg?: any): T[] {
	if (isNil(value)) return [];
	return Array.from(value).filter(callback);
}

export function find<T>(value: ArrayLike<T>, callback: (value: T, index: number, obj: T[]) => boolean): T | undefined {
	if (isNil(value)) return void 0;
	return Array.from(value).find(callback);
}

export function size<T>(value: ArrayLike<T>): number {
	if (isNil(value)) return 0;
	return Array.from(value).length;
}

export function head<T>(value: T[]): T | undefined {
	if (size(value) === 0) return void 0;
	return value[0];
}

export function trim(value: string): string {
	if (isNil(value)) return '';
	return value.trim();
}

export function get(value: any, path: string): any {
	if (isNil(value)) return void 0;
	if (isNil(path) || size(trim(path)) === 0) return value;
	const steps = path.split('.');
	let stepValue = value;
	for (const step of steps) {
		if (isNil(stepValue)) return stepValue;
		stepValue = stepValue[step];
	}

	return stepValue;
}

export function fromPairs(pairs: ArrayLike<[string, any]>): any {
	const obj = new Object();
	if (!isNil(pairs)) {
		const pairsArray = Array.from(pairs);
		for (const pair of pairsArray) {
			obj[pair[0]] = pair[1];
		}
	}
	return obj;
}
