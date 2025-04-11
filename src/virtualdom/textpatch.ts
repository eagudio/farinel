import { Element } from "../html";
import { Patch } from "./patch";

export class TextPatch extends Patch {
  private _text: string;

  constructor(text: string) {
    super("text");

    this._text = text;
  }

  applyTo(element: Element, parent: Element): void {
    parent.html.textContent = this._text;
  }
}
