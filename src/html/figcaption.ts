import { Element } from "./element";

class FigcaptionElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("figcaption", attributes, ...children);
  }
}

customElements.define('f-figcaption', FigcaptionElement);

export const Figcaption = (attributes: any, ...children: any[]) => new FigcaptionElement(attributes, ...children); 