import { Element } from "../html";
import { Patch } from "./patch";

export class ReplacePatch extends Patch {
  private _element: Element;

  constructor(element: Element) {
    super("replace");

    this._element = element;
  }

  applyTo(element: Element) {
    element.html.parentNode?.replaceChild(this._element.html, element.html);
  }
}
