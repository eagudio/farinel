import { Element } from "./element";

class SpanElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("span", attributes, ...children);
  }
}

customElements.define('f-span', SpanElement);

export const Span = (attributes: any, ...children: any[]) => new SpanElement(attributes, ...children); 