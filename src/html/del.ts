import { Element } from "./element";

class DelElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("del", attributes, ...children);
  }
}

customElements.define('f-del', DelElement);

export const Del = (attributes: any, ...children: any[]) => new DelElement(attributes, ...children); 