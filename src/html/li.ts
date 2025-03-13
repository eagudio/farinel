import { Element } from "./element";

class LiElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("li", attributes, ...children);
  }
}

customElements.define('f-li', LiElement);

export const Li = (attributes: any, ...children: any[]) => new LiElement(attributes, ...children); 