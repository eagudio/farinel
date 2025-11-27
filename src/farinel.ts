import { Context } from "ciaplu";
import { FarinelMatcher } from "./farinelmatcher";
import { Element } from "./virtualdom/element";

type Pattern = 
  | { type: 'when'; predicate: (value: any) => Promise<boolean> | boolean; handler: () => Promise<any> | any }
  | { type: 'with'; value: any; handler: () => Promise<any> | any }
  | { type: 'withType'; typeConstructor: new (...args: any[]) => any; handler: () => Promise<any> | any };

export class Farinel extends Element {
  private _stating: (state: any) => any;
  private _matcher: FarinelMatcher;
  private _inform: any = () => {};
  private _renderPromise: Promise<void> | null = null;
  private _renderResolver: (() => void) | null = null;
  private _templateHandler: (() => Promise<any> | any) | null = null;
  private _currentState: any = {};
  private _hasOnlyOtherwise: boolean = true; // Track if we're using only .otherwise()
  private _renderedElement: Element | null = null; // Track the last rendered element for patching
  private _patterns: Pattern[] = []; // Store all patterns (.when, .with, .withType) in order for reactive re-evaluation

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
    return this._currentState;
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
    
    // After waiting for first render, we're good to proceed
    // The reactive pattern matching or .otherwise() will handle the dispatch
    
    this._stating = async(state: any) => Promise.resolve(newState);
    
    // Save the new state
    this._currentState = newState;

    // Always update the matcher's context with the new state
    this._matcher.context = new Context(newState);
    
    // If we're using ONLY .otherwise() (no .when() or other patterns) and have a rendered element,
    // execute the template handler directly and patch from this Farinel element
    // This avoids recreating the matcher which loses the DOM context
    if (this._templateHandler && this._hasOnlyOtherwise && this._renderedElement) {
      const newElement = await this._templateHandler();
      await newElement.render();
      await this.patch(newElement);
      this._renderedElement = newElement;
      this._inform(this.html);
      return;
    }

    // REACTIVE PATTERN MATCHING
    // If we have patterns and a rendered element, evaluate them reactively
    if (!this._hasOnlyOtherwise && this._patterns.length > 0 && this._renderedElement) {
      // Evaluate all patterns in order
      for (const pattern of this._patterns) {
        let matches = false;
        
        switch (pattern.type) {
          case 'when':
            matches = await pattern.predicate(newState);
            break;
          case 'with':
            // Check if values match (using === for primitives, or deep equality could be added)
            matches = newState === pattern.value || 
                     (typeof pattern.value === 'function' && await pattern.value(newState));
            break;
          case 'withType':
            // Check if newState is an instance of the type
            matches = newState instanceof pattern.typeConstructor;
            break;
        }
        
        if (matches) {
          // Execute the handler for the first matching pattern
          const newElement = await pattern.handler();
          await newElement.render();
          // Patch from this Farinel root (which is mounted in DOM) to the new element
          await this.patch(newElement);
          // Update the reference for next time
          this._renderedElement = newElement;
          this._inform(this.html);
          return;
        }
      }
      
      // If no pattern matched, fall through to .otherwise() if it exists
      if (this._templateHandler) {
        const newElement = await this._templateHandler();
        await newElement.render();
        // Patch from this Farinel root (same as when patterns match)
        await this.patch(newElement);
        this._renderedElement = newElement;
        this._inform(this.html);
        return;
      }
    }

    await this.render();

    this._inform(this.html);
  }

  async render() {
    await super.render();

    // Use the matcher to get the element
    // The matcher will use the updated context and execute the handler
    const element = await this._matcher;

    await element.render();
    
    if (element instanceof Farinel) {
      this.replace(element);
      // Save the element even if it's a Farinel instance
      this._renderedElement = element;
    } else {
      // Patch from the previously rendered element if it exists (reactive rendering)
      // Otherwise patch from self (first render)
      if (this._renderedElement) {
        await this._renderedElement.patch(element);
      } else {
        await this.patch(element);
      }
      
      // Save the current rendered element for next patch
      this._renderedElement = element;
    }

    // Signal that the first render is complete (resolves any waiting dispatches)
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

    this.extracting(async () => {
      const state = await this._stating(this._matcher.context.value);
      // Save the initial state
      this._currentState = state;
      return state;
    });

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
    this._hasOnlyOtherwise = false; // Mark that we're using pattern matching
    
    // Store the pattern for reactive re-evaluation
    this._patterns.push({
      type: 'with',
      value: value,
      handler: handler
    });
    
    this._matcher.with(value, handler);

    return this;
  }

  withType<U>(value: new (...args: any[]) => U, handler: () => Promise<any> | any) {
    this._hasOnlyOtherwise = false; // Mark that we're using pattern matching
    
    // Store the pattern for reactive re-evaluation
    this._patterns.push({
      type: 'withType',
      typeConstructor: value,
      handler: handler
    });
    
    this._matcher.withType(value, handler);

    return this;
  }

  when(matcher: (value: any) => Promise<boolean> | boolean, handler: () => Promise<any> | any) {
    this._hasOnlyOtherwise = false; // Mark that we're using pattern matching
    
    // Store the pattern for reactive re-evaluation
    this._patterns.push({
      type: 'when',
      predicate: matcher,
      handler: handler
    });
    
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
    // Save the template handler for reactive re-rendering
    this._templateHandler = handler;
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
