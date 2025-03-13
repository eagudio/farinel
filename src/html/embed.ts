import { Element } from "./element";

class EmbedElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("embed", attributes, ...children);
  }
}

customElements.define('f-embed', EmbedElement);

export const Embed = (attributes: any, ...children: any[]) => new EmbedElement(attributes, ...children); 