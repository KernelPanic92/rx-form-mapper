import { NgModule } from '@angular/core';
import { RxFormMapper } from './services/rx-form-mapper.service';
import { RxFormReaderService } from './services/rx-form-reader.service';
import { RxFormWriterService } from './services/rx-form-writer.service';

@NgModule({
	providers: [
		RxFormReaderService,
		RxFormWriterService,
		RxFormMapper
	]
})
export class RxFormMapperModule {}
