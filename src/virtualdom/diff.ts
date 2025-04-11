import { Farinel } from "../farinel";
import { Element } from "../html";
import { Patch } from "./patch";
import { PatchTree } from "./patchtree";
import { PropsPatch } from "./propspatch";
import { ReplacePatch } from "./replacepatch";
import { TextPatch } from "./textpatch";

export class Diff {
  buildPatchTree(oldNode: Element | string | number | undefined | null, newNode: Element | string | number | undefined | null) {
    const patchTree = new PatchTree();

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

    if (oldNode instanceof Farinel && newNode instanceof Farinel) {
      if (!oldNode.element || !newNode.element) {
        return patchTree;
      }

      if (oldNode.element.tag !== newNode.element.tag) {
        patchTree.patch = new ReplacePatch(newNode.element as Element);

        return patchTree;
      }

      patchTree.attributesPatch = new PropsPatch(this._diffAttributes(oldNode.element, newNode.element));

      patchTree.childrenPatches = this._diffChildren(oldNode.element, newNode.element);
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

    oldNode.children.forEach((child, index) => {
      childrenPatches.push(this.buildPatchTree(child, newNode.children[index]));
    });

    return childrenPatches;
  }
}
