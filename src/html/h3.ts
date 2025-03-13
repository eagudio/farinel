import { Element } from "./element";

class H3Element extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("h3", attributes, ...children);
  }
}

customElements.define('f-h3', H3Element);

export const H3 = (attributes: any, ...children: any[]) => new H3Element(attributes, ...children); 