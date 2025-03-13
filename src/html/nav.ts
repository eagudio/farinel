import { Element } from "./element";

class NavElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("nav", attributes, ...children);
  }
}

customElements.define('f-nav', NavElement);

export const Nav = (attributes: any, ...children: any[]) => new NavElement(attributes, ...children); 