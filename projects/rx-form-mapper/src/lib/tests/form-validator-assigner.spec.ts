import { Inject, Injectable, Optional } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import {
	AbstractControl,
	AsyncValidator,
	ValidationErrors,
	Validator as AngularValidator,
	Validators
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { FormControl, FormGroup, RxFormMapperModule, Validator } from '..';
import { FormValidatorAssignerService } from '../services/form-validator-assigner.service';
import { RxFormWriterService } from '../services/rx-form-writer.service';
import { VALIDATOR_DATA } from '../tokens/validator-data-token';

@Injectable()
class ValidatorTest implements AngularValidator {
	public validate(control: AbstractControl): ValidationErrors {
		return null;
	}
}

@Injectable()
class AsyncValidatorTest implements AsyncValidator {
	constructor(@Optional() @Inject(VALIDATOR_DATA) public readonly data: string) {}

	public validate(control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> {
		return of(control.value !== this.data ? {error: true} : null);
	}
}

describe('FormValidatorAssignerService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RxFormMapperModule],
			providers: [ValidatorTest, AsyncValidatorTest]
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

		expect(writer.writeFormGroup(TestClass, new TestClass()).validator).toBeTruthy();
	}));

	it('should set async class validator', inject([RxFormWriterService], (writer: RxFormWriterService) => {
		const asyncValidator: (control: AbstractControl) => Observable<any> = control => of(null);

		@Validator(asyncValidator, 'async')
		class TestClass {
			@FormControl()
			public field: string;
		}

		expect(writer.writeFormGroup(TestClass, new TestClass()).asyncValidator).toBeTruthy();
	}));

	it('should set parameter validator', inject([RxFormWriterService], (writer: RxFormWriterService) => {

		class TestClass {
			@Validator(Validators.required)
			@FormControl()
			public field: string;
		}

		expect(writer.writeFormGroup(TestClass, new TestClass()).get('field').validator).toBeTruthy();
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

		@Validator(validator1, 'async')
		class SubTestClass {
			@FormControl()
			public subField: string;
		}

		class TestClass {
			@Validator(validator2, 'async')
			@FormGroup()
			public field: SubTestClass;
		}

		const form = writer.writeFormGroup(TestClass, new TestClass());
		form.setValue({field: {subField: 'test'}});
		expect(counterValidator1).toBeGreaterThan(0, 'validator 1');
		expect(counterValidator2).toBeGreaterThan(0, 'validator 2');
	}));

	it('Should pass parameters into injectable validator', inject([RxFormWriterService], async (writer: RxFormWriterService, service: AsyncValidatorTest) => {

		class TestClass {
			@Validator(AsyncValidatorTest, 'async', 'hello!')
			@FormControl()
			public field: string;
		}
		const form = writer.writeFormGroup(TestClass, new TestClass());
		form.get('field').setValue('hell0!');
		expect(form.valid).toEqual(false);
	}));
});
