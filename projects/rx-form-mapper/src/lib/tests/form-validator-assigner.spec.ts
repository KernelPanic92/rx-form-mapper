import { Injectable } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import {
	ValidatorFn,
	Validators
} from '@angular/forms';
import { of } from 'rxjs';
import { AsyncValidator, FormControl, FormGroup, RxFormMapperModule, Validator } from '..';
import { FormValidatorAssignerService } from '../services/form-validator-assigner.service';
import { RxFormWriterService } from '../services/rx-form-writer.service';

@Injectable()
class TestService {
	public validatorFactoryMethod(optionalParameter?: string): ValidatorFn { return (control) => null; }
}

describe('FormValidatorAssignerService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RxFormMapperModule],
			providers: [TestService]
		}).compileComponents();
	});

	it('should be created', inject([RxFormWriterService], (assigner: FormValidatorAssignerService) => {
		expect(assigner).toBeTruthy();
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

	it('should add AsyncValidator in nested form group', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		let counterValidator1 = 0;
		let counterValidator2 = 0;
		const validator1 = control => { counterValidator1++; return of(null); };
		const validator2 = control => { counterValidator2++; return of(null); };

		@AsyncValidator(validator1)
		class SubTestClass {
			@FormControl()
			public subField: string;
		}

		class TestClass {
			@AsyncValidator(validator2)
			@FormGroup()
			public field: SubTestClass;
		}

		const form = writer.writeFormGroup(TestClass, new TestClass());
		form.setValue({field: {subField: 'test'}});
		expect(counterValidator1).toBeGreaterThan(0, 'validator 1');
		expect(counterValidator2).toBeGreaterThan(0, 'validator 2');
	}));

	it('Should use only provided services', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		class NotProvidedService {
			public notProvidedMethod(): ValidatorFn { return null; }
		}

		class TestClass {
			@AsyncValidator(NotProvidedService, 'notProvidedMethod')
			@FormControl()
			public field: string;
		}

		expect(() => writer.writeFormGroup(TestClass, new TestClass())).toThrow();
	}));

	it('Should throw error on undefined method', inject([RxFormWriterService], (writer: RxFormWriterService) => {

		class TestClass {
			@AsyncValidator(TestService, 'notProvidedMethod' as any)
			@FormControl()
			public field: string;
		}

		expect(() => writer.writeFormGroup(TestClass, new TestClass())).toThrow();
	}));

	it('Should throw error on undefined method factory result', inject([RxFormWriterService, TestService], (writer: RxFormWriterService, service: TestService) => {
		spyOn(service, 'validatorFactoryMethod').and.returnValue(null);
		class TestClass {
			@AsyncValidator(TestService, 'validatorFactoryMethod')
			@FormControl()
			public field: string;
		}

		expect(() => writer.writeFormGroup(TestClass, new TestClass())).toThrow();
	}));

	it('Should throw error on bad method factory result', inject([RxFormWriterService, TestService], (writer: RxFormWriterService, service: TestService) => {
		spyOn(service, 'validatorFactoryMethod').and.returnValue(1 as any);
		class TestClass {
			@AsyncValidator(TestService, 'validatorFactoryMethod')
			@FormControl()
			public field: string;
		}

		expect(() => writer.writeFormGroup(TestClass, new TestClass())).toThrow();
	}));

	it('Should add AsyncValidator with method factory', inject([RxFormWriterService, TestService], (writer: RxFormWriterService, service: TestService) => {

		class TestClass {
			@AsyncValidator(TestService, 'validatorFactoryMethod')
			@FormControl()
			public field: string;
		}
		const form = writer.writeFormGroup(TestClass, new TestClass());
		expect(form.get('field').asyncValidator).toBeTruthy();
	}));

	it('Should pass parameters into method factory', inject([RxFormWriterService, TestService], (writer: RxFormWriterService, service: TestService) => {

		class TestClass {
			@AsyncValidator(TestService, 'validatorFactoryMethod', ['customParameterValue'])
			@FormControl()
			public field: string;
		}

		spyOn(service, 'validatorFactoryMethod').and.callFake(value => {
			expect(value).toEqual('customParameterValue');
			return (control) => null;
		});
		writer.writeFormGroup(TestClass, new TestClass());
	}));

});
