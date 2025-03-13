import { Element } from "./element";

class DetailsElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("details", attributes, ...children);
  }
}

customElements.define('f-details', DetailsElement);

export const Details = (attributes: any, ...children: any[]) => new DetailsElement(attributes, ...children); 