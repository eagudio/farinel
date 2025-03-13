import { Element } from "./element";

class OptgroupElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("optgroup", attributes, ...children);
  }
}

customElements.define('f-optgroup', OptgroupElement);

export const Optgroup = (attributes: any, ...children: any[]) => new OptgroupElement(attributes, ...children); 