import { Context } from "ciaplu";
import { FarinelMatcher } from "./farinelmatcher";
import { Element } from "./virtualdom/element";

export class Farinel extends Element {
  private _stating: (state: any) => any;
  private _matcher: FarinelMatcher;
  private _inform: any = () => {};
  private _renderPromise: Promise<void> | null = null;
  private _renderResolver: (() => void) | null = null;

  constructor() {
    super('div', {});

    this._stating = () => {};
    this._matcher = new FarinelMatcher({});
    
    // Create a promise that will be resolved when the first render completes
    this._renderPromise = new Promise<void>((resolve) => {
      this._renderResolver = resolve;
    });
  }

  get state() {
    return this._matcher.context.value;
  }

  async createRoot(container: HTMLElement, farinel: Farinel) {
    await farinel.render();

    container.appendChild(farinel.html);

    return this;
  }

  async dispatch(newState: any) {
    // Wait for the first render to complete if it hasn't yet
    if (this._renderPromise) {
      // Add a timeout to prevent hanging forever if createRoot is never called
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Component mount timeout: createRoot was not called within 10 seconds")), 10000);
      });
      
      try {
        await Promise.race([this._renderPromise, timeoutPromise]);
      } catch (error) {
        // Clear the promises on timeout error
        this._renderPromise = null;
        this._renderResolver = null;
        throw error;
      }
      // Note: Promise is set to null in render() after first render completes
    }
    
    if (!this._matcher.context.returnValue) {
      throw new Error("Element not found");
    }
    
    this._stating = async(state: any) => Promise.resolve(newState);

    this._matcher.context = new Context(newState);

    await this.render();

    this._inform(this.html);
  }

  async render() {
    await super.render();

    const element = await this._matcher;

    await element.render();
    
    if (element instanceof Farinel) {
      this.replace(element);
    } else {
      this.patch(element);
    }

    // Signal that the first render is complete if this is the first render
    if (this._renderResolver) {
      this._renderResolver();
      this._renderResolver = null;
      this._renderPromise = null;
    }
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
}
