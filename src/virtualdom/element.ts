import { Diff } from "./diff";

export class Element {
  protected _element!: HTMLElement;
  private _tag: string = "";
  private _attributes: any;
  protected _children: any[] = [];
  private _events: any[] = [];
  // map eventName -> array of handlers attached via props (so we can remove them)
  private _attachedPropListeners: Record<string, EventListener[]> = {};

  constructor(tag: string, attributes: any, ...children: any[]) {
    this._tag = tag;
    this._attributes = attributes;
    // Normalize children: flatten nested arrays, convert booleans to empty strings,
    // and keep null/undefined to let the diff logic handle removals.
    this._children = this._normalizeChildren(children);
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

          // attach and record the listener so it can be removed later if props change
          this.attachListener(eventName, value);
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

  // Attach a listener coming from props (e.g. onClick) and remember it so we can remove later
  attachListener(event: string, handler: EventListener) {
    this._element.addEventListener(event, handler as EventListener);
    if (!this._attachedPropListeners[event]) {
      this._attachedPropListeners[event] = [];
    }
    this._attachedPropListeners[event].push(handler as EventListener);
  }

  // Remove all listeners previously attached via props for the given event
  detachPropListeners(event: string) {
    const listeners = this._attachedPropListeners[event];
    if (!listeners || listeners.length === 0) return;

    listeners.forEach((h) => {
      this._element.removeEventListener(event, h);
    });

    this._attachedPropListeners[event] = [];
  }

  async patch(newElement: Element) {
    // Verificare che this sia stato renderizzato
    if (!this._element) {
      // Se non è stato renderizzato, renderizzalo prima
      await this.render();
    }

    const diff = new Diff();
    const patchTree = diff.buildPatchTree(this, newElement);
    await patchTree.applyTo(this);
  }

  replace(newElement: Element) {
    // Verificare che this._element esista
    if (!this._element) {
      // Questo può succedere con rendering condizionale
      // Invece di throw, log warning e return gracefully
      console.warn('[Element.replace] Attempting to replace unrendered element - skipping');
      return;
    }
    
    // Verificare che newElement sia valido
    if (!newElement || !newElement.html) {
      console.warn('[Element.replace] Attempting to replace with invalid element - skipping');
      return;
    }
    
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
      // boolean children are rendered as empty text nodes
      this._element.appendChild(document.createTextNode(""));
    }
  }

  private _normalizeChildren(children: any[]): any[] {
    const result: any[] = [];

    for (const c of children) {
      if (Array.isArray(c)) {
        result.push(...this._normalizeChildren(c));
      } else if (c === true || c === false) {
        // represent booleans as empty strings so they become text nodes
        result.push("");
      } else if (c === null || c === undefined) {
        // keep null/undefined to allow diff to consider removals/additions
        result.push(c);
      } else {
        result.push(c);
      }
    }

    return result;
  }
  
}
