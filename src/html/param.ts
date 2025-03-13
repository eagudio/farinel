import { Element } from "./element";

class ParamElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("param", attributes, ...children);
  }
}

customElements.define('f-param', ParamElement);

export const Param = (attributes: any, ...children: any[]) => new ParamElement(attributes, ...children); 