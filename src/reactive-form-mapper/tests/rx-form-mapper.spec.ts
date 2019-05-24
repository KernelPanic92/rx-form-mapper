import { inject, TestBed } from '@angular/core/testing';
import {
	FormArray as RxFormArray,
	FormGroup as RxFormGroup
} from '@angular/forms';
import { FormControl, FormMapperModule } from '..';
import { RxFormMapper } from '../services/rx-form-mapper.service';
import { RxFormWriterService } from '../services/rx-form-writer.service';

describe('RxFormMapper', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [FormMapperModule]
		}).compileComponents();
	});

	it('should be created', inject([RxFormMapper], (mapper: RxFormMapper) => {
		expect(mapper).toBeTruthy();
	}));

	it('should not write unspecified type', inject([RxFormMapper], (mapper: RxFormMapper) => {
		expect(() => mapper.writeForm(null)).toThrow();
		expect(() => mapper.writeForm(null, [])).toThrow();
	}));

	it('should not read unspecified type', inject([RxFormMapper], (mapper: RxFormMapper) => {
		expect(() => mapper.readForm(null, new RxFormGroup({}))).toThrow();
	}));

	it('should recognize type', inject([RxFormMapper, RxFormWriterService], (mapper: RxFormMapper, writer: RxFormWriterService) => {
		spyOn(writer, 'writeFormGroup').and.callFake(type => expect(type).toEqual(Number));
		mapper.writeForm(1);
	}));

	it('should return FormGroup', inject([RxFormMapper], (mapper: RxFormMapper) => {
		class TestClass {
			@FormControl()
			public field: string;
		}
		expect(mapper.writeForm(new TestClass()) instanceof RxFormGroup).toBeTruthy();
	}));

	it('should return FormArray', inject([RxFormMapper], (mapper: RxFormMapper) => {
		class TestClass {
			@FormControl()
			public field: string;
		}
		expect(mapper.writeForm(TestClass, [new TestClass()]) instanceof RxFormArray).toBeTruthy();
	}));

	it('should return object', inject([RxFormMapper], (mapper: RxFormMapper) => {
		class TestClass {
			@FormControl()
			public field: string;
		}

		const form = new RxFormGroup({});
		expect(mapper.readForm(TestClass, form) instanceof TestClass).toBeTruthy();
	}));

	it('should return array', inject([RxFormMapper], (mapper: RxFormMapper) => {
		class TestClass {
			@FormControl()
			public field: string;
		}

		const form = new RxFormArray([]);
		expect(mapper.readForm(TestClass, form) instanceof Array).toBeTruthy();
	}));

});
