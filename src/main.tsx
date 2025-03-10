import { Matcher } from "ciaplu";

export class Farinel extends Matcher<any> {
  private _element: any;
  private _observers: Farinel[] = [];
  private _stating: (state: any) => any;

  constructor() {
    super({});

    this._stating = () => {};
  }

  static createElement(tag: any, props: any, ...children: any[]) {
    if (typeof tag === "function") {
      return tag(props);
    }
  
    const element: HTMLElement = document.createElement(tag);
    
    // Assegna gli attributi
    if (props) {
      Object.entries(props).forEach(([key, value]: [string, any]) => {
        if (key.startsWith("on")) {
          // Aggiungi eventi es: onClick -> click
          element.addEventListener(key.toLowerCase().substring(2), value);
        } else if (key === "disabled" && (value === false || value === undefined)) {
          // Rimuovi l'attributo disabled se è false o undefined
          element.removeAttribute("disabled");
        } else {
          element.setAttribute(key, value);
        }
      });
    }
  
    // Aggiungi figli
    children.forEach(async child => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Farinel) {
        child._element = await child;

        element.appendChild(child._element);
      } else if (child instanceof Node) {
        element.appendChild(child);
      } else {
        console.warn("Elemento non riconosciuto in JSX:", child);
      }
    });    
  
    return element;
  }

  get element() {
    return this._element;
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
    this._stating = async(state: any) => Promise.resolve(newState);

    this._context._matched = false;
    this._context.value = undefined;
    this._context._returnValue = undefined;
    this._context._results = [];
    this._context._matcher = (value1: any, value2: any) => Promise.resolve(value1 === value2)
    const newElement = await this;

    this._element.replaceWith(newElement);
    this._element = newElement;

    this._observers.forEach(async (observer: Farinel) => {
      observer._context._matched = false;
      observer._context.value = undefined;
      observer._context._returnValue = undefined;
      observer._context._results = [];
      observer._context._matcher = (value1: any, value2: any) => Promise.resolve(value1 === value2)

      const newObserverElement = await observer;

      observer._element.replaceWith(newObserverElement);
      observer._element = newObserverElement;
    });
  }

  async createRoot(domElement: HTMLElement, farinel: Farinel) {
    this._element = domElement;

    const element = await farinel;

    farinel._element = element;

    this._element.appendChild(element);

    return this;
  }

  watching(farinels: Farinel[]) {
    farinels.forEach((farinel: Farinel) => {
      farinel._observers.push(this);

      farinel.then(async (element: any) => {
        farinel._element = element;
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

const farinel = () => new Farinel();

const MyButton = () => {
  const myButton = farinel();

  const handleClick = async () => {
    await myButton.setState({...myButton.state, loading: true});

    setTimeout(async () => await myButton.setState({counter: myButton.state.counter + 1, loading: false}), 3000);
  }

  return myButton
    .stating((state: any) => ({
      loading: false,
      counter: 0,
    }))
    .when((state: any) => state.counter > 5, () => 
      <button type="button" onClick={() => handleClick()}>counter is &gt; then 5!!</button>
    )
    .extracting((state: any) => ({
      ...state,
      text: state.loading ? "Loading..." : "Click me!",
    }))
    .otherwise(() => 
      <button type="button" disabled={myButton.state.loading} onClick={() => handleClick()}>{myButton.state.text}</button>
    );
}

const Container = () => {
  const myButton = MyButton();

  return farinel()
    .stating((state: any) => ({
      maxCount: 5,
    }))
    .watching([myButton])
    .test((state: any) => myButton.state.counter === state.maxCount)
    .with(5, () => (
      <div>HELLO!!</div>
    ))
    .otherwise(() => 
      <div onClick={() => console.log("container click")} onMouseOver={() => console.log("container over")}>
        <input type="text" disabled={myButton.state.loading} value={myButton.state.counter} />
        {myButton}
      </div>
    );
}

const App = async () => {
  const farinel = new Farinel();

  await farinel
    .createRoot(document.body, Container());
}

App();
