import {
	FormArray as RxFormArray,
	FormControl as RxFormControl,
	FormGroup as RxFormGroup
} from '@angular/forms';
import { TestBed, inject } from '@angular/core/testing';
import { FormControl, FormGroup, FormMapperModule } from '..';
import { RxFormReaderService } from '../services/rx-form-reader.service';


describe('RxFormReader', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [FormMapperModule]
		}).compileComponents();
	});

	it('should be created', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		expect(reader).toBeTruthy();
	}));

	it('should read undefined', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		expect(reader.readFormGroup(null, null)).toBeUndefined();
		expect(reader.readFormArray(null, null)).toBeUndefined();
	}));

	it('readFormGroup should accepts only FormGroup', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		expect(() => reader.readFormGroup(null, new RxFormArray([]) as any)).toThrowError();
	}));

	it('readFormArray should accepts only FormArray', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		expect(() => reader.readFormArray(null, new RxFormGroup({}) as any)).toThrowError();
	}));

	it('readFormArray should not accept array type', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		expect(() => reader.readFormArray(Array, new RxFormArray([]))).toThrowError();
	}));

	it('Should read FormArray', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		class TestClass {
			@FormControl()
			public name: string;
		}

		const formArray = new RxFormArray([
			new RxFormGroup({ name: new RxFormControl('test') })
		]);

		const parsed = reader.readFormArray(TestClass, formArray);
		expect(Array.isArray(parsed)).toBeTruthy();
	}));

	it('should return undefined when control not exists', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		class TestClass {
			@FormControl()
			public field: string;
		}

		const formGroup = new RxFormGroup({});
		expect(reader.readFormGroup(TestClass, formGroup).field).toBeUndefined();
	}));

	it('should throw error when field is not FormControl', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		class TestClass {
			@FormControl()
			public field: string;
		}

		const formGroup = new RxFormGroup({field: new RxFormGroup({})});
		expect(() => reader.readFormGroup(TestClass, formGroup)).toThrow();
	}));

	it('should read FormControl field', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		class TestClass {
			@FormControl()
			public field: string;
		}

		const formGroup = new RxFormGroup({field: new RxFormControl('test')});
		expect(reader.readFormGroup(TestClass, formGroup).field).toEqual('test');
	}));

	it('should throw error when field is not FormGroup', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		class TestClass {
			@FormGroup()
			public field: string;
		}

		const formGroup = new RxFormGroup({field: new RxFormControl({})});
		expect(() => reader.readFormGroup(TestClass, formGroup)).toThrow();
	}));

	it('should read FormGroup field', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		class TestClass {
			@FormControl()
			public name: string;
			@FormGroup()
			public field: TestClass;
		}

		const formGroup = new RxFormGroup({field: new RxFormGroup({name: new RxFormControl('test')})});
		expect(reader.readFormGroup(TestClass, formGroup).field.name).toEqual('test');
	}));

	it('should throw error when field is not FormArray', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		class TestClass {
			@FormGroup(() => TestClass)
			public field: TestClass[];
		}

		const formGroup = new RxFormGroup({field: new RxFormControl({})});
		expect(() => reader.readFormGroup(TestClass, formGroup)).toThrow();
	}));

	it('should read FormArray field', inject([RxFormReaderService], (reader: RxFormReaderService) => {
		class TestClass {
			@FormControl()
			public name: string;
			@FormGroup(() => TestClass)
			public field: TestClass[];
		}

		const formGroup = new RxFormGroup({field: new RxFormArray([new RxFormGroup({name: new RxFormControl('test')})])});
		expect(reader.readFormGroup(TestClass, formGroup).field[0].name).toEqual('test');
	}));
});
