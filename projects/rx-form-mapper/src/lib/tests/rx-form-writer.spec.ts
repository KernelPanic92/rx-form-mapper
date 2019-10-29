import { inject, TestBed } from '@angular/core/testing';
import {
	FormArray as RxFormArray,
	FormControl as RxFormControl,
	FormGroup as RxFormGroup,
} from '@angular/forms';
import { FormArray, FormControl, FormGroup, RxFormMapperModule } from '..';
import { RxFormWriterService } from '../services/rx-form-writer.service';

describe('RxFormWriter', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RxFormMapperModule]
		}).compileComponents();
	});

	it('should be created', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		expect(writer).toBeTruthy();
	}));

	it('writeModel should not accept undefined type', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		expect(() => writer.writeModel(null, null)).toThrow();
	}));

	it('writeModel should return FormGroup', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		class TestClass {}
		expect(writer.writeModel(TestClass, null) instanceof RxFormGroup).toBeTruthy();
	}));

	it('should write FormControl field', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		class TestClass {
			@FormControl()
			public field: string;
		}
		const form = writer.writeModel(TestClass, new TestClass());
		expect(form.get('field') instanceof RxFormControl).toBeTruthy();
	}));

	it('should write FormControl value', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		class TestClass {
			@FormControl()
			public field: string;
		}
		const testValue = new TestClass();
		testValue.field = 'test';
		expect(writer.writeModel(TestClass, testValue).get('field').value).toEqual('test');
	}));

	it('should write FormGroup field', inject([RxFormWriterService], (writer: RxFormWriterService) => {

		class ChildTestClass {
			@FormControl()
			public field: string;
		}

		class TestClass {
			@FormGroup()
			public field: ChildTestClass;
		}

		expect(writer.writeModel(TestClass, new TestClass()).get('field') instanceof RxFormGroup).toBeTruthy();
	}));

	it('should write FormGroup value', inject([RxFormWriterService], (writer: RxFormWriterService) => {

		class ChildTestClass {
			@FormControl()
			public field: string;
		}

		class TestClass {
			@FormGroup()
			public field: ChildTestClass;
		}

		const testValue = new TestClass();
		testValue.field = new ChildTestClass();
		testValue.field.field = 'test';
		expect(writer.writeModel(TestClass, testValue).get('field.field').value).toEqual('test');
	}));

	it('should write FormArray field', inject([RxFormWriterService], (writer: RxFormWriterService) => {

		class ChildTestClass {
			@FormControl()
			public field: string;
		}

		class TestClass {
			@FormArray(ChildTestClass)
			public fields: ChildTestClass[];
		}

		expect(writer.writeModel(TestClass, new TestClass()).get('fields') instanceof RxFormArray).toBeTruthy();
	}));

	it('should write FormArray value', inject([RxFormWriterService], (writer: RxFormWriterService) => {

		class ChildTestClass {
			@FormControl()
			public field: string;
		}

		class TestClass {
			@FormArray(ChildTestClass)
			public fields: ChildTestClass[];
		}

		const testValue = new TestClass();
		testValue.fields = [new ChildTestClass()];
		testValue.fields[0].field = 'test';
		const form = writer.writeModel(TestClass, testValue);
		expect((form.get('fields') as RxFormArray).controls[0].get('field').value).toEqual('test');
	}));
});
