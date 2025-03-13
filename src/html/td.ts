import { Element } from "./element";

class TdElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("td", attributes, ...children);
  }
}

customElements.define('f-td', TdElement);

export const Td = (attributes: any, ...children: any[]) => new TdElement(attributes, ...children); 