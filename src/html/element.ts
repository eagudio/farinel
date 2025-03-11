import { Farinel } from "../farinel";

export class Element extends HTMLElement {
  protected _element!: HTMLElement;
  private _type: string = "";
  private _attributes: any;
  public _children: any[] = [];

  constructor(type: string, attributes: any, ...children: any[]) {
    super();

    this._type = type;
    this._attributes = attributes;
    this._children = children;
  }
  
  connectedCallback() {
    if (this._type === "body") {
      this._element = document.body;
    } else {
      this._element = document.createElement(this._type) as HTMLInputElement;
    }

    this.appendChild(this._element);
    
    if (this._attributes) {
      Object.entries(this._attributes).forEach(([key, value]: [string, any]) => {
        if (key === "disabled" && (value === false || value === undefined)) {
          this._element.removeAttribute("disabled");
        } else if (key === "value") {
          (this._element as HTMLInputElement).value = value;
        } else {
          this._element.setAttribute(key, value);
        }
      });
    }
    
    this._appends(this._children);
  }

  on(event: string, handler: () => void) {
    this.addEventListener(event, handler);
    
    return this;
  }

  private _appends(children: any[]) {
    children.forEach(async c => {
      if (typeof c === "string") {
        this._element.appendChild(document.createTextNode(c));
      } else if (c instanceof Promise) {
        const resolvedChild = await c;
        this._element.appendChild(resolvedChild);
      } else if (c instanceof Node) {
        this._element.appendChild(c);
      } else if (Array.isArray(c)) {
        this._appends(c);
      } else {
        console.warn("Unrecognized element:", c);
      }
    });
  }
}
