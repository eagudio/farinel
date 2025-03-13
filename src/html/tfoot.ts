import { Element } from "./element";

class TfootElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("tfoot", attributes, ...children);
  }
}

customElements.define('f-tfoot', TfootElement);

export const Tfoot = (attributes: any, ...children: any[]) => new TfootElement(attributes, ...children); 