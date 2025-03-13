import { Element } from "./element";

class MetaElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("meta", attributes, ...children);
  }
}

customElements.define('f-meta', MetaElement);

export const Meta = (attributes: any, ...children: any[]) => new MetaElement(attributes, ...children); 