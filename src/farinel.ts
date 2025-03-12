import { Matcher } from "ciaplu";

export class Farinel extends Matcher<any> {
  private _observers: Farinel[] = [];
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

    const isChildOfObserver = this._observers.some(observer => 
      observer._context._returnValue?.contains(oldElement)
    );

    if (!isChildOfObserver) {
      oldElement.replaceWith(newElement);
    }

    this._observers.forEach(async (observer: Farinel) => {
      const oldObserverElement = observer._context._returnValue;

      observer._context._matched = false;
      observer._context.value = undefined;
      observer._context._returnValue = undefined;
      observer._context._results = [];
      observer._context._matcher = (value1: any, value2: any) => Promise.resolve(value1 === value2)

      const newObserverElement = await observer;

      if (oldObserverElement) {
        oldObserverElement.replaceWith(newObserverElement);
      }
    });
  }

  async createRoot(domElement: HTMLElement, farinel: Farinel) {
    const element = await farinel;

    domElement.appendChild(element);

    return this;
  }

  watching(farinels: Farinel[]) {
    farinels.forEach((farinel: Farinel) => {
      farinel._observers.push(this);

      this.extracting(async () => {
        await farinel;

        return this.state;
      });
    });

    return this;
  }

  test(matcher: (value1: any, value2: any) => Promise<boolean> | boolean) {
    super.test(matcher);

    return this;
  }

  extracting(handler: (state: any) => Promise<any> | any) {
    super.extracting(handler);

    return this;
  }

  with(value: any, handler: () => Promise<any> | any) {
    super.with(value, handler);

    return this;
  }

  when(matcher: (value: any) => Promise<boolean> | boolean, handler: () => Promise<any> | any) {
    super.when(matcher, handler);

    return this;
  }

  otherwise(handler: () => Promise<any> | any) {
    super.otherwise(handler);

    return this;
  }
}

export const farinel = () => new Farinel();
