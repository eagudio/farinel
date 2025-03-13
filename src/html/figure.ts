import { Element } from "./element";

class FigureElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("figure", attributes, ...children);
  }
}

customElements.define('f-figure', FigureElement);

export const Figure = (attributes: any, ...children: any[]) => new FigureElement(attributes, ...children); 