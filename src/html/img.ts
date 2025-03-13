import { Element } from "./element";

class ImgElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("img", attributes, ...children);
  }
}

customElements.define('f-img', ImgElement);

export const Img = (attributes: any, ...children: any[]) => new ImgElement(attributes, ...children); 