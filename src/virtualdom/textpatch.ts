import { Element } from "../html";
import { Patch } from "./patch";

export class TextPatch extends Patch {
  private _text: string;

  constructor(text: string) {
    super();

    this._text = text;
  }

  applyTo(element: Element, parent: Element): void {
    parent.replaceText(this._text);
  }
}
