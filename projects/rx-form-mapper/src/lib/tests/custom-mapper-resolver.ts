import { Injectable, Injector } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { AbstractControl, AbstractControlOptions, FormGroup } from '@angular/forms';
import { RxFormMapperModule } from '..';
import { CustomControlMapper } from '../interfaces';
import { RxFormMapper } from '../services';
import { CustomMapperResolver } from '../services/custom-mapper-resolver';

@Injectable()
class InjectableCustomControlMapper implements CustomControlMapper {

	public writeForm(value: any, abstractControlOptions: AbstractControlOptions): AbstractControl {
		return null;
	}

	public readForm(control: AbstractControl) {
		return null;
	}

}

class SimpleCustomControlMapper implements CustomControlMapper {

	public writeForm(value: any, abstractControlOptions: AbstractControlOptions): AbstractControl {
		return null;
	}

	public readForm(control: AbstractControl) {
		return null;
	}

}

describe('RxFormMapper', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RxFormMapperModule],
			providers: [InjectableCustomControlMapper]
		}).compileComponents();
	});

	it('should be created', inject([CustomMapperResolver], (resolver: CustomMapperResolver) => {
		expect(resolver).toBeTruthy();
	}));

	it('should resolve injected mapper', inject([Injector], (injector: Injector) => {
		spyOn(injector, 'get');

		const mapper = new CustomMapperResolver(injector).resolve(InjectableCustomControlMapper);

		expect(mapper).toBeTruthy();
		// tslint:disable-next-line: deprecation
		expect(injector.get).toHaveBeenCalled();
	}));

	it('should instantiate mapper', inject([Injector], (injector: Injector) => {
		spyOn(injector, 'get').and.returnValue(null);

		const mapper = new CustomMapperResolver(injector).resolve(SimpleCustomControlMapper);

		expect(mapper).toBeTruthy();
	}));
});
