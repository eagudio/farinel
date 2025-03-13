import { Element } from "./element";

class ThElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("th", attributes, ...children);
  }
}

customElements.define('f-th', ThElement);

export const Th = (attributes: any, ...children: any[]) => new ThElement(attributes, ...children); 