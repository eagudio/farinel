import { Element } from "./element";

class MenuElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("menu", attributes, ...children);
  }
}

customElements.define('f-menu', MenuElement);

export const Menu = (attributes: any, ...children: any[]) => new MenuElement(attributes, ...children); 