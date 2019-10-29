import { inject, TestBed } from '@angular/core/testing';
import {
	FormArray as RxFormArray,
	FormGroup as RxFormGroup
} from '@angular/forms';
import { FormControl, RxFormMapperModule } from '..';
import { RxFormMapper } from '../services/rx-form-mapper.service';
import { RxFormWriterService } from '../services/rx-form-writer.service';

describe('RxFormMapper', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RxFormMapperModule]
		}).compileComponents();
	});

});
