import { Element } from "./element";

class AudioElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("audio", attributes, ...children);
  }
}

customElements.define('f-audio', AudioElement);

export const Audio = (attributes: any, ...children: any[]) => new AudioElement(attributes, ...children); 