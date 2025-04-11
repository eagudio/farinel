import { Element } from "../html";
import { NullPatch } from "./nullpatch";
import { Patch } from "./patch";

export class PatchTree extends Patch {
  private _patch: Patch = new NullPatch();
  private _attributesPatch: Patch = new NullPatch();
  private _childrenPatches: Patch[] = [];

  constructor() {
    super("tree");
  }

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

  applyTo(element: any, parent: Element | null = null): void {
    this.patch.applyTo(element, parent);

    this.attributesPatch.applyTo(element, parent);

    for (let i=0; i < this.childrenPatches.length; i++) {
      const patch = this.childrenPatches[i];

      patch.applyTo(element.children[i], element);
    }
  }
}
