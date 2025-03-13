import { Element } from "./element";

class VarElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("var", attributes, ...children);
  }
}

customElements.define('f-var', VarElement);

export const Var = (attributes: any, ...children: any[]) => new VarElement(attributes, ...children); 