import { Injectable, Injector } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { AbstractControl, AbstractControlOptions, FormGroup, ValidationErrors, Validator } from '@angular/forms';
import { RxFormMapperModule } from '..';
import { CustomControlMapper } from '../interfaces';
import { RxFormMapper, ValidatorResolver } from '../services';
import { CustomMapperResolver } from '../services/custom-mapper-resolver';

describe('RxFormMapper', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RxFormMapperModule],
		}).compileComponents();
	});

	it('should be created', inject([ValidatorResolver], (resolver: ValidatorResolver) => {
		expect(resolver).toBeTruthy();
	}));

	it('should resolve validatorFn', inject([ValidatorResolver], (resolver: ValidatorResolver) => {
		const validatorFn = (c) => ({});

		const actual = resolver.resolve(validatorFn);

		expect(actual).toEqual(validatorFn);
	}));

	it('should resolve validator instance', inject([ValidatorResolver], (resolver: ValidatorResolver) => {

		class SimpleValidator implements Validator {
			validate(control: AbstractControl): ValidationErrors {
				return { error: true };
			}
		}

		const actual = resolver.resolve(new SimpleValidator());

		expect(actual(null).error).toEqual(true);
	}));

	it('should resolve validator type', inject([ValidatorResolver], (resolver: ValidatorResolver) => {

		class SimpleValidator implements Validator {
			validate(control: AbstractControl): ValidationErrors {
				return { error: true };
			}
		}

		const actual = resolver.resolve(SimpleValidator);

		expect(actual(null).error).toEqual(true);
	}));

	it('should resolve injectable validator type', inject([ValidatorResolver, Injector], (resolver: ValidatorResolver, injector: Injector) => {

		class NotInjectableValidator implements Validator {
			validate(control: AbstractControl): ValidationErrors {
				return { error: true }
			}
		}

		class InjectableValidator extends NotInjectableValidator {
			validate(control: AbstractControl): ValidationErrors {
				return { error: false }
			}
		}

		spyOn(injector, 'get').and.returnValue(new InjectableValidator());

		const actual = new ValidatorResolver(injector).resolve(NotInjectableValidator);

		expect(actual(null).error).toEqual(false);
	}));

});
