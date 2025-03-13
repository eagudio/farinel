import { Element } from "./element";

class ObjectElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("object", attributes, ...children);
  }
}

customElements.define('f-object', ObjectElement);

export const Object = (attributes: any, ...children: any[]) => new ObjectElement(attributes, ...children); 