import { Element } from "./element";

class TheadElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("thead", attributes, ...children);
  }
}

customElements.define('f-thead', TheadElement);

export const Thead = (attributes: any, ...children: any[]) => new TheadElement(attributes, ...children); 