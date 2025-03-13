import { Element } from "./element";

class DataElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("data", attributes, ...children);
  }
}

customElements.define('f-data', DataElement);

export const Data = (attributes: any, ...children: any[]) => new DataElement(attributes, ...children); 