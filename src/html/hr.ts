import { Element } from "./element";

class HrElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("hr", attributes, ...children);
  }
}

customElements.define('f-hr', HrElement);

export const Hr = (attributes: any, ...children: any[]) => new HrElement(attributes, ...children); 