import { Element } from "./element";

class VideoElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("video", attributes, ...children);
  }
}

customElements.define('f-video', VideoElement);

export const Video = (attributes: any, ...children: any[]) => new VideoElement(attributes, ...children); 