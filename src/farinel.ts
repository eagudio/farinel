import { Context, Matcher } from "ciaplu";
import { FarinelMatcher } from "./fainelmatcher";

export class Farinel {
  private _stating: (state: any) => any;
  private _matcher: FarinelMatcher;
  private _inform: any = () => {};
  private _farinelContainer: Farinel | null = null;

  constructor() {
    this._stating = () => {};
    this._matcher = new FarinelMatcher({});
  }

  get state() {
    return this._matcher.context.value;
  }

  get farinelContainer(): Farinel | null {
    return this._farinelContainer;
  }

  set farinelContainer(farinel: Farinel) {
    this._farinelContainer = farinel;
  }

  async createRoot(container: HTMLElement, farinel: Farinel) {
    if (!container) {
      throw new Error("Container element is required");
    }

    const element = await farinel.resolve();
    
    if (element instanceof Farinel) {
      await element.createRoot(container, element);

      farinel._matcher.context.returnValue = element._matcher.context.returnValue;
      element.farinelContainer = farinel;
    }
    else {
      await element.draw();

      container.appendChild(element);
    }

    return this;
  }

  async setState(newState: any) {
    if (!this._matcher.context.returnValue) {
      throw new Error("Element not found");
    }

    const oldElement = this._matcher.context.returnValue;
    
    this._stating = async(state: any) => Promise.resolve(newState);

    this._matcher.context = new Context(newState);

    const newElement = await this.resolve();

    if (newElement instanceof Farinel) {
      const element = await newElement.resolve();

      await element.draw();

      oldElement.replaceWith(element);
    } else {
      await newElement.draw();
      
      oldElement.replaceWith(newElement);
    }

    if (this.farinelContainer) {
      this.farinelContainer._matcher.context.returnValue = newElement;
    }

    this._inform(newElement);
  }

  async resolve() {
    await this._matcher;

    return this._matcher.context.returnValue;
  }

  spy() {
    return new Promise<any>(resolve => {
      this._inform = resolve;
    });
  }

  stating(getState: (state: any) => {}) {
    this._stating = getState;

    this.extracting(async () => await this._stating(this._matcher.context.value));

    return this;
  }

  first() {
    this._matcher.first();

    return this;
  }

  any() {
    this._matcher.any();

    return this;
  }

  with(value: any, handler: () => Promise<any> | any) {
    this._matcher.with(value, handler);

    return this;
  }

  withType<U>(value: new (...args: any[]) => U, handler: () => Promise<any> | any) {
    this._matcher.withType(value, handler);

    return this;
  }

  when(matcher: (value: any) => Promise<boolean> | boolean, handler: () => Promise<any> | any) {
    this._matcher.when(matcher, handler);

    return this;
  }

  not() {
    this._matcher.not();

    return this;
  }

  yet() {
    this._matcher.yet();

    return this;
  }
  
  extracting(handler: (state: any) => Promise<any> | any) {
    this._matcher.extracting(handler);

    return this;
  }

  test(matcher: (value1: any, value2: any) => Promise<boolean> | boolean) {
    this._matcher.test(matcher);

    return this;
  }

  otherwise(handler: () => Promise<any> | any) {
    this._matcher.otherwise(handler);

    return this;
  }

  one() {
    this._matcher.one();

    return this;
  }

  all() {
    this._matcher.all();

    return this;
  }

  return() {
    this._matcher.return();

    return this;
  }
}
