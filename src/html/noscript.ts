import { Element } from "./element";

class NoscriptElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("noscript", attributes, ...children);
  }
}

customElements.define('f-noscript', NoscriptElement);

export const Noscript = (attributes: any, ...children: any[]) => new NoscriptElement(attributes, ...children); 