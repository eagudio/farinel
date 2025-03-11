import { Element } from "./element";

class BodyElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("body", attributes, children);
  }
}

customElements.define('f-body', BodyElement);

export const Body = (attributes: any, ...children: any[]) => new BodyElement(attributes, ...children);
