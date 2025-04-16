import { Element } from "../html";
import { Patch } from "./patch";

export class AppendArrayPatch extends Patch {
  private _elements: Element[];

  constructor(elements: Element[]) {
    super();

    this._elements = elements;
  }

  applyTo(element: Element, parent: Element): void {
    this._elements.forEach(element => {
      parent.append(element);
    });
  }
}
