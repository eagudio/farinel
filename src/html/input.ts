import { Element } from "./element";

class InputElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("input", attributes, ...children);
  }

  get value(): string {
    return (this._element as HTMLInputElement)?.value ?? '';
  }

  set value(value: string) {
    if (this._element) {
      (this._element as HTMLInputElement).value = value;
    }
  }
}

customElements.define('f-input', InputElement);

export const Input = (attributes: any, ...children: any[]) => new InputElement(attributes, ...children);
