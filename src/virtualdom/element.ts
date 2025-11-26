import { Diff } from "./diff";

export class Element {
  protected _element!: HTMLElement;
  private _tag: string = "";
  private _attributes: any;
  protected _children: any[] = [];
  protected _childNodes: Node[] = []; // Track actual DOM nodes for each child (including placeholders)
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

  replace(newElement: Element | string | number | boolean | null | undefined) {
    // Handle null/undefined/false - replace with comment placeholder to maintain alignment
    if (newElement === null || newElement === undefined || newElement === false) {
      if (this._element && this._element.parentNode) {
        const placeholder = document.createComment("placeholder");
        this._element.parentNode.replaceChild(placeholder, this._element);
        this._element = placeholder as any;
      }
      return;
    }
    
    // Convert primitives to text node
    if (typeof newElement === 'string' || typeof newElement === 'number' || typeof newElement === 'boolean') {
      if (this._element) {
        const textValue = typeof newElement === 'boolean' ? '' : String(newElement);
        // If current element is a comment placeholder, replace with text node
        if (this._element.nodeType === Node.COMMENT_NODE && this._element.parentNode) {
          const textNode = document.createTextNode(textValue);
          this._element.parentNode.replaceChild(textNode, this._element);
          this._element = textNode as any;
        } else {
          this._element.textContent = textValue;
        }
      }
      return;
    }
    
    // Verify that this._element exists
    if (!this._element) {
      // This can happen with conditional rendering
      return;
    }
    
    // newElement is an Element - verify it's valid and rendered
    if (!newElement || !newElement.html) {
      return;
    }
    
    // Replace current element (which might be a comment placeholder) with new Element
    if (this._element.nodeType === Node.COMMENT_NODE && this._element.parentNode) {
      // Current element is a comment placeholder - replace it with the new Element
      this._element.parentNode.replaceChild(newElement.html, this._element);
    } else {
      // Normal element replacement
      this._element.replaceWith(newElement.html);
    }
    
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

  append(newElement: Element | string | number | boolean | null | undefined) {
    if (newElement instanceof Element) {
      this._element.appendChild(newElement.html);
    } else if (typeof newElement === "string" || typeof newElement === "number") {
      this._element.appendChild(document.createTextNode(String(newElement)));
    } else if (newElement === true || newElement === false) {
      this._element.appendChild(document.createTextNode(""));
    } else if (newElement === null || newElement === undefined) {
      // Use comment node as placeholder
      this._element.appendChild(document.createComment("placeholder"));
    }
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
    let domNode: Node;
    
    if (typeof c === "string" || typeof c === "number") {
      domNode = document.createTextNode(String(c));
      this._element.appendChild(domNode);
    } else if (Array.isArray(c)) {
      await this._appends(c);
      return; // Arrays don't add a single node
    } else if (c instanceof Element) {
      await c.render();
      domNode = c._element;
      this._element.appendChild(c._element);
    } else if (c === true || c === false) {
      // boolean children are rendered as empty text nodes
      domNode = document.createTextNode("");
      this._element.appendChild(domNode);
    } else if (c === null || c === undefined) {
      // Use a comment node as placeholder for null/undefined children
      // This maintains index alignment between virtual children and DOM nodes
      domNode = document.createComment("placeholder");
      this._element.appendChild(domNode);
    } else {
      // Unknown type - use comment placeholder
      domNode = document.createComment("unknown");
      this._element.appendChild(domNode);
    }
    
    // Track the DOM node for this child
    if (domNode!) {
      this._childNodes.push(domNode);
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
        // Keep null/undefined - they will be rendered as comment placeholders
        result.push(c);
      } else {
        result.push(c);
      }
    }

    return result;
  }
  
}
