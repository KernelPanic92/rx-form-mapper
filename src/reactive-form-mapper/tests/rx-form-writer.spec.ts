import {
	FormArray as RxFormArray,
	FormControl as RxFormControl,
	FormGroup as RxFormGroup
} from '@angular/forms';
import { TestBed, inject } from '@angular/core/testing';
import { FormControl, FormGroup, FormMapperModule } from '..';
import { RxFormReaderService } from '../services/rx-form-reader.service';
import { RxFormWriterService } from '../services/rx-form-writer.service';


describe('RxFormWriter', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [FormMapperModule]
		}).compileComponents();
	});

	it('should be created', inject([RxFormWriterService], (reader: RxFormWriterService) => {
		expect(reader).toBeTruthy();
	}));

	it('writeFormArray should not accept undefined type', inject([RxFormWriterService], (reader: RxFormWriterService) => {
		expect(() => reader.writeFormArray(null, null)).toThrow();
	}));

	it('writeFormGroup should not accept undefined type', inject([RxFormWriterService], (reader: RxFormWriterService) => {
		expect(() => reader.writeFormGroup(null, null)).toThrow();
	}));

	it('writeFormArray should not accept Array type', inject([RxFormWriterService], (reader: RxFormWriterService) => {
		expect(() => reader.writeFormArray(Array, null)).toThrow();
	}));

	it('writeFormGroup should not accept Array type', inject([RxFormWriterService], (reader: RxFormWriterService) => {
		expect(() => reader.writeFormGroup(Array, null)).toThrow();
	}));

	it('writeFormArray should return FormArray', inject([RxFormWriterService], (reader: RxFormWriterService) => {
		class TestClass {}
		expect(reader.writeFormArray(TestClass, null) instanceof RxFormArray).toBeTruthy();
	}));

	it('writeFormArray should return FormArray with 1 child', inject([RxFormWriterService], (reader: RxFormWriterService) => {
		class TestClass {}
		expect(reader.writeFormArray(TestClass, [new TestClass()]).controls.length).toEqual(1);
	}));

	it('writeFormGroup should return FormGroup', inject([RxFormWriterService], (reader: RxFormWriterService) => {
		class TestClass {}
		expect(reader.writeFormGroup(TestClass, null) instanceof RxFormGroup).toBeTruthy();
	}));

	it('should write FormControl field', inject([RxFormWriterService], (reader: RxFormWriterService) => {
		class TestClass {
			@FormControl()
			field: string;
		}
		expect(reader.writeFormGroup(TestClass, new TestClass()).get('field') instanceof RxFormControl).toBeTruthy();
	}));

	it('should write FormControl value', inject([RxFormWriterService], (reader: RxFormWriterService) => {
		class TestClass {
			@FormControl()
			field: string;
		}
		const testValue = new TestClass();
		testValue.field = 'test';
		expect(reader.writeFormGroup(TestClass, testValue).get('field').value).toEqual('test');
	}));

	it('should write FormGroup field', inject([RxFormWriterService], (reader: RxFormWriterService) => {

		class ChildTestClass {
			@FormControl()
			field: string
		}

		class TestClass {
			@FormGroup()
			field: ChildTestClass;
		}

		expect(reader.writeFormGroup(TestClass, new TestClass()).get('field') instanceof RxFormGroup).toBeTruthy();
	}));

	it('should write FormGroup value', inject([RxFormWriterService], (reader: RxFormWriterService) => {

		class ChildTestClass {
			@FormControl()
			field: string
		}

		class TestClass {
			@FormGroup()
			field: ChildTestClass;
		}

		const testValue = new TestClass();
		testValue.field = new ChildTestClass();
		testValue.field.field = 'test';
		expect(reader.writeFormGroup(TestClass, testValue).get('field.field').value).toEqual('test');
	}));

	it('should write FormArray field', inject([RxFormWriterService], (reader: RxFormWriterService) => {

		class ChildTestClass {
			@FormControl()
			field: string
		}

		class TestClass {
			@FormGroup(() => ChildTestClass)
			fields: ChildTestClass[];
		}

		expect(reader.writeFormGroup(TestClass, new TestClass()).get('fields') instanceof RxFormArray).toBeTruthy();
	}));

	it('should write FormArray value', inject([RxFormWriterService], (reader: RxFormWriterService) => {

		class ChildTestClass {
			@FormControl()
			field: string
		}

		class TestClass {
			@FormGroup(() => ChildTestClass)
			fields: ChildTestClass[];
		}

		const testValue = new TestClass();
		testValue.fields = [new ChildTestClass()];
		testValue.fields[0].field = 'test';
		const form = reader.writeFormGroup(TestClass, testValue);
		expect((form.get('fields') as RxFormArray).controls[0].get('field').value).toEqual('test');
	}));


});
