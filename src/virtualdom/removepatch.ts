import { Element } from "../html";
import { Patch } from "./patch";

export class RemovePatch extends Patch {
  applyTo(element: Element, parent: Element): void {
    if (!element) {
      return;
    }
    element.remove();
  }
}
