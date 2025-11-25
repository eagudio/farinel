import { Element } from "../html";
import { Patch } from "./patch";

export class AppendArrayPatch extends Patch {
  private _elements: Element[];

  constructor(elements: Element[]) {
    super();

    this._elements = elements;
  }

  async applyTo(element: Element, parent: Element): Promise<void> {
    // Se non c'è parent, non possiamo appendere
    if (!parent || typeof parent !== 'object' || !('append' in parent)) {
      return;
    }

    for (const el of this._elements) {
      // Skip elementi null o undefined
      if (!el) {
        continue;
      }

      // Renderizzare se è un Element instance (non string o primitive)
      if (typeof el === 'object' && 'render' in el) {
        await el.render();
      }
      
      parent.append(el);
    }
  }
}
