import { Element } from "./element";

class DlElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("dl", attributes, ...children);
  }
}

customElements.define('f-dl', DlElement);

export const Dl = (attributes: any, ...children: any[]) => new DlElement(attributes, ...children); 