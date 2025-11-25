import { Element } from "../html";
import { NullPatch } from "./nullpatch";
import { Patch } from "./patch";

export class PatchTree extends Patch {
  private _patch: Patch = new NullPatch();
  private _attributesPatch: Patch = new NullPatch();
  private _childrenPatches: Patch[] = [];

  get patch() {
    return this._patch;
  }

  set patch(patch: Patch) {
    this._patch = patch;
  }

  get attributesPatch() {
    return this._attributesPatch;
  }

  set attributesPatch(patch: Patch) {
    this._attributesPatch = patch;
  }

  get childrenPatches() {
    return this._childrenPatches;
  }

  set childrenPatches(patch: Patch[]) {
    this._childrenPatches = patch;
  }

  async applyTo(element: any, parent: Element | null = null): Promise<void> {
    // Il patch principale (replace, append, remove, ecc.) può gestire element undefined
    await this.patch.applyTo(element, parent);

    // Gli attributi si applicano solo se element esiste ed è un Element valido
    if (element && typeof element === 'object' && element.html) {
      await this.attributesPatch.applyTo(element, parent);
    }

    // Gestire children solo se element li ha
    if (element && element.children && Array.isArray(element.children)) {
      const maxIndex = Math.min(this.childrenPatches.length, element.children.length);
      
      // Applicare patch agli elementi esistenti
      for (let i = 0; i < maxIndex; i++) {
        const patch = this.childrenPatches[i];
        const child = element.children[i];
        await patch.applyTo(child, element);
      }
      
      // Gestire patch extra (elementi aggiunti che non hanno ancora corrispondenza)
      for (let i = maxIndex; i < this.childrenPatches.length; i++) {
        const patch = this.childrenPatches[i];
        await patch.applyTo(undefined, element);
      }
    } else if (this.childrenPatches.length > 0 && parent) {
      // Se element non ha children ma ci sono patch, potrebbero essere append
      // In questo caso, applichiamo i patch passando parent
      for (const patch of this.childrenPatches) {
        await patch.applyTo(undefined, parent);
      }
    }
  }
}
