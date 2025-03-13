import { Element } from "./element";

class PreElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("pre", attributes, ...children);
  }
}

customElements.define('f-pre', PreElement);

export const Pre = (attributes: any, ...children: any[]) => new PreElement(attributes, ...children); 