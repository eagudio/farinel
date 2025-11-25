import { Element } from "../html";
import { Patch } from "./patch";

export class ReplacePatch extends Patch {
  private _element: Element;

  constructor(element: Element) {
    super();

    this._element = element;
  }

  async applyTo(element: Element, parent: Element | null = null) {
    // Se element è undefined, potrebbe essere stato rimosso o non ancora creato
    // Se c'è un parent, aggiungiamo il nuovo elemento al parent invece
    if (!element) {
      if (parent && this._element) {
        // Renderizzare se è un Element
        if (typeof this._element === 'object' && 'render' in this._element) {
          await this._element.render();
          parent.append(this._element);
        }
      }
      return;
    }
    
    // Renderizzare il nuovo elemento se è un Element instance
    if (this._element && typeof this._element === 'object' && 'render' in this._element) {
      await this._element.render();
    }
    
    // Sostituire solo se element è valido
    if (element && typeof element === 'object' && 'replace' in element) {
      element.replace(this._element);
    }
  }
}
