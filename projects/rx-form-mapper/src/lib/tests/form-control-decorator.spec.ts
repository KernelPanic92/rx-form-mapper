import { ControlType, modelBinder } from '../bind';
import { FormControl } from '../decorators';

describe('FormControl decorator', () => {

	it('should decorate', () => {
		class Test {
			@FormControl()
			public field: string[];
		}

		expect(modelBinder.getMetadata(Test).properties.field.type === ControlType.FORM_CONTROL).toBeTruthy();
	});

});
