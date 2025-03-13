import { Element } from "./element";

class BrElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("br", attributes, ...children);
  }
}

customElements.define('f-br', BrElement);

export const Br = (attributes: any, ...children: any[]) => new BrElement(attributes, ...children); 