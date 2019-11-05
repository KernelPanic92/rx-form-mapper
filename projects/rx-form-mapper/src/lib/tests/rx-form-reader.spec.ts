import { Type } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import {
	AbstractControl,
	AbstractControlOptions,
	FormArray as RxFormArray,
	FormControl as RxFormControl,
	FormGroup as RxFormGroup
} from '@angular/forms';
import { CustomControl, CustomControlMapper, FormArray, FormControl, FormGroup, RxFormMapperModule } from '..';
import { RxFormReaderService } from '../services/rx-form-reader.service';

describe('RxFormReader', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RxFormMapperModule]
		}).compileComponents();
	});

	it('should be created', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		expect(reader).toBeTruthy();
	}));

	it('should return undefined when control not exists', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		class TestClass {
			@FormControl()
			public field: string;
		}

		const formGroup = new RxFormGroup({});
		expect(reader.readFormGroup(formGroup, TestClass).field).toBeUndefined();
	}));

	it('should throw error when field is not FormControl', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		class TestClass {
			@FormControl()
			public field: string;
		}

		const formGroup = new RxFormGroup({field: new RxFormGroup({})});
		expect(() => reader.readFormGroup(formGroup, TestClass)).toThrow();
	}));

	it('should read FormControl field', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		class TestClass {
			@FormControl()
			public field: string;
		}

		const formGroup = new RxFormGroup({field: new RxFormControl('test')});
		expect(reader.readFormGroup(formGroup, TestClass).field).toEqual('test');
	}));

	it('should throw error when field is not FormGroup', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		class TestClass {
			@FormGroup()
			public field: string;
		}

		const formGroup = new RxFormGroup({field: new RxFormControl({})});
		expect(() => reader.readFormGroup(formGroup, TestClass)).toThrow();
	}));

	it('should read FormGroup field', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		class TestClass {
			@FormControl()
			public name: string;
			@FormGroup()
			public field: TestClass;
		}

		const formGroup = new RxFormGroup({field: new RxFormGroup({name: new RxFormControl('test')})});
		expect(reader.readFormGroup(formGroup, TestClass).field.name).toEqual('test');
	}));

	it('should throw error when field is not FormArray', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		class TestClass {
			@FormArray(TestClass)
			public field: TestClass[];
		}

		const formGroup = new RxFormGroup({field: new RxFormControl({})});
		expect(() => reader.readFormGroup(formGroup, TestClass)).toThrow();
	}));

	it('should read FormArray field', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		class TestClass {
			@FormControl()
			public name: string;
			@FormArray(TestClass)
			public field: TestClass[];
		}

		const formGroup = new RxFormGroup({field: new RxFormArray([new RxFormGroup({name: new RxFormControl('test')})])});
		expect(reader.readFormGroup(formGroup, TestClass).field[0].name).toEqual('test');
	}));

	it('should throw null custom value', inject([RxFormReaderService], (reader: RxFormReaderService) => {

		class ChildTestClass {
			public field: string;
		}

		class TestClass {
			@CustomControl(null)
			public field: ChildTestClass;
		}

		const form = new RxFormGroup({field: new RxFormControl('hello')});

		expect(() => reader.readFormGroup(form, TestClass)).toThrow();
	}));

	it('should read CustomControl value', inject([RxFormReaderService], (reader: RxFormReaderService) => {

		class ChildTestClass {
			constructor(public field: string) {}
		}

		class CustomControlMapperTest implements CustomControlMapper {
			public writeForm(value: ChildTestClass, type: Type<any>, abstractControlOptions: AbstractControlOptions): AbstractControl {
				return new RxFormControl(value, abstractControlOptions);
			}

			public readForm(control: AbstractControl, type: Type<any>): ChildTestClass {
				return control.value;
			}
		}

		class TestClass {
			@CustomControl(CustomControlMapperTest)
			public field: ChildTestClass;
		}

		const form = new RxFormGroup({field: new RxFormControl(new ChildTestClass('hello'))});

		expect(reader.readFormGroup(form, TestClass).field.field).toEqual('hello');
	}));
});
