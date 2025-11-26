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
    
    const oldChildren = oldNode.children || [];
    const newChildren = newNode.children || [];
    
    // Strategia: gestire separatamente elementi con key ed elementi senza key
    // Gli elementi con key vengono matchati per key indipendentemente dalla posizione
    // Gli elementi senza key vengono matchati posizionalmente
    
    // Raccogliere elementi con key
    const oldKeyed: Map<string, { element: any, originalIndex: number }> = new Map();
    const newKeyed: Map<string, { element: any, originalIndex: number }> = new Map();
    const oldProcessed: Set<number> = new Set();
    const newProcessed: Set<number> = new Set();
    
    oldChildren.forEach((child, index) => {
      if (child !== null && child !== undefined && child !== false) {
        const key = this._getElementKey(child);
        if (key) {
          oldKeyed.set(key, { element: child, originalIndex: index });
        }
      }
    });
    
    newChildren.forEach((child, index) => {
      if (child !== null && child !== undefined && child !== false) {
        const key = this._getElementKey(child);
        if (key) {
          newKeyed.set(key, { element: child, originalIndex: index });
        }
      }
    });
    
    // 1. FASE KEY-BASED: Processare elementi con key
    // Per ogni posizione, se c'è un elemento con key, gestirlo in modo key-based
    const maxLength = Math.max(oldChildren.length, newChildren.length);
    
    for (let index = 0; index < maxLength; index++) {
      const oldChild = index < oldChildren.length ? oldChildren[index] : undefined;
      const newChild = index < newChildren.length ? newChildren[index] : undefined;
      
      const oldKey = (oldChild && oldChild !== false && oldChild !== null) ? this._getElementKey(oldChild) : null;
      const newKey = (newChild && newChild !== false && newChild !== null) ? this._getElementKey(newChild) : null;
      
      // CASO 1: Entrambi hanno key alla stessa posizione
      if (oldKey && newKey) {
        if (oldKey === newKey) {
          // Stesso elemento - patch
          childrenPatches.push(this.buildPatchTree(oldChild, newChild));
        } else {
          // Key diverse - sostituire completamente
          childrenPatches.push(this.buildPatchTree(oldChild, newChild));
        }
        oldProcessed.add(index);
        newProcessed.add(index);
      }
      // CASO 2: Solo oldChild ha key
      else if (oldKey && !newKey) {
        // Verificare se questo oldChild esiste ancora in newChildren
        if (newKeyed.has(oldKey)) {
          // Esiste ancora, ma in una posizione diversa - non processare qui
          // Verrà gestito quando incontreremo la nuova posizione
        } else {
          // Non esiste più - rimuovere
          if (oldChild === null || oldChild === undefined || oldChild === false) {
            // Se newChild è anche null/undefined/false, nessun cambiamento
            if (newChild === null || newChild === undefined || newChild === false) {
              childrenPatches.push(this.buildPatchTree(null, null));
            } else {
              // newChild esiste ma senza key - sostituire
              childrenPatches.push(this.buildPatchTree(oldChild, newChild));
            }
          } else {
            if (newChild === null || newChild === undefined || newChild === false) {
              // Rimuovere oldChild
              childrenPatches.push(this.buildPatchTree(oldChild, null));
            } else {
              // Sostituire con newChild
              childrenPatches.push(this.buildPatchTree(oldChild, newChild));
            }
          }
          oldProcessed.add(index);
          newProcessed.add(index);
        }
      }
      // CASO 3: Solo newChild ha key
      else if (!oldKey && newKey) {
        // Verificare se questo newChild esisteva già in oldChildren
        if (oldKeyed.has(newKey)) {
          // Esisteva, ma in una posizione diversa
          const oldMatch = oldKeyed.get(newKey)!;
          // Patch tra l'old e il new
          childrenPatches.push(this.buildPatchTree(oldMatch.element, newChild));
          oldProcessed.add(oldMatch.originalIndex);
        } else {
          // È un elemento completamente nuovo
          if (oldChild === null || oldChild === undefined || oldChild === false) {
            // Aggiungere
            childrenPatches.push(this.buildPatchTree(null, newChild));
          } else {
            // Sostituire oldChild senza key con newChild con key
            childrenPatches.push(this.buildPatchTree(oldChild, newChild));
          }
        }
        newProcessed.add(index);
        if (index < oldChildren.length) {
          oldProcessed.add(index);
        }
      }
      // CASO 4: Nessuno dei due ha key - matching posizionale tradizionale
      else {
        childrenPatches.push(this.buildPatchTree(oldChild, newChild));
        oldProcessed.add(index);
        newProcessed.add(index);
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
