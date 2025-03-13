import { Element } from "./element";

class SummaryElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("summary", attributes, ...children);
  }
}

customElements.define('f-summary', SummaryElement);

export const Summary = (attributes: any, ...children: any[]) => new SummaryElement(attributes, ...children); 