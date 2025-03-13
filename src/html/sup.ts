import { Element } from "./element";

class SupElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("sup", attributes, ...children);
  }
}

customElements.define('f-sup', SupElement);

export const Sup = (attributes: any, ...children: any[]) => new SupElement(attributes, ...children); 