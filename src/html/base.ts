import { Element } from "./element";

class BaseElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("base", attributes, ...children);
  }
}

customElements.define('f-base', BaseElement);

export const Base = (attributes: any, ...children: any[]) => new BaseElement(attributes, ...children); 