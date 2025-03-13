import { Element } from "./element";

class OlElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("ol", attributes, ...children);
  }
}

customElements.define('f-ol', OlElement);

export const Ol = (attributes: any, ...children: any[]) => new OlElement(attributes, ...children); 