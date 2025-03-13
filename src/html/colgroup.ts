import { Element } from "./element";

class ColgroupElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("colgroup", attributes, ...children);
  }
}

customElements.define('f-colgroup', ColgroupElement);

export const Colgroup = (attributes: any, ...children: any[]) => new ColgroupElement(attributes, ...children); 