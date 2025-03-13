import { Element } from "./element";

class MarkElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("mark", attributes, ...children);
  }
}

customElements.define('f-mark', MarkElement);

export const Mark = (attributes: any, ...children: any[]) => new MarkElement(attributes, ...children); 