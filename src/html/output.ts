import { Element } from "./element";

class OutputElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("output", attributes, ...children);
  }
}

customElements.define('f-output', OutputElement);

export const Output = (attributes: any, ...children: any[]) => new OutputElement(attributes, ...children); 