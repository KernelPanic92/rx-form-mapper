import { NgModule } from '@angular/core';
import { FormValidatorAssignerService } from './services/form-validator-assigner.service';
import { RxFormMapper } from './services/rx-form-mapper.service';
import { RxFormReaderService } from './services/rx-form-reader.service';
import { RxFormWriterService } from './services/rx-form-writer.service';

@NgModule({
	providers: [
		RxFormReaderService,
		FormValidatorAssignerService,
		RxFormWriterService,
		RxFormMapper
	]
})
export class RxFormMapperModule {}
