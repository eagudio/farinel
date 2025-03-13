import { Element } from "./element";

class AddressElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("address", attributes, ...children);
  }
}

customElements.define('f-address', AddressElement);

export const Address = (attributes: any, ...children: any[]) => new AddressElement(attributes, ...children); 