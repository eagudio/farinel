import { Element } from "./element";

class BlockquoteElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("blockquote", attributes, ...children);
  }
}

customElements.define('f-blockquote', BlockquoteElement);

export const Blockquote = (attributes: any, ...children: any[]) => new BlockquoteElement(attributes, ...children); 