import { Element } from "./element";

class TextareaElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("textarea", attributes, ...children);
  }
}

customElements.define('f-textarea', TextareaElement);

export const Textarea = (attributes: any, ...children: any[]) => new TextareaElement(attributes, ...children); 