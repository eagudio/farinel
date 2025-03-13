import { Element } from "./element";

class CaptionElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("caption", attributes, ...children);
  }
}

customElements.define('f-caption', CaptionElement);

export const Caption = (attributes: any, ...children: any[]) => new CaptionElement(attributes, ...children); 