import { Element } from "./element";

class QElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("q", attributes, ...children);
  }
}

customElements.define('f-q', QElement);

export const Q = (attributes: any, ...children: any[]) => new QElement(attributes, ...children); 