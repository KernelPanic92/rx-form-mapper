import { FormArray as RxFormArray, FormControl as RxFormControl, FormGroup as RxFormGroup } from '@angular/forms';

import { FormControl, FormGroup, FormMapperService } from '..';
import { TestBed, inject } from '@angular/core/testing';
import { FormMapperModule } from '..';

describe('FormGroup', () => {

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [FormMapperModule],
		});
	});

	it('Should create FormGroup', inject([FormMapperService], formMapperService => {

		class SubModel {}
		class TestClass {
			@FormGroup()
			public sub: SubModel;
		}

		const formGroup = formMapperService.writeForm(TestClass, new TestClass());
		expect(formGroup.get('sub') instanceof RxFormGroup).toBeTruthy();
	}));

	it('Should not create FormGroup', inject([FormMapperService], formMapperService => {

		class SubModel {}
		class TestClass {
			public sub: SubModel;
		}

		const formGroup = formMapperService.writeForm(TestClass, new TestClass());
		expect(formGroup.get('sub')).toBeNull();
	}));

	it('Should set value in FormGroup', inject([FormMapperService], formMapperService => {

		class SubModel {

			@FormControl()
			public name = 'test';
		}

		class TestClass {

			@FormGroup()
			public sub: SubModel = new SubModel();
		}

		const formGroup = formMapperService.writeForm(TestClass, new TestClass());
		expect(formGroup.get('sub.name').value).toEqual('test');
	}));

	it('Should read value in FormGroup', inject([FormMapperService], formMapperService => {

		class SubModel {
			@FormControl()
			public name: string;
		}

		class TestClass {

			@FormGroup(() => SubModel)
			public sub: SubModel;
		}

		const formGroup = new RxFormGroup({
			sub: new RxFormGroup({
				name: new RxFormControl('test')
			})
		});

		expect(formMapperService.readForm(TestClass, formGroup).sub.name).toEqual('test');
	}));

	it('Should read null', inject([FormMapperService], formMapperService => {

		class TestClass {
			@FormControl()
			public name: string;
		}

		expect(formMapperService.readForm(TestClass, null)).toBeNull();
	}));
});
