import { Element } from "../html";
import { Patch } from "./patch";

export class NullPatch extends Patch {
  applyTo(element: Element): void {
  }
}
