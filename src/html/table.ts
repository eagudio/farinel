import { Element } from "./element";

class TableElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("table", attributes, ...children);
  }
}

customElements.define('f-table', TableElement);

export const Table = (attributes: any, ...children: any[]) => new TableElement(attributes, ...children);
