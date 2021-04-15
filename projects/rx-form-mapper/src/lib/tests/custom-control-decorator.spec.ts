import { AbstractControl, AbstractControlOptions, FormControl } from '@angular/forms';
import { CustomControl, CustomControlMapper } from '..';
import { ModelBinder } from '../bind';
import { CustomControlMetadata } from '../metadata';

describe('CustomControl decorator', () => {

	it('should decorate with type', () => {

		class CustomControlMapperImpl implements CustomControlMapper {
			public writeForm(value: any, abstractControlOptions: AbstractControlOptions): AbstractControl {
				return new FormControl(value, abstractControlOptions);
			}

			public readForm(control: AbstractControl): any {
				return control.value;
			}
		}

		class Test {
			@CustomControl(CustomControlMapperImpl)
			public field: string[];
		}

		expect(ModelBinder.instance.getMetadata(Test).controls.field instanceof CustomControlMetadata).toBeTruthy();
	});

	it('should decorate with opts', () => {

		class CustomControlMapperImpl implements CustomControlMapper {
			public writeForm(value: any, abstractControlOptions: AbstractControlOptions): AbstractControl {
				return new FormControl(value, abstractControlOptions);
			}

			public readForm(control: AbstractControl): any {
				return control.value;
			}
		}

		class Test {
			@CustomControl({
				mapper: CustomControlMapperImpl
			})
			public field: string[];
		}

		expect(ModelBinder.instance.getMetadata(Test).controls.field instanceof CustomControlMetadata).toBeTruthy();
	});

	it('should throw error when configuration is invalid', ()=> {

		expect(() => {

			class ChildTestClass {
				public field: string;
			}

			class TestClass {
				@CustomControl(null)
				public field: ChildTestClass;
			}

		}).toThrow();
	});

});
