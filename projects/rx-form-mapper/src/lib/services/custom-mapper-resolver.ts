import { Injectable, InjectFlags, Injector, Type } from '@angular/core';
import { CustomControlMapper } from '../interfaces';

@Injectable()
export class CustomMapperResolver {
	public constructor(private readonly injector: Injector) {}

	public resolve(type: Type<CustomControlMapper>): CustomControlMapper {
		let mapper = this.injector.get(type, null, InjectFlags.Optional);

		if (!mapper) {
			mapper = new type();
		}

		return mapper;
	}
}
