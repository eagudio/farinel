import { Element } from "./element";

class SampElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("samp", attributes, ...children);
  }
}

customElements.define('f-samp', SampElement);

export const Samp = (attributes: any, ...children: any[]) => new SampElement(attributes, ...children); 