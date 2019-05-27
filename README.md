

# RxFormMapper

[![Build Status](https://travis-ci.org/KernelPanic92/rx-form-mapper.svg?branch=master)](https://travis-ci.org/KernelPanic92/rx-form-mapper)
[![codecov](https://codecov.io/gh/KernelPanic92/rx-form-mapper/branch/master/graph/badge.svg)](https://codecov.io/gh/KernelPanic92/rx-form-mapper)

[!!WORK IN PROGRESS!!]

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

@Component({
	selector: 'app-user-editor',
	templateUrl: './user-editor.component.html',
	styleUrls: ['./user-editor.component.css']
})
export class UserEditorComponent {

	public form: FormGroup;
	constructor(rxFormMapper: RxFormMapper) {
		this.form = rxFormMapper.writeForm(new User());
	}
}

```

## Getting started

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

## Decorators

### @FormControl

If you want to expose some of properties as a FormControl, you can do it by @FormControl decorator

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

### @FormGroup

If you want to expose some of properties as a FormGroup, you can do it by @FormGroup decorator

```typescript

export class Child {}

export class User {
	@FormGroup()
	child: Child;
}

```

when a property of type array is annotated with formgroup, it will be converted into FormArray. In these cases it is necessary to specify the type of the array to @FormGroup decorator

```typescript

export class User {

	@FormControl()
	name: string;

	@FormControl()
	surname: string;
	
	@FormGroup(User)
	children: User[];
}

```

### @Validator

If you want to set a validator on a model or property, you can do it by @Validator decorator

```typescript

export class User {

	@Validator(Validators.required)
	@FormControl()
	name: string;
}

```

### @AsyncValidator

If you want to set an AsyncValidator on a model or property, you can do it by @AsyncValidator decorator as parameters:

#### Service type and method factory name

```typescript

export class User {

	@AsyncValidator(UserFormValidatorService, 'uniqueName')
	@FormControl()
	name: string;
}


@Injectable()
export class UserFormValidatorService {

	constructor(private readonly http: HttpProvider) {}

	public uniqueName(): AsyncValidatorFn {
		return (control) => {
			// implementation
		}
	}
}

```

#### AsyncValidatorFunction instance

```typescript

export class User {

	@AsyncValidator(MyAsyncValidatorFn)
	@FormControl()
	name: string;
}

```
