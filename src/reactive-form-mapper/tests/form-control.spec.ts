import {FormControl as RxFormControl, FormGroup as RxFormGroup} from '@angular/forms';
import { FormControl, FormMapperModule } from '..';
import { FormMapperService } from '..';
import { TestBed, inject } from '@angular/core/testing';

describe('FormControl', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [FormMapperModule],
		});
	});

	it('Should create FormControl', inject([FormMapperService], formMapperService => {

		class TestClass {
			@FormControl()
			public name: string;
		}

		const formGroup = formMapperService.writeForm(TestClass, new TestClass());
		expect(formGroup.get('name') instanceof RxFormControl).toBeTruthy();
	}));

	it('Should not create FormControl', inject([FormMapperService], formMapperService => {

		class TestClass {
			public name: string;
		}

		const formGroup = formMapperService.writeForm(TestClass, new TestClass());
		expect(formGroup.get('name')).toBeNull();
	}));

	it('Should set value in FormControl', inject([FormMapperService], formMapperService => {

		class TestClass {
			@FormControl()
			public name: string;
			constructor() {
				this.name = 'test';
			}
		}

		const formGroup = formMapperService.writeForm(TestClass, new TestClass());
		expect(formGroup.get('name').value).toEqual('test');
	}));

	it('Should read value in FormControl', inject([FormMapperService], formMapperService => {

		class TestClass {
			@FormControl()
			public name: string;
			constructor() {
				this.name = 'test';
			}
		}

		const formGroup = new RxFormGroup({name: new RxFormControl('test')});
		expect(formMapperService.readForm(TestClass, formGroup).name).toEqual('test');
	}));


});
