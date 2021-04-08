import { inject, TestBed } from '@angular/core/testing';
import { CustomControl, CustomControlMapper, Form, FormArray, FormControl, FormGroup, RxFormMapperModule } from '..';
import { RxFormMapper } from '../services';
import {
	AbstractControl,
	AbstractControlOptions,
	FormArray as NgFormArray,
	FormControl as NgFormControl,
	FormGroup as NgFormGroup,
	Validators,
} from '@angular/forms';
import { of } from 'rxjs';

describe('CustomMapperResolver', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RxFormMapperModule]
		}).compileComponents();
	});

	it('should be created', inject([RxFormMapper], (formMapper: RxFormMapper) => {
		expect(formMapper).toBeTruthy();
	}));

	it('writeForm should not detect type', inject([RxFormMapper], (formMapper: RxFormMapper) => {
		expect(() => formMapper.writeForm(null)).toThrow();
	}));

	it('writeForm should auto detect type', inject([RxFormMapper], (formMapper: RxFormMapper) => {
		class Test {

		}
		expect(formMapper.writeForm(new Test())).toBeTruthy();
	}));

	it('writeForm should write with specific type', inject([RxFormMapper], (formMapper: RxFormMapper) => {
		class Test {

		}
		expect(formMapper.writeForm(new Test(), Test)).toBeTruthy();
	}));

	it('writeModel should not accept undefined type', inject([RxFormMapper], (mapper: RxFormMapper) => {
		expect(() => mapper.writeForm(null, null)).toThrow();
	}));

	it('writeModel should return FormGroup', inject([RxFormMapper], (mapper: RxFormMapper) => {
		class TestClass {}
		expect(mapper.writeForm(null, TestClass) instanceof NgFormGroup).toBeTruthy();
	}));

	it('should write FormControl field', inject([RxFormMapper], (mapper: RxFormMapper) => {
		class TestClass {
			@FormControl()
			public field: string;
		}
		const form = mapper.writeForm(new TestClass(), TestClass);
		expect(form.get('field') instanceof NgFormControl).toBeTruthy();
	}));

	it('should write FormControl value', inject([RxFormMapper], (mapper: RxFormMapper) => {
		class TestClass {
			@FormControl()
			public field: string;
		}
		const testValue = new TestClass();
		testValue.field = 'test';
		expect(mapper.writeForm(testValue, TestClass).get('field').value).toEqual('test');
	}));

	it('should write FormGroup field', inject([RxFormMapper], (mapper: RxFormMapper) => {

		class ChildTestClass {
			@FormControl()
			public field: string;
		}

		class TestClass {
			@FormGroup()
			public field: ChildTestClass;
		}

		expect(mapper.writeForm(new TestClass(), TestClass).get('field') instanceof NgFormGroup).toBeTruthy();
	}));

	it('should write FormGroup value', inject([RxFormMapper], (mapper: RxFormMapper) => {

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
		expect(mapper.writeForm(testValue, TestClass).get('field.field').value).toEqual('test');
	}));

	it('should write FormArray field', inject([RxFormMapper], (mapper: RxFormMapper) => {

		class ChildTestClass {
			@FormControl()
			public field: string;
		}

		class TestClass {
			@FormArray(ChildTestClass)
			public fields: ChildTestClass[];
		}

		expect(mapper.writeForm(new TestClass(), TestClass).get('fields') instanceof NgFormArray).toBeTruthy();
	}));

	it('should write FormArray value', inject([RxFormMapper], (mapper: RxFormMapper) => {

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
		const form = mapper.writeForm(testValue, TestClass);
		expect((form.get('fields') as NgFormArray).controls[0].get('field').value).toEqual('test');
	}));

	it('should write CustomControl value', inject([RxFormMapper], (mapper: RxFormMapper) => {

		class ChildTestClass {
			public field: string;
		}

		class CustomControlMapperTest implements CustomControlMapper {
			public writeForm(value: ChildTestClass, abstractControlOptions: AbstractControlOptions): AbstractControl {
				return new NgFormControl(value, abstractControlOptions);
			}

			public readForm(control: AbstractControl): ChildTestClass {
				return control.value;
			}
		}

		class TestClass {
			@CustomControl(CustomControlMapperTest)
			public field: ChildTestClass;
		}

		const form = mapper.writeForm(new TestClass(), TestClass);
		expect(form.get('field') instanceof NgFormControl).toBeTruthy();
	}));

	it('readForm should return null', inject([RxFormMapper], (formMapper: RxFormMapper) => {
		class Test {

		}

		expect(formMapper.readForm(null, Test)).toBeUndefined();
	}));

	it('readForm should not detect type', inject([RxFormMapper], (formMapper: RxFormMapper) => {

		expect(() => formMapper.readForm(new NgFormGroup({}), null)).toThrow();
	}));

	it('should return undefined when control not exists', inject([RxFormMapper], (mapper: RxFormMapper) => {
		class TestClass {
			@FormControl()
			public field: string;
		}

		const formGroup = new NgFormGroup({});
		expect(mapper.readForm(formGroup, TestClass).field).toBeUndefined();
	}));

	it('should throw error when field is not FormControl', inject([RxFormMapper], (mapper: RxFormMapper) => {
		class TestClass {
			@FormControl()
			public field: string;
		}

		const formGroup = new NgFormGroup({field: new NgFormGroup({})});
		expect(() => mapper.readForm(formGroup, TestClass)).toThrow();
	}));

	it('should read FormControl field', inject([RxFormMapper], (mapper: RxFormMapper) => {
		class TestClass {
			@FormControl()
			public field: string;
		}

		const formGroup = new NgFormGroup({field: new NgFormControl('test')});
		expect(mapper.readForm(formGroup, TestClass).field).toEqual('test');
	}));

	it('should throw error when field is not FormGroup', inject([RxFormMapper], (mapper: RxFormMapper) => {
		class TestClass {
			@FormGroup()
			public field: string;
		}

		const formGroup = new NgFormGroup({field: new NgFormControl({})});
		expect(() => mapper.readForm(formGroup, TestClass)).toThrow();
	}));

	it('should read FormGroup field', inject([RxFormMapper], (mapper: RxFormMapper) => {
		class TestClass {
			@FormControl()
			public name: string;
			@FormGroup()
			public field: TestClass;
		}

		const formGroup = new NgFormGroup({field: new NgFormGroup({name: new NgFormControl('test')})});
		expect(mapper.readForm(formGroup, TestClass).field.name).toEqual('test');
	}));

	it('should throw error when field is not FormArray', inject([RxFormMapper], (mapper: RxFormMapper) => {
		class TestClass {
			@FormArray(TestClass)
			public field: TestClass[];
		}

		const formGroup = new NgFormGroup({field: new NgFormControl({})});
		expect(() => mapper.readForm(formGroup, TestClass)).toThrow();
	}));

	it('should read FormArray field', inject([RxFormMapper], (mapper: RxFormMapper) => {
		class TestClass {
			@FormControl()
			public name: string;
			@FormArray(TestClass)
			public field: TestClass[];
		}

		const formGroup = new NgFormGroup({field: new NgFormArray([new NgFormGroup({name: new NgFormControl('test')})])});
		expect(mapper.readForm(formGroup, TestClass).field[0].name).toEqual('test');
	}));

	it('should read CustomControl value', inject([RxFormMapper], (mapper: RxFormMapper) => {

		class ChildTestClass {
			constructor(public field: string) {}
		}

		class CustomControlMapperTest implements CustomControlMapper {
			public writeForm(value: ChildTestClass, abstractControlOptions: AbstractControlOptions): AbstractControl {
				return new NgFormControl(value, abstractControlOptions);
			}

			public readForm(control: AbstractControl): ChildTestClass {
				return control.value;
			}
		}

		class TestClass {
			@CustomControl(CustomControlMapperTest)
			public field: ChildTestClass;
		}

		const form = new NgFormGroup({field: new NgFormControl(new ChildTestClass('hello'))});

		expect(mapper.readForm(form, TestClass).field.field).toEqual('hello');
	}));

	it('should set validator', inject([RxFormMapper], (mapper: RxFormMapper) => {

		@Form({validators: Validators.required, asyncValidators: c => of(null)})
		class TestClass {
			@FormControl()
			public field: string;
		}

		expect(mapper.writeForm(new TestClass(), TestClass).validator).toBeTruthy();
	}));

});
