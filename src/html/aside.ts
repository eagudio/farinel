import { Element } from "./element";

class AsideElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("aside", attributes, ...children);
  }
}

customElements.define('f-aside', AsideElement);

export const Aside = (attributes: any, ...children: any[]) => new AsideElement(attributes, ...children); 