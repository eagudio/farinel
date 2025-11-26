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
      // Verificare se element.html è nel DOM
      if (element.html && element.html.parentNode) {
        // Element è nel DOM - usare replace normale
        element.replace(this._element);
      } else if (parent && typeof parent === 'object' && 'append' in parent) {
        // Element non è nel DOM ma abbiamo un parent - append al parent
        parent.append(this._element);
      } else {
        // Element non è nel DOM e non abbiamo parent - provare replace comunque
        // (potrebbe funzionare se l'elemento verrà aggiunto al DOM in seguito)
        element.replace(this._element);
      }
    }
  }
}
