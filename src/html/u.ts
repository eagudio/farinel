import { Element } from "./element";

class UElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("u", attributes, ...children);
  }
}

customElements.define('f-u', UElement);

export const U = (attributes: any, ...children: any[]) => new UElement(attributes, ...children); 