import { Element } from "./element";

class BdiElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("bdi", attributes, ...children);
  }
}

customElements.define('f-bdi', BdiElement);

export const Bdi = (attributes: any, ...children: any[]) => new BdiElement(attributes, ...children); 