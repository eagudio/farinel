import { Element } from "./element";

class DfnElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("dfn", attributes, ...children);
  }
}

customElements.define('f-dfn', DfnElement);

export const Dfn = (attributes: any, ...children: any[]) => new DfnElement(attributes, ...children); 