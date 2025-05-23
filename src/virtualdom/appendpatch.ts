import { Element } from "../html";
import { Patch } from "./patch";

export class AppendPatch extends Patch {
  private _element: Element;

  constructor(element: Element) {
    super();

    this._element = element;
  }

  applyTo(element: Element, parent: Element): void {
    if (!this._element) {
      return;
    }

    parent.append(this._element);
  }
}
