import { Farinel } from "../farinel";

export class Element extends HTMLElement {
  protected _element!: HTMLElement;
  private _type: string = "";
  private _attributes: any;
  protected _children: any[] = [];

  constructor(type: string, attributes: any, ...children: any[]) {
    super();

    this._type = type;
    this._attributes = attributes;
    this._children = children;
  }
  
  async connectedCallback() {
    if (!this._element) {
      if (this._type === "body") {
        this._element = document.body;
      } else {
        this._element = document.createElement(this._type) as HTMLInputElement;
      }

      this.appendChild(this._element);
      
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
    }
  }

  on(event: string, handler: (e: any) => void) {
    this.addEventListener(event, (e: any) => handler(e));
    
    return this;
  }

  private _appends(children: any[]) {
    Promise.all(children.map(async c => await this._appendChildren(c)));
  }

  private async _appendChildren(c: any) {
    if (typeof c === "string") {
      this._element.appendChild(document.createTextNode(c));
    } else if (typeof c === "function") {
      const result = c();
      await this._appendChildren(result);
    } else if (c instanceof Farinel) {
      const resolvedChild = await c.resolve();

      if (resolvedChild instanceof Farinel) {
        await resolvedChild.createRoot(this._element, resolvedChild);
      }
      else {
        this._element.appendChild(resolvedChild);
      }
    } else if (c instanceof Node) {
      this._element.appendChild(c);
    } else if (Array.isArray(c)) {
      await this._appends(c);
    }
  }
}
