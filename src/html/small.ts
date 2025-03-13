import { Element } from "./element";

class SmallElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("small", attributes, ...children);
  }
}

customElements.define('f-small', SmallElement);

export const Small = (attributes: any, ...children: any[]) => new SmallElement(attributes, ...children); 