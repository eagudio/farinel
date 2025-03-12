import { Element } from "./element";

class UlElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("ul", attributes, ...children);
  }
}

class OlElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("ol", attributes, ...children);
  }
}

class LiElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("li", attributes, ...children);
  }
}

customElements.define('f-ul', UlElement);
customElements.define('f-ol', OlElement);
customElements.define('f-li', LiElement);

export const Ul = (attributes: any, ...children: any[]) => new UlElement(attributes, ...children);
export const Ol = (attributes: any, ...children: any[]) => new OlElement(attributes, ...children);
export const Li = (attributes: any, ...children: any[]) => new LiElement(attributes, ...children); 