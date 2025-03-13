import { Element } from "./element";

class MeterElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("meter", attributes, ...children);
  }
}

customElements.define('f-meter', MeterElement);

export const Meter = (attributes: any, ...children: any[]) => new MeterElement(attributes, ...children); 