import { Element } from "./element";

class OptionElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("option", attributes, ...children);
  }

  get value(): string {
    return (this._element as HTMLOptionElement)?.value ?? '';
  }

  set value(value: string) {
    if (this._element) {
      (this._element as HTMLOptionElement).value = value;
    }
  }

  get selected(): boolean {
    return (this._element as HTMLOptionElement)?.selected ?? false;
  }

  set selected(value: boolean) {
    if (this._element) {
      (this._element as HTMLOptionElement).selected = value;
    }
  }

  async connectedCallback() {
    await super.connectedCallback();
    // Imposta il valore iniziale
    const valueAttr = this.getAttribute('value');
    if (valueAttr !== null) {
      this.value = valueAttr;
    }
  }
}

customElements.define('f-option', OptionElement);

export const Option = (attributes: any, ...children: any[]) => new OptionElement(attributes, ...children); 