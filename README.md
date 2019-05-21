# RxFormMapper

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

## Decorators

### FormControl

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

### FormGroup

If you want to expose some of properties as a FormGroup, you can do it by @FormGroup decorator

```typescript
export class User {

	@FormControl()
	name: string;

	@FormControl()
	surname: string;
	
	@FormGroup()
	father: User;
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
