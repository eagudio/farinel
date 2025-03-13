import { Element } from "./element";

class RtElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("rt", attributes, ...children);
  }
}

customElements.define('f-rt', RtElement);

export const Rt = (attributes: any, ...children: any[]) => new RtElement(attributes, ...children); 