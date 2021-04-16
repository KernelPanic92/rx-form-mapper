import { Injectable, InjectFlags, Injector, Type } from '@angular/core';
import { CustomControlMapper } from '../interfaces';

@Injectable()
export class CustomMapperResolver {
	public constructor(private readonly injector: Injector) {}

	public resolve(type: Type<CustomControlMapper>): CustomControlMapper {
		return this.injector.get(type, null, InjectFlags.Optional) ?? new type();
	}
}
