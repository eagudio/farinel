import { Element } from "./element";

class H1Element extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("h1", attributes, ...children);
  }
}

customElements.define('f-h1', H1Element);

export const H1 = (attributes: any, ...children: any[]) => new H1Element(attributes, ...children); 