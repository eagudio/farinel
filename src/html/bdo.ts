import { Element } from "./element";

class BdoElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("bdo", attributes, ...children);
  }
}

customElements.define('f-bdo', BdoElement);

export const Bdo = (attributes: any, ...children: any[]) => new BdoElement(attributes, ...children); 