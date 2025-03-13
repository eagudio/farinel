import { Element } from "./element";

class RpElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("rp", attributes, ...children);
  }
}

customElements.define('f-rp', RpElement);

export const Rp = (attributes: any, ...children: any[]) => new RpElement(attributes, ...children); 