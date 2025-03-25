import { Farinel } from "../farinel";

export class Element {
  protected _element!: HTMLElement;
  private _type: string = "";
  private _attributes: any;
  protected _children: any[] = [];
  private _events: any[] = [];

  constructor(type: string, attributes: any, ...children: any[]) {
    this._type = type;
    this._attributes = attributes;
    this._children = children;
  }

  get html() {
    return this._element;
  }
  
  async render() {
    if (!this._element) {
      if (this._type === "body") {
        this._element = document.body;
      } else {
        this._element = document.createElement(this._type) as HTMLInputElement;
      }
      
      if (this._attributes) {
        Object.entries(this._attributes).forEach(([key, value]: [string, any]) => {
          if (key.startsWith('on') && typeof value === 'function') {
            const eventName = key.slice(2).toLowerCase();
            
            this._element.addEventListener(eventName, value);
          } else if (key === "disabled" && (value === false || value === undefined)) {
            this._element.removeAttribute("disabled");
          } else if (key === "value") {
            (this._element as HTMLInputElement).value = value;
          } else {
            this._element.setAttribute(key, value);
          }
        });
      }
      
      await this._appends(this._children);

      this._events.forEach(({ event, handler }) => {
        this._element.addEventListener(event, handler);
      });
    }
  }

  on(event: string, handler: (e: any) => void) {
    this._events.push({ event, handler });
    
    return this;
  }

  private async _appends(children: any[]) {
    for (const child of children) {
      await this._appendChildren(child);
    }
  }

  private async _appendChildren(c: any) {
    if (typeof c === "string") {
      this._element.appendChild(document.createTextNode(c));
    } else if (typeof c === "function") {
      const result = c();
      await result.render();
      await this._appendChildren(result);
    } else if (c instanceof Farinel) {
      const resolvedChild = await c.resolve();

      if (resolvedChild instanceof Farinel) {
        await resolvedChild.createRoot(this._element, resolvedChild);
      }
      else {
        await resolvedChild.render();

        this._element.appendChild(resolvedChild._element);
      }
    } else if (Array.isArray(c)) {
      await this._appends(c);
    } else if (c instanceof Element) {
      await c.render();

      this._element.appendChild(c._element);
    } 
  }
}
