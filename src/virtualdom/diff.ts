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
  buildPatchTree(oldNode: Element | Element[] | string | number | boolean | undefined | null, newNode: Element | Element[] | string | number | boolean | undefined | null) {
    const patchTree = new PatchTree();

    // Se oldNode non esiste (null/undefined), dobbiamo aggiungere newNode
    if (oldNode === null || oldNode === undefined) {
      // Ma se newNode è false, è come se non esistesse, quindi non facciamo nulla
      if (newNode === false) {
        return patchTree;
      }
      
      if (Array.isArray(newNode)) {
        patchTree.patch = new AppendArrayPatch(newNode as Element[]);
      } else if (newNode !== true) {  // true viene convertito in text node vuoto
        patchTree.patch = new AppendPatch(newNode as Element);
      }

      return patchTree;
    }

    // Se newNode non esiste o è false, dobbiamo rimuovere oldNode
    if (newNode === null || newNode === undefined || newNode === false) {
      // Se oldNode era già false/true, non c'è nulla da rimuovere
      if (oldNode === false || oldNode === true) {
        return patchTree;
      }
      patchTree.patch = new RemovePatch();

      return patchTree;
    }

    // Handle text nodes (strings, numbers, booleans)
    if (typeof oldNode === 'string' || typeof oldNode === 'number' || typeof oldNode === 'boolean') {
      // If newNode is also a primitive (string, number, boolean), use TextPatch
      if (typeof newNode === 'string' || typeof newNode === 'number' || typeof newNode === 'boolean') {
        if (oldNode !== newNode) {
          // Convert boolean to empty string for text nodes
          const textValue = typeof newNode === 'boolean' ? '' : String(newNode);
          patchTree.patch = new TextPatch(textValue);
        }
        return patchTree;
      }
      // If newNode is an Element, use ReplacePatch
      patchTree.patch = new ReplacePatch(newNode as Element);
      return patchTree;
    }

    // If oldNode is an Element but newNode is a primitive, use TextPatch to replace with text
    if (oldNode instanceof Element && (typeof newNode === 'string' || typeof newNode === 'number' || typeof newNode === 'boolean')) {
      const textValue = typeof newNode === 'boolean' ? '' : String(newNode);
      patchTree.patch = new TextPatch(textValue);
      return patchTree;
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
    
    // Creare mappe per key-based matching
    const oldKeyed: Map<string, { element: any, index: number }> = new Map();
    const newKeyed: Map<string, { element: any, index: number }> = new Map();
    
    // Raccogliere elementi con chiavi
    oldNode.children.forEach((child, index) => {
      const key = this._getElementKey(child);
      if (key) {
        oldKeyed.set(key, { element: child, index });
      }
    });
    
    newNode.children.forEach((child, index) => {
      const key = this._getElementKey(child);
      if (key) {
        newKeyed.set(key, { element: child, index });
      }
    });
    
    // Fare matching key-based first, poi posizionale
    const maxLength = Math.max(oldNode.children.length, newNode.children.length);
    
    for (let index = 0; index < maxLength; index++) {
      const oldChild = index < oldNode.children.length ? oldNode.children[index] : null;
      const newChild = index < newNode.children.length ? newNode.children[index] : null;
      
      // Se entrambi hanno key, verificare se matchano
      const oldKey = oldChild ? this._getElementKey(oldChild) : null;
      const newKey = newChild ? this._getElementKey(newChild) : null;
      
      if (oldKey && newKey) {
        // Entrambi hanno key
        if (oldKey === newKey) {
          // Stesso elemento, fare patch
          childrenPatches.push(this.buildPatchTree(oldChild, newChild));
        } else {
          // Key diverse, verificare se il new element esisteva prima
          const oldMatch = oldKeyed.get(newKey);
          if (oldMatch) {
            // L'elemento è stato spostato, fare patch
            childrenPatches.push(this.buildPatchTree(oldMatch.element, newChild));
          } else {
            // Nuovo elemento
            childrenPatches.push(this.buildPatchTree(null, newChild));
          }
        }
      } else if (oldChild && newChild) {
        // Nessuna key, match posizionale tradizionale
        childrenPatches.push(this.buildPatchTree(oldChild, newChild));
      } else if (oldChild) {
        // Elemento rimosso
        childrenPatches.push(this.buildPatchTree(oldChild, null));
      } else if (newChild) {
        // Nuovo elemento
        childrenPatches.push(this.buildPatchTree(null, newChild));
      }
    }
    
    return childrenPatches;
  }
  
  private _getElementKey(element: any): string | null {
    if (!element || typeof element !== 'object') {
      return null;
    }
    
    // Usare l'attributo 'key' se presente
    if (element.attributes && element.attributes.key) {
      return `key:${element.attributes.key}`;
    }
    
    // Usare 'id' come chiave se presente
    if (element.attributes && element.attributes.id) {
      return `id:${element.attributes.id}`;
    }
    
    // Usare tag + class come identificatore parziale per elementi stabili
    if (element.tag && element.attributes && element.attributes.class) {
      const classStr = element.attributes.class;
      // Solo per elementi che hanno classi molto specifiche
      if (classStr && (classStr.includes('modal') || classStr.includes('navbar') || classStr.includes('header'))) {
        return `tag-class:${element.tag}:${classStr}`;
      }
    }
    
    return null;
  }
}
