import { Matcher } from "ciaplu";

export class Farinel extends Matcher<any> {
  private _element: any;
  private _subjects: Farinel[] = [];

  constructor(state: any = {}, element: any) {
    super(state)
    
    this._element = element;
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
        } else {
          element.setAttribute(key, value);
        }
      });
    }
  
    // Aggiungi figli
    children.forEach(child => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Farinel) {
        element.appendChild(child.element);
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

  async setState(state: any) {
    this._context.value = state;

    await this;

    this._subjects.forEach(async (subject: Farinel) => {
      const result = await subject;

      if (result) {
        subject._element.replaceWith(result);
      }
    });
  }

  append(farinel: Farinel) {
    this._element.appendChild(farinel.element);

    return this;
  }

  subscribe(farinel: Farinel) {
    farinel._subjects.push(this);

    return this;
  }

  on(event: string, handler: any) {
    this._element.addEventListener(event, (e: any) => handler(this, e));

    return this;
  }
}

const farinel = (state: any, element: any) => new Farinel(state, element);

const MyButton = () => {
  const handleClick = (farinel: Farinel) => {
    farinel.setState({...farinel.state, loading: true});

    setTimeout(() => farinel.setState({counter: farinel.state.counter + 1, loading: false}), 3000);
  }

  return farinel({
      loading: false,
      counter: 0,
    },
      <button type="button">Click me!</button>
    )
    .on('click', (farinel: Farinel, e: any) => handleClick(farinel))
    .when((state: any) => state.counter > 5, () => console.log('counter is > then 5!!'))
    .when((state: any) => state.loading === true, () => console.log('loading...'))
    .otherwise(() => console.log('counter is low...')) as Farinel;
}

const Container = () => {
  const myButton = MyButton();

  return farinel({
      counter: 10,
    },
      <div>
        {myButton}
        <input type="text" value="{MyButton.state.counter}" />
        {myButton}
      </div>
    )
    .subscribe(myButton)
    .on('click', () => console.log("container click"))
    .on('mouseover', () => console.log("container over"))
    .test((state: any) => myButton.state.counter === state.counter)
    .with(10, () => (
      <div>HELLO!!</div>
    )) as Farinel;
}

const App = () => {
  const farinel = new Farinel({}, document.body);

  farinel.append(Container());
}

App();
