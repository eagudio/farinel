import { Element } from "./element";

class LegendElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("legend", attributes, ...children);
  }
}

customElements.define('f-legend', LegendElement);

export const Legend = (attributes: any, ...children: any[]) => new LegendElement(attributes, ...children); 