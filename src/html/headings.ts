import { Element } from "./element";

class H1Element extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("h1", attributes, ...children);
  }
}

class H2Element extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("h2", attributes, ...children);
  }
}

class H3Element extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("h3", attributes, ...children);
  }
}

class H4Element extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("h4", attributes, ...children);
  }
}

class H5Element extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("h5", attributes, ...children);
  }
}

class H6Element extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("h6", attributes, ...children);
  }
}

customElements.define('f-h1', H1Element);
customElements.define('f-h2', H2Element);
customElements.define('f-h3', H3Element);
customElements.define('f-h4', H4Element);
customElements.define('f-h5', H5Element);
customElements.define('f-h6', H6Element);

export const H1 = (attributes: any, ...children: any[]) => new H1Element(attributes, ...children);
export const H2 = (attributes: any, ...children: any[]) => new H2Element(attributes, ...children);
export const H3 = (attributes: any, ...children: any[]) => new H3Element(attributes, ...children);
export const H4 = (attributes: any, ...children: any[]) => new H4Element(attributes, ...children);
export const H5 = (attributes: any, ...children: any[]) => new H5Element(attributes, ...children);
export const H6 = (attributes: any, ...children: any[]) => new H6Element(attributes, ...children); 