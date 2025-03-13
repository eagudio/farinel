import { Element } from "./element";

class TemplateElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("template", attributes, ...children);
  }
}

customElements.define('f-template', TemplateElement);

export const Template = (attributes: any, ...children: any[]) => new TemplateElement(attributes, ...children); 