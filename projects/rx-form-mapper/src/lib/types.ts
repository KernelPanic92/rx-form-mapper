export interface AbstractClass<T> extends Function {prototype: T; }
export interface ConcreteClass<T> extends AbstractClass<T> { new(...args: any[]): T; }
export type Class<T> = AbstractClass<T> | ConcreteClass<T>;
