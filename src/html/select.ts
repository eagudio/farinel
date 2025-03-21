import { Element } from "./element";

class SelectElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("select", attributes, ...children);
  }
}

customElements.define('f-select', SelectElement);

export const Select = (attributes: any, ...children: any[]) => new SelectElement(attributes, ...children); 