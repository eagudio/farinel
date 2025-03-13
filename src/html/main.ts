import { Element } from "./element";

class MainElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("main", attributes, ...children);
  }
}

customElements.define('f-main', MainElement);

export const Main = (attributes: any, ...children: any[]) => new MainElement(attributes, ...children); 