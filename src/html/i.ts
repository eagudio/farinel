import { Element } from "./element";

class IElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("i", attributes, ...children);
  }
}

customElements.define('f-i', IElement);

export const I = (attributes: any, ...children: any[]) => new IElement(attributes, ...children); 