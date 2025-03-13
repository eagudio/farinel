import { Element } from "./element";

class IframeElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("iframe", attributes, ...children);
  }
}

customElements.define('f-iframe', IframeElement);

export const Iframe = (attributes: any, ...children: any[]) => new IframeElement(attributes, ...children); 