import { ControlType, modelBinder } from '../bind';
import { FormArray } from '../decorators';

describe('FormArray decorator', () => {

	it('should decorate with type', () => {
		class Test {
			@FormArray(String)
			public field: string[];
		}

		expect(modelBinder.getMetadata(Test).properties.field.type === ControlType.FORM_ARRAY).toBeTruthy();
		expect(modelBinder.getMetadata(Test).properties.field.propertyGenericArgumentType === String).toBeTruthy();
	});

	it('should decorate with opts', () => {
		class Test {
			@FormArray({type: String})
			public field: string[];
		}

		expect(modelBinder.getMetadata(Test).properties.field.propertyGenericArgumentType === String).toBeTruthy();
	});

});
