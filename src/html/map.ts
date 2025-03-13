import { Element } from "./element";

class MapElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("map", attributes, ...children);
  }
}

customElements.define('f-map', MapElement);

export const Map = (attributes: any, ...children: any[]) => new MapElement(attributes, ...children); 