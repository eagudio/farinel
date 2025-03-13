import { Element } from "./element";

class SElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("s", attributes, ...children);
  }
}

customElements.define('f-s', SElement);

export const S = (attributes: any, ...children: any[]) => new SElement(attributes, ...children); 