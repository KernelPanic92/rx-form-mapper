import { Type } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import {
	AbstractControl,
	AbstractControlOptions,
	FormArray as RxFormArray,
	FormControl as RxFormControl,
	FormGroup as RxFormGroup,
} from '@angular/forms';
import { CustomControl, CustomControlMapper, FormArray, FormControl, FormGroup, RxFormMapperModule } from '..';
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
		expect(writer.writeModel(null, TestClass) instanceof RxFormGroup).toBeTruthy();
	}));

	it('should write FormControl field', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		class TestClass {
			@FormControl()
			public field: string;
		}
		const form = writer.writeModel(new TestClass(), TestClass);
		expect(form.get('field') instanceof RxFormControl).toBeTruthy();
	}));

	it('should write FormControl value', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		class TestClass {
			@FormControl()
			public field: string;
		}
		const testValue = new TestClass();
		testValue.field = 'test';
		expect(writer.writeModel(testValue, TestClass).get('field').value).toEqual('test');
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

		expect(writer.writeModel(new TestClass(), TestClass).get('field') instanceof RxFormGroup).toBeTruthy();
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
		expect(writer.writeModel(testValue, TestClass).get('field.field').value).toEqual('test');
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

		expect(writer.writeModel(new TestClass(), TestClass).get('fields') instanceof RxFormArray).toBeTruthy();
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
		const form = writer.writeModel(testValue, TestClass);
		expect((form.get('fields') as RxFormArray).controls[0].get('field').value).toEqual('test');
	}));

	it('should throw null custom value', inject([RxFormWriterService], (writer: RxFormWriterService) => {

		class ChildTestClass {
			public field: string;
		}

		class TestClass {
			@CustomControl(null)
			public field: ChildTestClass;
		}

		expect(() => writer.writeModel(new TestClass(), TestClass)).toThrow();
	}));

	it('should write CustomControl value', inject([RxFormWriterService], (writer: RxFormWriterService) => {

		class ChildTestClass {
			public field: string;
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

		const form = writer.writeModel(new TestClass(), TestClass);
		expect(form.get('field') instanceof RxFormControl).toBeTruthy();
	}));
});
