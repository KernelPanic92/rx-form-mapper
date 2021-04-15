import { ModelBinder } from '../bind';
import { FormGroup } from '../decorators';
import { FormGroupMetadata } from '../metadata';

describe('FormGroup decorator', () => {

	it('should decorate', () => {
		class Test {
			@FormGroup()
			public field: string[];
		}

		expect(ModelBinder.instance.getMetadata(Test).controls.field instanceof FormGroupMetadata).toBeTruthy();
	});

	it('should decorate with type', () => {
		class Test {
			@FormGroup(String)
			public field: string[];
		}

		expect(ModelBinder.instance.getMetadata(Test).controls.field instanceof FormGroupMetadata).toBeTruthy();
	});

});
