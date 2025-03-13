import { Element } from "./element";

class BoldElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("b", attributes, ...children);
  }
}

customElements.define('f-b', BoldElement);

export const B = (attributes: any, ...children: any[]) => new BoldElement(attributes, ...children); 