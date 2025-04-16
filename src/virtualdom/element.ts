import { Diff } from "./diff";

export class Element {
  protected _element!: HTMLElement;
  private _tag: string = "";
  private _attributes: any;
  protected _children: any[] = [];
  private _events: any[] = [];

  constructor(tag: string, attributes: any, ...children: any[]) {
    this._tag = tag;
    this._attributes = attributes;
    this._children = children;
  }

  get html() {
    return this._element;
  }

  get children() {
    return this._children;
  }

  get attributes() {
    return this._attributes;
  }

  get props() {
    return this._attributes;
  }

  get events() {
    return this._events;
  }
  
  get tag() {
    return this._tag;
  }
  
  async render(force: boolean = false) {
    if (this._element && !force) {
      return;
    }

    if (this._tag === "body") {
      this._element = document.body;
    } else {
      this._element = document.createElement(this._tag) as HTMLInputElement;
    }
    
    if (this._attributes) {
      Object.entries(this._attributes).forEach(([key, value]: [string, any]) => {
        if (key.startsWith('on') && typeof value === 'function') {
          const eventName = key.slice(2).toLowerCase();
          
          this._element.addEventListener(eventName, value);
        } else if (key === "disabled" && (value === false || value === undefined)) {
          this._element.removeAttribute("disabled");
        } else if (key === "checked" && (value === false || value === undefined)) {
          this._element.removeAttribute("checked");
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

  on(event: string, handler: (e: any) => void) {
    this._events.push({ event, handler });
    
    return this;
  }

  patch(newElement: Element) {
    const diff = new Diff();

    const patchTree = diff.buildPatchTree(this, newElement);

    patchTree.applyTo(this);
  }

  replace(newElement: Element) {
    this._element.replaceWith(newElement.html);
    this._element = newElement.html;
    this._tag = newElement.tag;
    this._attributes = newElement.attributes;
    this._children = newElement.children;
    this._events = newElement.events;
  }

  replaceText(newText: string) {
    this._element.textContent = newText;
    this._children = [newText];
  }

  append(newElement: Element) {
    this._element.appendChild(newElement.html);
    this._children.push(newElement);
  }

  remove() {
    this._element.remove();
    this._children = [];
    this._events = [];
    this._attributes = {};
    this._tag = "";
  }

  private async _appends(children: any[]) {
    for (const child of children) {
      await this._appendChildren(child);
    }
  }

  private async _appendChildren(c: any) {
    if (typeof c === "string") {
      this._element.appendChild(document.createTextNode(c));
    } else if (Array.isArray(c)) {
      await this._appends(c);
    } else if (c instanceof Element) {
      await c.render();

      this._element.appendChild(c._element);
    } else if (c === true || c === false) {
      this._element.appendChild(document.createTextNode(""));
    }
  }
}
