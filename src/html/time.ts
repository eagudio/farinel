import { Element } from "./element";

class TimeElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("time", attributes, ...children);
  }
}

customElements.define('f-time', TimeElement);

export const Time = (attributes: any, ...children: any[]) => new TimeElement(attributes, ...children); 