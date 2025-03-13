import { Element } from "./element";

class DtElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("dt", attributes, ...children);
  }
}

customElements.define('f-dt', DtElement);

export const Dt = (attributes: any, ...children: any[]) => new DtElement(attributes, ...children); 