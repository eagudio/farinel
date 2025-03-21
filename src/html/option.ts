import { Element } from "./element";

class OptionElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("option", attributes, ...children);
  }
}

customElements.define('f-option', OptionElement);

export const Option = (attributes: any, ...children: any[]) => new OptionElement(attributes, ...children); 