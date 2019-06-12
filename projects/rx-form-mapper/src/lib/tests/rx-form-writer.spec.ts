import { inject, TestBed } from '@angular/core/testing';
import {
	AbstractControl,
	FormArray as RxFormArray,
	FormControl as RxFormControl,
	FormGroup as RxFormGroup,
	Validators
} from '@angular/forms';
import { Converter, FormControl, FormGroup, RxFormMapperConverter, RxFormMapperModule } from '..';
import { RxFormWriterService } from '../services/rx-form-writer.service';
import { Class } from '../types';

describe('RxFormWriter', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RxFormMapperModule]
		}).compileComponents();
	});

	it('should be created', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		expect(writer).toBeTruthy();
	}));

	it('writeFormArray should not accept undefined type', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		expect(() => writer.writeFormArray(null, null)).toThrow();
	}));

	it('writeFormGroup should not accept undefined type', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		expect(() => writer.writeFormGroup(null, null)).toThrow();
	}));

	it('writeFormArray should not accept Array type', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		expect(() => writer.writeFormArray(Array, null)).toThrow();
	}));

	it('writeFormGroup should not accept Array type', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		expect(() => writer.writeFormGroup(Array, null)).toThrow();
	}));

	it('writeFormArray should return FormArray', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		class TestClass {}
		expect(writer.writeFormArray(TestClass, null) instanceof RxFormArray).toBeTruthy();
	}));

	it('writeFormArray should return FormArray with 1 child', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		class TestClass {}
		expect(writer.writeFormArray(TestClass, [new TestClass()]).controls.length).toEqual(1);
	}));

	it('writeFormGroup should return FormGroup', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		class TestClass {}
		expect(writer.writeFormGroup(TestClass, null) instanceof RxFormGroup).toBeTruthy();
	}));

	it('should write FormControl field', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		class TestClass {
			@FormControl()
			public field: string;
		}
		expect(writer.writeFormGroup(TestClass, new TestClass()).get('field') instanceof RxFormControl).toBeTruthy();
	}));

	it('should write FormControl value', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		class TestClass {
			@FormControl()
			public field: string;
		}
		const testValue = new TestClass();
		testValue.field = 'test';
		expect(writer.writeFormGroup(TestClass, testValue).get('field').value).toEqual('test');
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

		expect(writer.writeFormGroup(TestClass, new TestClass()).get('field') instanceof RxFormGroup).toBeTruthy();
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
		expect(writer.writeFormGroup(TestClass, testValue).get('field.field').value).toEqual('test');
	}));

	it('should write FormArray field', inject([RxFormWriterService], (writer: RxFormWriterService) => {

		class ChildTestClass {
			@FormControl()
			public field: string;
		}

		class TestClass {
			@FormGroup(() => ChildTestClass)
			public fields: ChildTestClass[];
		}

		expect(writer.writeFormGroup(TestClass, new TestClass()).get('fields') instanceof RxFormArray).toBeTruthy();
	}));

	it('should write FormArray value', inject([RxFormWriterService], (writer: RxFormWriterService) => {

		class ChildTestClass {
			@FormControl()
			public field: string;
		}

		class TestClass {
			@FormGroup(() => ChildTestClass)
			public fields: ChildTestClass[];
		}

		const testValue = new TestClass();
		testValue.fields = [new ChildTestClass()];
		testValue.fields[0].field = 'test';
		const form = writer.writeFormGroup(TestClass, testValue);
		expect((form.get('fields') as RxFormArray).controls[0].get('field').value).toEqual('test');
	}));

	it('should be converted with custom converter', inject([RxFormWriterService], (writer: RxFormWriterService) => {

		class TestCustomConverterClass {
			public name: string;
		}

		class CustomConverter extends RxFormMapperConverter<TestCustomConverterClass> {
			public toModel(type: Class<TestCustomConverterClass>, abstractControl: AbstractControl): TestCustomConverterClass {
				const returnObj = new TestCustomConverterClass();
				returnObj.name = abstractControl.value;
				return returnObj;
			}

			public toForm(type: Class<TestCustomConverterClass>, value: TestCustomConverterClass): AbstractControl {
				return new RxFormControl(value ? value.name : undefined);
			}
		}

		class TestClass {
			@Converter(() => CustomConverter)
			public field: TestCustomConverterClass;
		}

		const testValue = new TestClass();
		testValue.field = new TestCustomConverterClass();
		testValue.field.name = 'test';

		const form = writer.writeFormGroup(TestClass, testValue);
		expect(form.get('field') instanceof RxFormControl).toBeTruthy();
		expect(form.get('field').value).toEqual('test');
	}));

	it('should throw error on null converterFn', inject([RxFormWriterService], (writer: RxFormWriterService) => {

		class TestCustomConverterClass {
			public name: string;
		}

		class TestClass {
			@Converter(null)
			public field: TestCustomConverterClass;
		}

		const testValue = new TestClass();
		testValue.field = new TestCustomConverterClass();
		testValue.field.name = 'test';
		expect(() =>  writer.writeFormGroup(TestClass, testValue)).toThrow();
	}));

	it('should throw error on null converterFn result', inject([RxFormWriterService], (writer: RxFormWriterService) => {

		class TestCustomConverterClass {
			public name: string;
		}

		class TestClass {
			@Converter(() => null)
			public field: TestCustomConverterClass;
		}

		const testValue = new TestClass();
		testValue.field = new TestCustomConverterClass();
		testValue.field.name = 'test';
		expect(() =>  writer.writeFormGroup(TestClass, testValue)).toThrow();
	}));
});
