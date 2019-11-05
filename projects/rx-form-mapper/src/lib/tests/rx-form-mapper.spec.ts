import { inject, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { RxFormMapperModule } from '..';
import { RxFormMapper } from '../services';

describe('RxFormMapper', () => {
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

	it('readForm should return null', inject([RxFormMapper], (formMapper: RxFormMapper) => {
		class Test {

		}

		expect(formMapper.readForm(null, Test)).toBeUndefined();
	}));

	it('readForm should not detect type', inject([RxFormMapper], (formMapper: RxFormMapper) => {

		expect(() => formMapper.readForm(new FormGroup({}), null)).toThrow();
	}));
});
