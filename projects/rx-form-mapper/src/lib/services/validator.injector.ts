import { InjectFlags, InjectionToken, Injector, Type } from '@angular/core';
import { ValidatorDescriptor } from '../descriptors/validator-descriptor';
import { VALIDATOR_DATA } from '../tokens/validator-data-token';

export class ValidatorInjector implements Injector {

	private customTokens: WeakMap<any, any>;
	constructor(private readonly parentInjector: Injector, descriptor: ValidatorDescriptor) {
		this.customTokens = new WeakMap([[VALIDATOR_DATA, descriptor.data]]);
	}

	public get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjectFlags): T;
	public get(token: any, notFoundValue?: any);
	public get(token: any, notFoundValue?: any, flags?: any) {
		if (this.customTokens.has(token)) {
			return this.customTokens.get(token);
		}
		return this.parentInjector.get<any>(token, notFoundValue, flags);
	}

}
