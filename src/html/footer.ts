import { Element } from "./element";

class FooterElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("footer", attributes, ...children);
  }
}

customElements.define('f-footer', FooterElement);

export const Footer = (attributes: any, ...children: any[]) => new FooterElement(attributes, ...children); 