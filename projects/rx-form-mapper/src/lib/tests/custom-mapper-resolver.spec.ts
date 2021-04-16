import { Injectable, Injector } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { AbstractControl, AbstractControlOptions, FormGroup } from '@angular/forms';
import { RxFormMapperModule } from '..';
import { CustomControlMapper } from '../interfaces';
import { RxFormMapper } from '../services';
import { CustomMapperResolver } from '../services/custom-mapper-resolver';

class UninstantiableCustomControlMapper implements CustomControlMapper {

	public constructor() {
		throw new Error('invalid operation');
	}

	public writeForm(value: any, abstractControlOptions: AbstractControlOptions): AbstractControl {
		return null;
	}

	public readForm(control: AbstractControl) {
		return null;
	}

}

class InstantiableCustomControlMapper extends UninstantiableCustomControlMapper {
	public constructor() {
		try{
			super();
		} catch (error) { /* do nothing */ }
	}
}

describe('RxFormMapper', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RxFormMapperModule],
		}).compileComponents();
	});

	it('should be created', inject([CustomMapperResolver], (resolver: CustomMapperResolver) => {
		expect(resolver).toBeTruthy();
	}));

	it('should resolve injected mapper', inject([Injector], (injector: Injector) => {
		spyOn(injector, 'get').and.returnValue(new InstantiableCustomControlMapper());


		const mapper = new CustomMapperResolver(injector).resolve(UninstantiableCustomControlMapper);

		expect(mapper).toBeTruthy();
		// tslint:disable-next-line: deprecation
		expect(injector.get).toHaveBeenCalled();
	}));

	it('should instantiate mapper', inject([Injector], (injector: Injector) => {
		spyOn(injector, 'get').and.returnValue(null);

		const mapper = new CustomMapperResolver(injector).resolve(InstantiableCustomControlMapper);

		expect(mapper).toBeTruthy();
	}));
});
