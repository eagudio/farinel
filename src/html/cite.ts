import { Element } from "./element";

class CiteElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("cite", attributes, ...children);
  }
}

customElements.define('f-cite', CiteElement);

export const Cite = (attributes: any, ...children: any[]) => new CiteElement(attributes, ...children); 