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

    // Handle children if element has them
    if (element && element.children && Array.isArray(element.children)) {
      // Apply patches to existing children
      // Use the full length of childrenPatches to handle additions/removals
      for (let i = 0; i < this.childrenPatches.length; i++) {
        const patch = this.childrenPatches[i];
        const child = i < element.children.length ? element.children[i] : undefined;
        
        // If child is null/undefined but we have a DOM node at this position (comment placeholder),
        // we need to create a temporary Element wrapper for patching
        if ((child === null || child === undefined) && element._childNodes && element._childNodes[i]) {
          // Create a temporary Element that wraps the DOM node
          const tempElement: any = {
            html: element._childNodes[i],
            children: [],
            tag: element._childNodes[i].nodeType === Node.COMMENT_NODE ? 'placeholder' : 'text',
            attributes: {}
          };
          await patch.applyTo(tempElement, element);
          // Update _childNodes with the potentially new node
          if (tempElement.html !== element._childNodes[i]) {
            element._childNodes[i] = tempElement.html;
          }
        } else {
          await patch.applyTo(child, element);
        }
      }
    } else if (this.childrenPatches.length > 0 && parent) {
      // If element doesn't have children but there are patches, they might be appends
      // In this case, apply patches passing parent
      for (const patch of this.childrenPatches) {
        await patch.applyTo(undefined, parent);
      }
    }
  }
}
