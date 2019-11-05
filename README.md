

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
		this.myForm = rxFormMapper.writeForm(new User());
	}
}
```

## Modules

### RxFormMapperModule

This module enables RxFormMapper features

## Services

### RxFormMapper

This service provides the methods to serialize and deserialize our objects

## Methods

### writeForm

This method converts our class instance into reactive form instance

```typescript
this.form = formMapper.writeForm(new Post());
```

### readForm

This method converts our form instance into specific class instance

```typescript
const post: Post = formMapper.readForm(this.form, Post);
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

### @FormArray

If you want to expose some of properties as a FormArray, you can do it by @FormArray decorator

```typescript
import { FormGroup } from 'rx-form-mapper';

export class Child {}

export class User {
	@FormArray(Child)
	children: Child[];
}

```

When you're trying to serialize a property into FormArray its required to known what type of object you are trying to convert. 

### @FormControl

If you want to add extra data to your form, you can do it by optional @Form decorator

```typescript
import { Form } from 'rx-form-mapper';

@Form({
	validators: Validators.required
})
export class User {

	@FormControl()
	name: string;

	@FormControl()
	surname: string;

	@FormControl()
	age: number;
}

```

## Validators

If you want to set a validator on a class or a property, you can do it by specifying `validators` option to `@Form`, `@FormControl`,`@FormGroup` or `@FormArray` decorators

```typescript
import { FormControl, Validator } from 'rx-form-mapper';

export class User {

	@FormControl({
		validators: Validators.required
	})
	completeName: string;
}

```

## Async validators

If you want to set an AsyncValidator on a class or a property, you can do it by specifying `asyncValidators` option to `@Form`, `@FormControl`,`@FormGroup` or `@FormArray` decorators

```typescript
import { FormControl, Validator } from 'rx-form-mapper';

const asyncValidator = (control: AbstractControl) => return of(undefined);

export class User {


	@FormControl({
		asyncValidators: asyncValidator
	})
	name: string;
}

```

## Injectable validators

Sometimes you want to injects other services into your validator or asyncValidator, RxFormMapper allows you to do it simple with Angular Forms interfaces:

Declare your validator class implementing `Validator` or `AsyncValidator` interfaces, decorate with `@Injectable` and includes it in a module as a normal service.

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

And pass it's type as validator or asyncValidator option

```typescript
import { FormControl, AsyncValidator } from 'rx-form-mapper';
import { UniqueNameValidator } from 'src/app/validators/unique-Name.validator';

export class User {
	@FormControl({
		asyncValidators: UniqueNameValidator
	})
	name: string;
}

```
