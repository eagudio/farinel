import { Matcher } from "ciaplu";

export class Farinel extends Matcher<any> {
  private _stating: (state: any) => any;

  constructor() {
    super({});

    this._stating = () => {};
  }

  get state() {
    return this._context.value;
  }

  stating(getState: (state: any) => {}) {
    this._stating = getState;

    this.extracting(async () => await this._stating(this._context.value));

    return this;
  }

  async setState(newState: any) {
    if (!this._context._returnValue) {
      throw new Error("Element not found");
    }

    const oldElement = this._context._returnValue;
    
    this._stating = async(state: any) => Promise.resolve(newState);

    this._context._matched = false;
    this._context.value = undefined;
    this._context._returnValue = undefined;
    this._context._results = [];
    this._context._matcher = (value1: any, value2: any) => Promise.resolve(value1 === value2)

    const newElement = await this;
    
    oldElement.replaceWith(newElement);
  }

  async createRoot(container: HTMLElement, farinel: Farinel) {
    if (!container) {
      throw new Error("Container element is required");
    }

    const element = await farinel;
    
    if (element) {
      container.appendChild(element);
    }

    return this;
  }

  first() {
    super.first();

    return this;
  }

  any() {
    super.any();

    return this;
  }

  with(value: any, handler: () => Promise<any> | any) {
    super.with(value, handler);

    return this;
  }

  withType<U>(value: new (...args: any[]) => U, handler: () => Promise<any> | any) {
    super.withType(value, handler);

    return this;
  }

  when(matcher: (value: any) => Promise<boolean> | boolean, handler: () => Promise<any> | any) {
    super.when(matcher, handler);

    return this;
  }

  not() {
    super.not();

    return this;
  }

  yet() {
    super.yet();

    return this;
  }
  
  extracting(handler: (state: any) => Promise<any> | any) {
    super.extracting(handler);

    return this;
  }

  test(matcher: (value1: any, value2: any) => Promise<boolean> | boolean) {
    super.test(matcher);

    return this;
  }

  otherwise(handler: () => Promise<any> | any) {
    super.otherwise(handler);

    return this;
  }

  one() {
    super.one();

    return this;
  }

  all() {
    super.all();

    return this;
  }

  return() {
    super.return();

    return this;
  }
}

export const farinel = () => new Farinel();
