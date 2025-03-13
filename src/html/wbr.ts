import { Element } from "./element";

class WbrElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("wbr", attributes, ...children);
  }
}

customElements.define('f-wbr', WbrElement);

export const Wbr = (attributes: any, ...children: any[]) => new WbrElement(attributes, ...children); 