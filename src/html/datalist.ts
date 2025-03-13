import { Element } from "./element";

class DatalistElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("datalist", attributes, ...children);
  }
}

customElements.define('f-datalist', DatalistElement);

export const Datalist = (attributes: any, ...children: any[]) => new DatalistElement(attributes, ...children); 