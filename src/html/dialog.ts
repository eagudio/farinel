import { Element } from "./element";

class DialogElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("dialog", attributes, ...children);
  }
}

customElements.define('f-dialog', DialogElement);

export const Dialog = (attributes: any, ...children: any[]) => new DialogElement(attributes, ...children); 