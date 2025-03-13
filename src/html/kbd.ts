import { Element } from "./element";

class KbdElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("kbd", attributes, ...children);
  }
}

customElements.define('f-kbd', KbdElement);

export const Kbd = (attributes: any, ...children: any[]) => new KbdElement(attributes, ...children); 