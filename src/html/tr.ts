import { Element } from "./element";

class TrElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("tr", attributes, ...children);
  }
}

customElements.define('f-tr', TrElement);

export const Tr = (attributes: any, ...children: any[]) => new TrElement(attributes, ...children); 