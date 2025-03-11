import { Element } from "./element";

class ButtonElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("button", attributes, ...children);
  }
}

customElements.define('f-button', ButtonElement);

export const Button = (attributes: any, ...children: any[]) => new ButtonElement(attributes, ...children);
