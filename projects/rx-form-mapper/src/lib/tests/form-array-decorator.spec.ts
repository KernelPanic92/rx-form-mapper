import { Validators } from '@angular/forms';
import { ModelBinder } from '../bind';
import { Form } from '../decorators';

describe('Form decorator', () => {

	it('should decorate', () => {

		@Form({ validators: Validators.required })
		class Test {

			public field: string[];

		}

		expect(ModelBinder.instance.getMetadata(Test).validators).toHaveSize(1);
	});

});
