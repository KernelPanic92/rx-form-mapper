import {
	FormArray as RxFormArray,
	FormControl as RxFormControl,
	FormGroup as RxFormGroup
} from '@angular/forms';
import { TestBed, inject } from '@angular/core/testing';
import { FormControl, FormGroup, FormMapperService, FormMapperModule } from '..';


describe('FormArray', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [FormMapperModule]
		}).compileComponents();
	});

	it('should be created', inject([FormMapperService], mapper => {
		expect(mapper).toBeTruthy();
	}));


	it('Should create FormArray', inject([FormMapperService], formMapperService => {
		class TestClass {
			@FormControl()
			public sub: string;
		}

		const formGroup = formMapperService.writeForm(TestClass, [
			new TestClass()
		]);
		expect(formGroup instanceof RxFormArray).toBeTruthy();
	}));

	it('Should read FormArray', inject([FormMapperService], (formMapperService: FormMapperService) => {
		class TestClass {
			@FormControl()
			public name: string;
		}

		const formArray = new RxFormArray([
			new RxFormGroup({ name: new RxFormControl('test') })
		]);

		const parsed = formMapperService.readForm(TestClass, formArray);
		expect(Array.isArray(parsed)).toBeTruthy();
	}));

	it('Should create FormArray field', inject([FormMapperService], formMapperService => {
		class SubModel {}

		class TestClass {
			@FormControl()
			public name: string;

			@FormGroup(() => SubModel)
			public sub: SubModel[];
		}

		const formGroup = formMapperService.writeForm(
			TestClass,
			new TestClass()
		);

		expect(formGroup.get('sub') instanceof RxFormArray).toBeTruthy();
	}));

	it('Should read FormArray field', inject([FormMapperService], formMapperService => {
		class SubModel {
			@FormControl()
			public name: string;
		}

		class TestClass {
			@FormGroup(() => SubModel)
			public sub: SubModel[];
		}

		const formGroup = new RxFormGroup({
			sub: new RxFormArray([
				new RxFormGroup({ name: new RxFormControl('test') })
			])
		});

		const parsed = formMapperService.readForm(TestClass, formGroup);
		expect(parsed.sub[0].name).toEqual('test');
	}));

	it('Should read null', inject([FormMapperService], formMapperService => {
		class TestClass {
			@FormControl()
			public name: string;
		}

		expect(formMapperService.readForm(TestClass, null) ).toBeNull();
	}));
});
