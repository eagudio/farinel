import { Element } from "./element";

class ColElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("col", attributes, ...children);
  }
}

customElements.define('f-col', ColElement);

export const Col = (attributes: any, ...children: any[]) => new ColElement(attributes, ...children); 