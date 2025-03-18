import { Element } from "./element";

class InputElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("input", attributes, ...children);
  }
}

customElements.define('f-input', InputElement);

export const Input = (attributes: any, ...children: any[]) => new InputElement(attributes, ...children);
