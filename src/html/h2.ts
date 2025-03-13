import { Element } from "./element";

class H2Element extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("h2", attributes, ...children);
  }
}

customElements.define('f-h2', H2Element);

export const H2 = (attributes: any, ...children: any[]) => new H2Element(attributes, ...children); 