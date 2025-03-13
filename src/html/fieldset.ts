import { Element } from "./element";

class FieldsetElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("fieldset", attributes, ...children);
  }
}

customElements.define('f-fieldset', FieldsetElement);

export const Fieldset = (attributes: any, ...children: any[]) => new FieldsetElement(attributes, ...children); 