import { Element } from "./element";

class SourceElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("source", attributes, ...children);
  }
}

customElements.define('f-source', SourceElement);

export const Source = (attributes: any, ...children: any[]) => new SourceElement(attributes, ...children); 