import { Element } from "./element";

class InsElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("ins", attributes, ...children);
  }
}

customElements.define('f-ins', InsElement);

export const Ins = (attributes: any, ...children: any[]) => new InsElement(attributes, ...children); 