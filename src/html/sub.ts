import { Element } from "./element";

class SubElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("sub", attributes, ...children);
  }
}

customElements.define('f-sub', SubElement);

export const Sub = (attributes: any, ...children: any[]) => new SubElement(attributes, ...children); 