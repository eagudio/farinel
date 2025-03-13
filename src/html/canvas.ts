import { Element } from "./element";

class CanvasElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("canvas", attributes, ...children);
  }
}

customElements.define('f-canvas', CanvasElement);

export const Canvas = (attributes: any, ...children: any[]) => new CanvasElement(attributes, ...children); 