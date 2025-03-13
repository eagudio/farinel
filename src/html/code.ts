import { Element } from "./element";

class CodeElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("code", attributes, ...children);
  }
}

customElements.define('f-code', CodeElement);

export const Code = (attributes: any, ...children: any[]) => new CodeElement(attributes, ...children); 