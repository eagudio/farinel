import { Element } from "./element";

class TitleElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("title", attributes, ...children);
  }
}

customElements.define('f-title', TitleElement);

export const Title = (attributes: any, ...children: any[]) => new TitleElement(attributes, ...children); 