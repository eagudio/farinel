import { Element } from "./element";

class TbodyElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("tbody", attributes, ...children);
  }
}

customElements.define('f-tbody', TbodyElement);

export const Tbody = (attributes: any, ...children: any[]) => new TbodyElement(attributes, ...children); 