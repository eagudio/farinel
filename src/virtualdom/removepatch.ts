import { Element } from "../html";
import { Patch } from "./patch";

export class RemovePatch extends Patch {
  constructor() {
    super("remove");
  }

  applyTo(element: Element, parent: Element): void {
    element.remove();
  }
}
