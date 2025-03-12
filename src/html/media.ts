import { Element } from "./element";

class ImgElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("img", attributes, ...children);
  }
}

class AudioElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("audio", attributes, ...children);
  }
}

class VideoElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("video", attributes, ...children);
  }
}

customElements.define('f-img', ImgElement);
customElements.define('f-audio', AudioElement);
customElements.define('f-video', VideoElement);

export const Img = (attributes: any, ...children: any[]) => new ImgElement(attributes, ...children);
export const Audio = (attributes: any, ...children: any[]) => new AudioElement(attributes, ...children);
export const Video = (attributes: any, ...children: any[]) => new VideoElement(attributes, ...children); 