import { Element } from "./element";

class StyleElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("style", attributes, ...children);
  }
}

customElements.define('f-style', StyleElement);

export const Style = (attributes: any, ...children: any[]) => new StyleElement(attributes, ...children); 