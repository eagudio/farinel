import { Element } from "./element";

class TextareaElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("textarea", attributes, ...children);
  }

  get value(): string {
    return (this._element as HTMLTextAreaElement)?.value ?? '';
  }

  set value(value: string) {
    if (this._element) {
      (this._element as HTMLTextAreaElement).value = value;
    }
  }
}

customElements.define('f-textarea', TextareaElement);

export const Textarea = (attributes: any, ...children: any[]) => new TextareaElement(attributes, ...children); 