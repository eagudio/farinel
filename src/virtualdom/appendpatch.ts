import { Element } from "../html";
import { Patch } from "./patch";

export class AppendPatch extends Patch {
  private _element: Element;

  constructor(element: Element) {
    super();

    this._element = element;
  }

  async applyTo(element: Element, parent: Element): Promise<void> {
    // Se non c'è elemento da appendere, skip
    if (!this._element) {
      return;
    }

    // Se non c'è parent, non possiamo appendere
    if (!parent || typeof parent !== 'object' || !('append' in parent)) {
      return;
    }

    // Renderizzare se è un Element instance (non string o primitive)
    if (typeof this._element === 'object' && 'render' in this._element) {
      await this._element.render();
    }
    
    parent.append(this._element);
  }
}
