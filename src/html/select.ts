import { Element } from "./element";

class SelectElement extends Element {
  private _value: string;

  constructor(attributes: any, ...children: any[]) {
    super("select", attributes, ...children);
    this._value = attributes?.value?.toString() ?? '';
  }

  get value(): string {
    return (this._element as HTMLSelectElement)?.value ?? this._value;
  }

  set value(value: string) {
    this._value = value;
    if (this._element) {
      (this._element as HTMLSelectElement).value = value;
    }
  }

  async connectedCallback() {
    await super.connectedCallback();
    if (this._value) {
      (this._element as HTMLSelectElement).value = this._value;
    }
  }
}

customElements.define('f-select', SelectElement);

export const Select = (attributes: any, ...children: any[]) => new SelectElement(attributes, ...children); 