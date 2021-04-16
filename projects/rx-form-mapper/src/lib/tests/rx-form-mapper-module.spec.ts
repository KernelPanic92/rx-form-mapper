import { Component, NgModule, NgModuleFactoryLoader } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { RxFormMapperModule } from '..';
import { RouterTestingModule } from '@angular/router/testing';

describe('RxFormMapperModule', () => {

	@Component({ template: '' })
	class TestComponent { }

	@NgModule({
		imports: [RxFormMapperModule.forRoot(), RouterModule.forChild([{ path: '', component: TestComponent }])]
	})
	class ChildModule { }

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RxFormMapperModule.forRoot(), RouterTestingModule.withRoutes([{ path: '', loadChildren: './test/ChildModule#ChildModule' }])],
		}).compileComponents();


	});

	it('Should not provide twice', async () => {
		// tslint:disable-next-line: deprecation
		const loader: any = TestBed.inject(NgModuleFactoryLoader);
		const router = TestBed.inject(Router);

		loader.stubbedModules = {
			'./test/ChildModule#ChildModule': ChildModule,
		};

		let error: Error = null;

		try {
			await router.navigate([]);
		} catch (e) {
			error = e;
		}

		expect(error.message).toEqual('RxFormMapperModule is already loaded. Import it in the AppModule only');
	});

});

