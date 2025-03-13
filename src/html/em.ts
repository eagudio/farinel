import { Element } from "./element";

class EmElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("em", attributes, ...children);
  }
}

customElements.define('f-em', EmElement);

export const Em = (attributes: any, ...children: any[]) => new EmElement(attributes, ...children); 