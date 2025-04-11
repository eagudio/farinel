import { Context } from "ciaplu";
import { FarinelMatcher } from "./fainelmatcher";
import { Element } from "./html/element";

export class Farinel {
  private _stating: (state: any) => any;
  private _matcher: FarinelMatcher;
  private _inform: any = () => {};
  private _element: Element | null = null;

  constructor() {
    this._stating = () => {};
    this._matcher = new FarinelMatcher({});
  }

  get state() {
    return this._matcher.context.value;
  }

  set element(element: Element) {
    this._element = element;
  }

  get element(): Element | null {
    return this._element;
  }

  async createRoot(container: HTMLElement, farinel: Farinel) {
    const element = await farinel.resolve();

    farinel._element = await farinel.resolveElement(element);

    await farinel._element.render();

    container.appendChild(farinel._element.html);

    return this;
  }

  async dispatch(newState: any) {
    if (!this._matcher.context.returnValue) {
      throw new Error("Element not found");
    }
    
    this._stating = async(state: any) => Promise.resolve(newState);

    this._matcher.context = new Context(newState);

    const newResolvedElement: Farinel | Element = await this.resolve();

    const newElement: Element = await this.resolveElement(newResolvedElement);

    await newElement.render();

    this._element?.patch(newElement);

    this._inform(this._element?.html);
  }

  async resolve() {
    await this._matcher;

    return this._matcher.context.returnValue;
  }

  rendering(handler: () => Promise<any> | any) {
    return this.otherwise(handler);
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

  private async resolveElement(element: Farinel | Element): Promise<Element> {
    if (element instanceof Farinel) {
      const result = await element.resolve();

      element._element = await this.resolveElement(result);

      return element._element;
    } else if (element instanceof Element) {
      return element;
    } else {
      throw new Error("Invalid element");
    }
  }
}
