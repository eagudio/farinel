import { Element } from "./element";

class TableElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("table", attributes, ...children);
  }
}

class TheadElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("thead", attributes, ...children);
  }
}

class TbodyElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("tbody", attributes, ...children);
  }
}

class TrElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("tr", attributes, ...children);
  }
}

class ThElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("th", attributes, ...children);
  }
}

class TdElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("td", attributes, ...children);
  }
}

customElements.define('f-table', TableElement);
customElements.define('f-thead', TheadElement);
customElements.define('f-tbody', TbodyElement);
customElements.define('f-tr', TrElement);
customElements.define('f-th', ThElement);
customElements.define('f-td', TdElement);

export const Table = (attributes: any, ...children: any[]) => new TableElement(attributes, ...children);
export const Thead = (attributes: any, ...children: any[]) => new TheadElement(attributes, ...children);
export const Tbody = (attributes: any, ...children: any[]) => new TbodyElement(attributes, ...children);
export const Tr = (attributes: any, ...children: any[]) => new TrElement(attributes, ...children);
export const Th = (attributes: any, ...children: any[]) => new ThElement(attributes, ...children);
export const Td = (attributes: any, ...children: any[]) => new TdElement(attributes, ...children); 