import { Element } from "./element";

class PictureElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("picture", attributes, ...children);
  }
}

customElements.define('f-picture', PictureElement);

export const Picture = (attributes: any, ...children: any[]) => new PictureElement(attributes, ...children); 