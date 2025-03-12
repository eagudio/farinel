import { Element } from "./element";

class PElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("p", attributes, ...children);
  }
}

customElements.define('f-p', PElement);

export const P = (attributes: any, ...children: any[]) => new PElement(attributes, ...children); 