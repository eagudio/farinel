import { Element } from "./element";

class DdElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("dd", attributes, ...children);
  }
}

customElements.define('f-dd', DdElement);

export const Dd = (attributes: any, ...children: any[]) => new DdElement(attributes, ...children); 