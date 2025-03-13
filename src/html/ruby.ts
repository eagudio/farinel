import { Element } from "./element";

class RubyElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("ruby", attributes, ...children);
  }
}

customElements.define('f-ruby', RubyElement);

export const Ruby = (attributes: any, ...children: any[]) => new RubyElement(attributes, ...children); 