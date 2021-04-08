import { ModelBinder } from '../bind';
import { FormArray } from '../decorators';
import { FormArrayMetadata } from '../metadata';

describe('FormArray decorator', () => {

	it('should decorate with type', () => {
		class Test {
			@FormArray(String)
			public field: string[];
		}

		expect(ModelBinder.instance.getMetadata(Test).controls.field instanceof FormArrayMetadata).toBeTruthy();
		const formArrayMetadata = ModelBinder.instance.getMetadata(Test).controls.field as FormArrayMetadata;
		expect(formArrayMetadata.itemForm.type === String).toBeTruthy();
	});

	it('should decorate with opts', () => {
		class Test {
			@FormArray({type: String})
			public field: string[];
		}

		const formArrayMetadata = ModelBinder.instance.getMetadata(Test).controls.field as FormArrayMetadata;
		expect(formArrayMetadata.itemForm.type === String).toBeTruthy();
	});

	it('should throw error when configuration is invalid', ()=> {

		expect(() => {

			class TestClass {
				@FormArray(null)
				public field: [];
			}

		}).toThrow();
	});

});
