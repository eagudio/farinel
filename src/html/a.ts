import { Element } from "./element";

class AnchorElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("a", attributes, ...children);
  }
}

customElements.define('f-a', AnchorElement);

export const A = (attributes: any, ...children: any[]) => new AnchorElement(attributes, ...children); 