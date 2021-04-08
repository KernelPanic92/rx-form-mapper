import { NgModule } from '@angular/core';
import { CustomMapperResolver } from './services/custom-mapper-resolver';
import { RxFormMapper } from './services/rx-form-mapper.service';
import { ValidatorResolver } from './services/validator-resolver';

@NgModule({
	providers: [
		RxFormMapper,
		CustomMapperResolver,
		ValidatorResolver
	]
})
export class RxFormMapperModule {}
