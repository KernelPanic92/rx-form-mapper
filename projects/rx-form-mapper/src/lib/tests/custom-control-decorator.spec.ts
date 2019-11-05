import { CustomControl } from '..';
import { ControlType, modelBinder } from '../bind';

describe('CustomControl decorator', () => {

	it('should decorate', () => {
		class Test {
			@CustomControl(null)
			public field: string[];
		}

		expect(modelBinder.getMetadata(Test).properties.field.type === ControlType.CUSTOM).toBeTruthy();
	});

});
