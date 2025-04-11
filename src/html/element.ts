import { Farinel } from "../farinel";

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
  
  async render() {
    if (!this._element) {
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
  }

  on(event: string, handler: (e: any) => void) {
    this._events.push({ event, handler });
    
    return this;
  }

  patch(newElement: Element) {
    const patches = this._diff(this, newElement);

    this._applyPatch(this._element, patches);
  }

  private _diff(oldElement: Element | string | number | undefined | null, newElement: Element | string | number | undefined | null): any[] {
    const patches: any[] = [];
  
    // Funzione di supporto per aggiungere una patch
    const addPatch = (type: string, ...args: any[]) => {
      patches.push({ type, ...args });
    };
  
    this._compareNodes(oldElement, newElement, addPatch);
  
    return patches;
  }

  // Funzione ricorsiva per confrontare i nodi
  private _compareNodes(oldNode: Element | string | number | undefined | null, newNode: Element | string | number | undefined | null, addPatch: (type: string, ...args: any[]) => void) {
    if (oldNode === newNode) {
      return;
    }

    if (newNode === null || newNode === undefined) {
      addPatch('remove');
      return;
    }

    if (typeof oldNode !== typeof newNode) {
      addPatch('replace', newNode);
      return;
    }

    if (typeof oldNode === 'string' || typeof oldNode === 'number') {
      if (oldNode !== newNode) {
        addPatch('text', newNode);
      }
      return;
    }

    if (oldNode instanceof Element && newNode instanceof Element) {
      if (oldNode._tag !== newNode._tag) {
        addPatch('replace', newNode);
        return;
      }

      // Confronta gli attributi
      const attributesDiff = this._diffAttributes(oldNode._attributes, newNode._attributes);
      if (Object.keys(attributesDiff).length > 0) {
        addPatch('props', attributesDiff);
      }

      // Confronta i figli
      this._diffChildren(oldNode._children, newNode._children, addPatch);
    }
  }

  // Confronta gli attributi
  private _diffAttributes(oldAttrs: any, newAttrs: any): any {
    const changes: any = {};

    // Controlla gli attributi rimossi o cambiati nel vecchio nodo
    for (const key in oldAttrs) {
      if (oldAttrs[key] !== newAttrs[key]) {
        changes[key] = newAttrs[key] === undefined ? null : newAttrs[key];
      }
    }

    // Controlla gli attributi aggiunti nel nuovo nodo
    for (const key in newAttrs) {
      if (oldAttrs[key] === undefined) {
        changes[key] = newAttrs[key];
      }
    }

    return changes;
  }

  // Confronta i figli
  private _diffChildren(oldChildren: any[], newChildren: any[], addPatch: (type: string, ...args: any[]) => void) {
    const patchesChildren: any[] = [];
    const maxLength = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < maxLength; i++) {
        const oldChild = oldChildren[i];
        const newChild = newChildren[i];

        if (oldChild === newChild) {
          continue;
        }

        if (newChild === null || newChild === undefined) {
            patchesChildren.push({ index: i, patches: [{ type: 'remove' }] });
          continue;
        }

        if (typeof oldChild !== typeof newChild) {
          patchesChildren.push({ index: i, patches: [{ type: 'replace', payload: newChild }] });
          continue;
        }

        if (typeof oldChild === 'string' || typeof oldChild === 'number') {
          if (oldChild !== newChild) {
              patchesChildren.push({ index: i, patches: [{ type: 'text', text: newChild }] });
          }
          continue;
        }

        if (oldChild instanceof Element && newChild instanceof Element) {
          const childPatches = this._diff(oldChild, newChild);
          if (childPatches.length > 0) {
              patchesChildren.push({ index: i, patches: childPatches });
          }
          continue;
        }

        if (oldChild instanceof Farinel && newChild instanceof Farinel) {
          const childPatches = this._diff(oldChild.element, newChild.element);
          if (childPatches.length > 0) {
              patchesChildren.push({ index: i, patches: childPatches });
          }
          continue;
        }
    }

    if (patchesChildren.length > 0) {
        addPatch('children', patchesChildren);
    }
  }

  private _applyPatch(node: HTMLElement | Text | null, patches: any[]) {
    if (!node || !patches || patches.length === 0) {
        return;
    }

    patches.forEach(patchObj => {
        switch (patchObj.type) {
            case 'replace':
                const newElement = this._createElementFromVNode(patchObj[0]); // Modifica qui: accedi a patchObj[0]
                if (node.parentNode) {
                    node.parentNode.replaceChild(newElement, node);
                }
                break;
            case 'text':
                if (node instanceof Text) {
                    node.textContent = patchObj.text;
                }
                break;
            case 'props':
                if (node instanceof HTMLElement && patchObj[0]) { // Modifica qui: accedi a patchObj[0]
                    this._applyProperties(node, patchObj[0]);
                }
                break;
            case 'children':
                if (node instanceof HTMLElement && patchObj[0]) {
                    this._patchChildren(node, patchObj[0]);
                }
                break;
            case 'remove':
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
                break;
            default:
                console.warn('Tipo di patch non riconosciuto:', patchObj.type);
        }
    });
  }
  
  private _createElementFromVNode(vnode: any): HTMLElement | Text {
    if (typeof vnode === 'string' || typeof vnode === 'number') {
      return document.createTextNode(String(vnode));
    }
  
    const el = document.createElement(vnode.tag);
    this._applyProperties(el, vnode.props);
  
    vnode.children.forEach((childVNode: any) => {
      el.appendChild(this._createElementFromVNode(childVNode));
    });
  
    return el;
  }
  
  private _applyProperties(node: HTMLElement, props: any) {
    for (const key in props) {
      const value = props[key];
      if (key.startsWith('on')) {
        const eventName = key.substring(2).toLowerCase();
        if (typeof value === 'function') {
          node.addEventListener(eventName, value);
        } else {
          // Potresti voler gestire la rimozione degli event listener qui
          node.removeEventListener(eventName, () => {}); // Placeholder
        }
      } else if (key === "disabled") {
        if (value === true) {
          node.setAttribute("disabled", "disabled");
        } else {
          node.removeAttribute("disabled");
        }
      } else if (key === "checked") {
        if (value === true) {
          node.setAttribute("checked", "checked");
        } else {
          node.removeAttribute("checked");
        }
      } else if (key === "value") {
        (node as HTMLInputElement).value = value;
      } else if (value === null || value === undefined) {
        node.removeAttribute(key);
      } else {
        node.setAttribute(key, value);
      }
    }
  }
  
  private _patchChildren(parent: HTMLElement, childPatches: any[]) {
    childPatches.forEach(childPatchObj => {
      const index = childPatchObj.index;
      const patches = childPatchObj.patches;
      const childNode = parent.childNodes[index];
  
      this._applyPatch(childNode as HTMLElement | Text, patches);
    });
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

        c.element = resolvedChild;

        this._element.appendChild(resolvedChild._element);
      }
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
