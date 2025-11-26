import { Element } from "../html";
import { Patch } from "./patch";

export class ReplacePatch extends Patch {
  private _element: any; // Can be Element, string, number, boolean, null, or undefined

  constructor(element: any) {
    super();

    this._element = element;
  }

  async applyTo(element: any, parent: Element | null = null) {
    // Handle replacement when old element doesn't exist
    if (!element) {
      if (parent && this._element !== null && this._element !== undefined) {
        // Render if it's an Element
        if (typeof this._element === 'object' && 'render' in this._element) {
          await this._element.render();
        }
        parent.append(this._element);
      }
      return;
    }
    
    // Handle replacement with null/undefined (removal with placeholder)
    if (this._element === null || this._element === undefined) {
      // Replace the element with a comment placeholder
      if (element.html && element.html.parentNode) {
        const placeholder = document.createComment("placeholder");
        element.html.parentNode.replaceChild(placeholder, element.html);
        // Update the virtual element to reflect it's now a placeholder
        if (parent && parent.children) {
          const index = parent.children.indexOf(element);
          if (index >= 0) {
            parent.children[index] = null;
          }
        }
      }
      return;
    }
    
    // Render the new element if it's an Element instance
    if (typeof this._element === 'object' && 'render' in this._element) {
      await this._element.render();
    }
    
    // Replace only if element is valid
    if (element && typeof element === 'object' && 'replace' in element) {
      // Check if element.html is in the DOM
      if (element.html && element.html.parentNode) {
        // Element is in DOM - use normal replace
        element.replace(this._element);
      } else if (parent && typeof parent === 'object' && 'append' in parent) {
        // Element is not in DOM but we have a parent - append to parent
        parent.append(this._element);
      } else {
        // Element is not in DOM and we don't have parent - try replace anyway
        element.replace(this._element);
      }
    } else if (element && element.html && element.html.parentNode) {
      // Old element is a comment placeholder or text node
      // Replace it with the new content
      let newNode: Node;
      if (typeof this._element === 'object' && 'html' in this._element) {
        newNode = this._element.html;
      } else if (typeof this._element === 'string' || typeof this._element === 'number') {
        newNode = document.createTextNode(String(this._element));
      } else if (this._element === true || this._element === false) {
        newNode = document.createTextNode("");
      } else {
        newNode = document.createComment("placeholder");
      }
      element.html.parentNode.replaceChild(newNode, element.html);
    }
  }
}
