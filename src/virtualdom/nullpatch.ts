import { Element } from "../html";
import { Patch } from "./patch";

export class NullPatch extends Patch {
  constructor() {
    super("null");
  }

  applyTo(element: Element): void {
  }
}
