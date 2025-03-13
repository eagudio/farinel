import { Element } from "./element";

class ProgressElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("progress", attributes, ...children);
  }
}

customElements.define('f-progress', ProgressElement);

export const Progress = (attributes: any, ...children: any[]) => new ProgressElement(attributes, ...children); 