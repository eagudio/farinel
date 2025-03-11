import { Element } from "./element";

class DivElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("div", attributes, children);
  }
}

customElements.define('f-div', DivElement);

export const Div = (attributes: any, ...children: any[]) => new DivElement(attributes, ...children);
