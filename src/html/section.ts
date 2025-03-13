import { Element } from "./element";

class SectionElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("section", attributes, ...children);
  }
}

customElements.define('f-section', SectionElement);

export const Section = (attributes: any, ...children: any[]) => new SectionElement(attributes, ...children); 