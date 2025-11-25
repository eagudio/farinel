import { Element } from "../html";
import { Patch } from "./patch";

export class TextPatch extends Patch {
  private _text: string;

  constructor(text: string) {
    super();

    this._text = text;
  }

  applyTo(element: Element, parent: Element): void {
    // Parent deve esistere e avere il metodo replaceText
    if (!parent || typeof parent !== 'object' || !('replaceText' in parent)) {
      return;
    }
    parent.replaceText(this._text);
  }
}
