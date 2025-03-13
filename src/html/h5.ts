import { Element } from "./element";

class H5Element extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("h5", attributes, ...children);
  }
}

customElements.define('f-h5', H5Element);

export const H5 = (attributes: any, ...children: any[]) => new H5Element(attributes, ...children); 