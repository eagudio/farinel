import { Element } from "./element";

class FormElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("form", attributes, ...children);
  }
}

customElements.define('f-form', FormElement);

export const Form = (attributes: any, ...children: any[]) => new FormElement(attributes, ...children); 