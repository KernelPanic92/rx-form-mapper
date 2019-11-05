import { ControlType } from '../bind';
import { modelBinder } from '../bind/model-binder';
import { FormGroup } from '../decorators';

describe('FormGroup decorator', () => {

	it('should decorate', () => {
		class Test {
			@FormGroup()
			public field: string[];
		}

		expect(modelBinder.getMetadata(Test).properties.field.type === ControlType.FORM_GROUP).toBeTruthy();
	});

});
