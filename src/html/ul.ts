import { Element } from "./element";

class UlElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("ul", attributes, ...children);
  }
}

customElements.define('f-ul', UlElement);

export const Ul = (attributes: any, ...children: any[]) => new UlElement(attributes, ...children); 