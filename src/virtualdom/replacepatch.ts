import { Element } from "../html";
import { Patch } from "./patch";

export class ReplacePatch extends Patch {
  private _element: Element;

  constructor(element: Element) {
    super();

    this._element = element;
  }

  applyTo(element: Element) {
    element.replace(this._element);
  }
}
