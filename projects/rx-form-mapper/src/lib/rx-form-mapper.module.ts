import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { RxFormMapper, ValidatorResolver, CustomMapperResolver } from './services';

@NgModule()
export class RxFormMapperModule {

	public static forRoot(): ModuleWithProviders<RxFormMapperModule> {
		return {
			ngModule: RxFormMapperModule,
			providers: [
				RxFormMapper,
				CustomMapperResolver,
				ValidatorResolver
			]
		};
	}

	public constructor(@Optional() @SkipSelf() parentModule?: RxFormMapperModule) {
		if (parentModule) {
			throw new Error('RxFormMapperModule is already loaded. Import it in the AppModule only');
		}
	}

}
