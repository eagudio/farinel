import { Element } from "./element";

class HeaderElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("header", attributes, ...children);
  }
}

customElements.define('f-header', HeaderElement);

export const Header = (attributes: any, ...children: any[]) => new HeaderElement(attributes, ...children); 