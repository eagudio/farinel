import { Element } from "./element";

class H4Element extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("h4", attributes, ...children);
  }
}

customElements.define('f-h4', H4Element);

export const H4 = (attributes: any, ...children: any[]) => new H4Element(attributes, ...children); 