import { Element } from "../html";
import { AppendArrayPatch } from "./appendarraypatch";
import { AppendPatch } from "./appendpatch";
import { Patch } from "./patch";
import { PatchTree } from "./patchtree";
import { PropsPatch } from "./propspatch";
import { RemovePatch } from "./removepatch";
import { ReplacePatch } from "./replacepatch";
import { TextPatch } from "./textpatch";

export class Diff {
  buildPatchTree(oldNode: Element | Element[] | string | number | undefined | null, newNode: Element | Element[] | string | number | undefined | null) {
    const patchTree = new PatchTree();

    if (oldNode === null || oldNode === undefined) {
      if (Array.isArray(newNode)) {
        patchTree.patch = new AppendArrayPatch(newNode as Element[]);
      } else {
        patchTree.patch = new AppendPatch(newNode as Element);
      }

      return patchTree;
    }

    if (newNode === null || newNode === undefined) {
      patchTree.patch = new RemovePatch();

      return patchTree;
    }

    // TODO: da gestire il caso in cui venga appeso un boolean: deve appendere un testo vuoto
    if (typeof oldNode === 'string' || typeof oldNode === 'number') {
      if (oldNode !== newNode) {
        patchTree.patch = new TextPatch(newNode as string);  

        return patchTree;
      }
    }

    if (typeof oldNode !== typeof newNode) {
      patchTree.patch = new ReplacePatch(newNode as Element);

      return patchTree;
    }

    if (oldNode instanceof Element && newNode instanceof Element) {
      if (oldNode.tag !== newNode.tag) {
        patchTree.patch = new ReplacePatch(newNode as Element);

        return patchTree;
      }

      patchTree.attributesPatch = new PropsPatch(this._diffAttributes(oldNode, newNode));

      patchTree.childrenPatches = this._diffChildren(oldNode, newNode);
    }

    return patchTree;
  }

  private _diffAttributes(oldNode: Element, newNode: Element): any {
    const attributes: any = {};

    for (const key in oldNode.attributes) {
      if (oldNode.attributes[key] !== newNode.attributes[key]) {
        attributes[key] = newNode.attributes[key] === undefined ? null : newNode.attributes[key];
      }
    }

    for (const key in newNode.attributes) {
      if (oldNode.attributes[key] === undefined) {
        attributes[key] = newNode.attributes[key];
      }
    }

    return attributes;
  }

  private _diffChildren(oldNode: Element, newNode: Element): any {
    const childrenPatches: Patch[] = [];
    let index = 0;

    while (index < oldNode.children.length) {
      const child = oldNode.children[index];
      const newChild = newNode.children[index];

      if (newChild === null || newChild === undefined) {
        childrenPatches.push(this.buildPatchTree(child, null));
      } else {
        childrenPatches.push(this.buildPatchTree(child, newChild));
      }

      index++;
    }

    while (index < newNode.children.length) {
      const newChild = newNode.children[index];

      childrenPatches.push(this.buildPatchTree(null, newChild));

      index++;
    }
    
    return childrenPatches;
  }
}
