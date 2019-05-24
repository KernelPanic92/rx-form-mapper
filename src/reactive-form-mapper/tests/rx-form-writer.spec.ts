import { inject, TestBed } from '@angular/core/testing';
import {
	FormArray as RxFormArray,
	FormControl as RxFormControl,
	FormGroup as RxFormGroup,
	Validators
} from '@angular/forms';
import { of } from 'rxjs';
import { AsyncValidator, FormControl, FormGroup, FormMapperModule, Validator } from '..';
import { RxFormWriterService } from '../services/rx-form-writer.service';

describe('RxFormWriter', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [FormMapperModule]
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

	it('should set class validator', inject([RxFormWriterService], (writer: RxFormWriterService) => {

		@Validator(Validators.required)
		class TestClass {
			@FormControl()
			public field: string;
		}

		expect(writer.writeFormGroup(TestClass, new TestClass()).validator).toEqual(Validators.required);
	}));

	it('should set async class validator', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		const asyncValidator = control => of(null);

		@AsyncValidator(asyncValidator)
		class TestClass {
			@FormControl()
			public field: string;
		}

		expect(writer.writeFormGroup(TestClass, new TestClass()).asyncValidator).toEqual(asyncValidator);
	}));

	it('should set parameter validator', inject([RxFormWriterService], (writer: RxFormWriterService) => {

		class TestClass {
			@Validator(Validators.required)
			@FormControl()
			public field: string;
		}

		expect(writer.writeFormGroup(TestClass, new TestClass()).get('field').validator).toEqual(Validators.required);
	}));

	it('should add validator in nested form group', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		let counterValidator1 = 0;
		let counterValidator2 = 0;
		const validator1 = control => { counterValidator1++; return undefined; };
		const validator2 = control => { counterValidator2++; return undefined; };

		@Validator(validator1)
		class SubTestClass {
			@FormControl()
			public subField: string;
		}

		class TestClass {
			@Validator(validator2)
			@FormGroup()
			public field: SubTestClass;
		}

		const form = writer.writeFormGroup(TestClass, new TestClass());
		form.setValue({field: {subField: 'test'}});
		expect(counterValidator1).toBeGreaterThan(0, 'validator 1');
		expect(counterValidator2).toBeGreaterThan(0, 'validator 2');
	}));

});
