export function isFunction(value: any): value is (...args: any[]) => any {
	return typeof(value) === 'function';
}
export function isNil(value: any): value is null | undefined { return value == null; }

export function size<T>(value: ArrayLike<T>): number {
	if (isNil(value)) return 0;
	return Array.from(value).length;
}

export function trim(value: string): string {
	if (isNil(value)) return '';
	return value.trim();
}

export function get(value: any, path: string, defaultValue?: any): any {
	if (isNil(value)) return defaultValue;
	if (isNil(path) || size(trim(path)) === 0) return value;
	const steps = path.split('.');
	let stepValue = value;
	for (const step of steps) {
		if (isNil(stepValue)) return defaultValue;
		stepValue = stepValue[step];
	}
	return isNil(stepValue) ? defaultValue : stepValue;
}

export function coerceArray<T>(value: T | Array<T>): Array<T> {
	if (isNil(value)) return [];
	return Array.isArray(value) ? [...value] : [value];
}
