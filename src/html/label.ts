import { Element } from "./element";

class LabelElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("label", attributes, ...children);
  }
}

customElements.define('f-label', LabelElement);

export const Label = (attributes: any, ...children: any[]) => new LabelElement(attributes, ...children); 