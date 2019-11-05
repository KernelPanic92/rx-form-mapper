import { Injectable } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import {
	AbstractControl,
	AsyncValidator,
	ValidationErrors,
	Validator as AngularValidator,
	Validators as AngularValidators
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Form, FormControl, FormGroup, RxFormMapperModule } from '..';
import { RxFormWriterService } from '../services';

@Injectable()
class AdditionalService {
	public getValue() {
		return 'hello!';
	}
}

class ValidatorTest implements AngularValidator {

	public validate(control: AbstractControl): ValidationErrors {
		return control.value === 2 ? void 0 : {error: true};
	}
}

@Injectable()
class AsyncValidatorTest implements AsyncValidator {

	constructor(private readonly additionalService: AdditionalService) {}
	public validate(control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> {
		return of(control.value === this.additionalService.getValue() ? undefined : {error: true});
	}
}

describe('FormValidatorAssignerService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RxFormMapperModule],
			providers: [AdditionalService, AsyncValidatorTest]
		}).compileComponents();
	});

	it('should set class validatorFn', inject([RxFormWriterService], (writer: RxFormWriterService) => {

		@Form({validators: AngularValidators.required})
		class TestClass {
			@FormControl()
			public field: string;
		}

		expect(writer.writeModel(new TestClass(), TestClass).validator).toBeTruthy();
	}));

	it('should set class validator', inject([RxFormWriterService], (writer: RxFormWriterService) => {

		@Form({validators: ValidatorTest})
		class TestClass {
			@FormControl()
			public field: string;
		}

		expect(writer.writeModel(new TestClass(), TestClass).validator).toBeTruthy();
	}));

	it('should set async class validator', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		const asyncValidator: (control: AbstractControl) => Observable<any> = control => of(null);

		@Form({asyncValidators: asyncValidator})
		class TestClass {
			@FormControl()
			public field: string;
		}

		expect(writer.writeModel( new TestClass(), TestClass).asyncValidator).toBeTruthy();
	}));

	it('should set parameter validator', inject([RxFormWriterService], (writer: RxFormWriterService) => {

		class TestClass {
			@FormControl({validators: AngularValidators.required})
			public field: string;
		}

		expect(writer.writeModel(new TestClass(), TestClass).get('field').validator).toBeTruthy();
	}));

	it('should add validator in nested form group', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		let counterValidator1 = 0;
		let counterValidator2 = 0;
		const validator1 = control => { counterValidator1++; return undefined; };
		const validator2 = control => { counterValidator2++; return undefined; };

		@Form({validators: [validator1]})
		class SubTestClass {
			@FormControl()
			public subField: string;
		}

		class TestClass {
			@FormGroup({validators: validator2})
			public field: SubTestClass;
		}

		const form = writer.writeModel(new TestClass(), TestClass);
		form.setValue({field: {subField: 'test'}});
		expect(counterValidator1).toBeGreaterThan(0, 'validator 1');
		expect(counterValidator2).toBeGreaterThan(0, 'validator 2');
	}));

	it('should add AsyncValidator in nested form group', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		let counterValidator1 = 0;
		let counterValidator2 = 0;
		const validator1 = control => { counterValidator1++; return of(null); };
		const validator2 = control => { counterValidator2++; return of(null); };

		@Form({asyncValidators: validator1})
		class SubTestClass {
			@FormControl()
			public subField: string;
		}

		class TestClass {
			@FormGroup({asyncValidators: validator2})
			public field: SubTestClass;
		}

		const form = writer.writeModel(new TestClass(), TestClass);
		form.setValue({field: {subField: 'test'}});
		expect(counterValidator1).toBeGreaterThan(0, 'validator 1');
		expect(counterValidator2).toBeGreaterThan(0, 'validator 2');
	}));

	it('Should get injectable validator', inject([RxFormWriterService, AdditionalService], async (writer: RxFormWriterService, service: AsyncValidatorTest) => {

		class TestClass {
			@FormControl({asyncValidators: AsyncValidatorTest})
			public field: string;
		}
		const form = writer.writeModel( new TestClass(), TestClass);
		form.get('field').setValue('hello!');
		expect(form.valid).toEqual(true);
	}));
});
