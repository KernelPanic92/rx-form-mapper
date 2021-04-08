import { ModelBinder } from '../bind';
import { FormControl } from '../decorators';
import { FormControlMetadata } from '../metadata';

describe('FormControl decorator', () => {

	it('should decorate', () => {
		class Test {
			@FormControl()
			public field: string[];
		}

		expect(ModelBinder.instance.getMetadata(Test).controls.field instanceof FormControlMetadata).toBeTruthy();
	});

});
