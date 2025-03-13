import { Element } from "./element";

class ScriptElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("script", attributes, ...children);
  }
}

customElements.define('f-script', ScriptElement);

export const Script = (attributes: any, ...children: any[]) => new ScriptElement(attributes, ...children); 