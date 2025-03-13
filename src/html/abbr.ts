import { Element } from "./element";

class AbbrElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("abbr", attributes, ...children);
  }
}

customElements.define('f-abbr', AbbrElement);

export const Abbr = (attributes: any, ...children: any[]) => new AbbrElement(attributes, ...children); 