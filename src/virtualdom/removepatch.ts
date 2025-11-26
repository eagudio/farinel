import { Element } from "../html";
import { Patch } from "./patch";

export class RemovePatch extends Patch {
  async applyTo(element: Element, parent: Element): Promise<void> {
    if (!element) {
      return;
    }
    
    // Verificare che l'elemento abbia il metodo remove
    if (typeof element.remove === 'function') {
      element.remove();
    } else if (element.html && element.html.parentNode) {
      // Se element è un Element virtuale, rimuovere l'html
      element.html.parentNode.removeChild(element.html);
    }
  }
}
