

# RxFormMapper

[![Build Status](https://travis-ci.org/KernelPanic92/rx-form-mapper.svg?branch=master)](https://travis-ci.org/KernelPanic92/rx-form-mapper)
[![codecov](https://codecov.io/gh/KernelPanic92/rx-form-mapper/branch/master/graph/badge.svg)](https://codecov.io/gh/KernelPanic92/rx-form-mapper)
[![npm version](https://badge.fury.io/js/rx-form-mapper.svg)](https://badge.fury.io/js/rx-form-mapper)
[![dependencies Status](https://david-dm.org/KernelPanic92/rx-form-mapper/status.svg)](https://david-dm.org/KernelPanic92/rx-form-mapper)
[![NPM License](https://img.shields.io/npm/l/rx-form-mapper.svg)](https://img.shields.io/npm/l/rx-form-mapper.svg)
[![NPM bundle size](https://img.shields.io/bundlephobia/min/rx-form-mapper.svg)](https://img.shields.io/bundlephobia/min/rx-form-mapper.svg)

RxFormMapper is a framework developed for angular and allows you to convert, by annotation, classes into reactive form and vice versa.

## What is RxFormMapper

Reactive forms use an explicit and immutable approach to managing the state of a form at a given point in time. Each change to the form state returns a new state, which maintains the integrity of the model between changes. Reactive forms are built around observable streams, where form inputs and values are provided as streams of input values, which can be accessed synchronously.

So... Why RxFormMapper?

Sometimes you want to transform the classes you have into reactive forms, for example you have a user model that you want to have filled out by a form:

```typescript

export class User {
	name: string;
	surname: string;
	age: number;
}

```

So what to do? How to make a user form ? Solution is to create new instances of Reactive Form object and manually copy all properties to new object. But things may go wrong very fast once you have a more complex object hierarchy.

```typescript

new FormGroup(
	name: new FormControl(user.name),
	surname: new FormControl(user.surname),
	age: new FormControl(user.age),
);

```

To avoid all this you can use RxFormMapper: 

```typescript

export class User {

	@FormControl()
	name: string;

	@FormControl()
	surname: string;

	@FormControl()
	age: number;
}

```

```typescript

import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/models/user.model';

@Component({
	selector: 'app-user-editor',
	templateUrl: './user-editor.component.html',
	styleUrls: ['./user-editor.component.css']
})
export class UserEditorComponent {

	public form: FormGroup;
	constructor(rxFormMapper: RxFormMapper) {
		this.form = rxFormMapper.writeForm(User);
	}
}

```

## Getting started


### Install npm package

```bash
npm i rx-form-mapper --save

```

`reflect-metadata` is required (with angular+ you should already have this dependency installed.)

```bash
npm i reflect-metadata --save

```

### Import the component modules
Import the NgModule for RxFormMapper

```typescript
import { RxFormMapperModule } from 'rx-form-mapper';

@NgModule({
  ...
  imports: [RxFormMapperModule],
  ...
})
export class MyAppModule { }
```

### Inject RxFormMapper in your component

```typescript
import { RxFormMapper } from 'rx-form-mapper';

@Component({ ... })
export class MyComponent { 
	constructor(private readonly rxFormMapper: RxFormMapper) {}
}
```

### Build your form

```typescript
import { RxFormMapper } from 'rx-form-mapper';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { User } from 'src/app/models/user.model';

@Component({ ... })
export class MyComponent { 
	public myForm: FormGroup;
	constructor(rxFormMapper: RxFormMapper) {
		this.myForm = rxFormMapper.writeForm(User);
	}
}
```

## Decorators

### @FormControl

If you want to expose some of properties as a FormControl, you can do it by @FormControl decorator

```typescript
import { FormControl } from 'rx-form-mapper';

export class User {

	@FormControl()
	name: string;

	@FormControl()
	surname: string;

	@FormControl()
	age: number;
}

```

### @FormGroup

If you want to expose some of properties as a FormGroup, you can do it by @FormGroup decorator

```typescript
import { FormGroup } from 'rx-form-mapper';

export class Child {}

export class User {
	@FormGroup()
	child: Child;
}

```

when a property of type array is annotated with formgroup, it will be converted into FormArray. In these cases it is necessary to specify the type of the array to @FormGroup decorator

```typescript
import { FormControl, FormGroup } from 'rx-form-mapper';

export class Phone {
	@FormControl()
	type: string;
	@FormControl()
	number: string;
}

export class User {

	@FormControl()
	name: string;

	@FormControl()
	surname: string;
	
	@FormGroup(Phone)
	phones: Phone[];
}

```

### @Validator

If you want to set a validator on a model or property, you can do it by @Validator decorator

`@Validator` accepts all Angular validator types: `Validator`, `ValidatorFn`, `AsyncValidator`, `AsyncValidatorFn`

```typescript
import { FormControl, Validator } from 'rx-form-mapper';

export class User {

	@Validator(Validators.required)
	@FormControl()
	name: string;
}

```

#### Async validators

If you want to set an AsyncValidator on a model or property, you can do it passing additional 'async' parameter

```typescript
import { FormControl, Validator } from 'rx-form-mapper';

const asyncValidator = (control: AbstractControl) => return of(null);

export class User {

	@Validator(asyncValidator, 'async')
	@FormControl()
	name: string;
}

```

#### Injectable validators

Declare your validator class and decorate with `@Injectable`

```typescript
import { AsyncValidator } from '@angular/forms';

@Injectable()
export class UniqueNameValidator implements AsyncValidator {

	constructor(private readonly http: HttpProvider) {}

	public validate(control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> {
		// implementation
	}
}

```

And pass it as @Validator argument

```typescript
import { FormControl, AsyncValidator } from 'rx-form-mapper';
import { UniqueNameValidator } from 'src/app/validators/unique-Name.validator';

export class User {
	@Validator(UniqueNameValidator, 'async')
	@FormControl()
	name: string;
}

```

#### Additional data in injectable validators

Declare your validator class and inject VALIDATOR_DATA token

```typescript
import { AsyncValidator } from '@angular/forms';

@Injectable()
export class UniqueNameValidator implements AsyncValidator {

	constructor(private readonly http: HttpProvider, @Optional() @Inject(VALIDATOR_DATA) private readonly data: any) {}

	public validate(control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> {
		// implementation
	}
}

```

And pass it as @Validator argument

```typescript
import { FormControl, AsyncValidator } from 'rx-form-mapper';
import { UniqueNameValidator } from 'src/app/validators/unique-Name.validator';

export class User {
	@Validator(UniqueNameValidator, 'async', {excludedNames: ['John', 'Lucas']})
	@FormControl()
	name: string;
}

```
