import { Element } from "./element";

class StrongElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("strong", attributes, ...children);
  }
}

customElements.define('f-strong', StrongElement);

export const Strong = (attributes: any, ...children: any[]) => new StrongElement(attributes, ...children); 