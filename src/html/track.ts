import { Element } from "./element";

class TrackElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("track", attributes, ...children);
  }
}

customElements.define('f-track', TrackElement);

export const Track = (attributes: any, ...children: any[]) => new TrackElement(attributes, ...children); 