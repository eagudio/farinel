import { Element } from "./element";

class H6Element extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("h6", attributes, ...children);
  }
}

customElements.define('f-h6', H6Element);

export const H6 = (attributes: any, ...children: any[]) => new H6Element(attributes, ...children); 