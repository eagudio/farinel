import { Element } from "../html";
import { Patch } from "./patch";

export class PropsPatch extends Patch {
  private _props: Record<string, any>;

  constructor(props: Record<string, any>) {
    super();

    this._props = props;
  }

  applyTo(element: Element): void {
    for (const key in this._props) {
      const value = this._props[key];
      if (key.startsWith('on')) {
        const eventName = key.substring(2).toLowerCase();
        if (typeof value === 'function') {
          // attach and remember via Element helper so it can be removed later
          // (this avoids creating anonymous handlers we can't remove)
          if ((element as any).attachListener) {
            (element as any).attachListener(eventName, value);
          } else {
            element.html.addEventListener(eventName, value);
          }
        } else {
          // remove previously attached prop listeners for this event
          if ((element as any).detachPropListeners) {
            (element as any).detachPropListeners(eventName);
          } else {
            // best-effort: remove a no-op listener (may not remove previously bound ones)
            element.html.removeEventListener(eventName, () => {});
          }
        }
      } else if (key === "disabled") {
        if (value === true) {
          element.html.setAttribute("disabled", "disabled");
        } else {
          element.html.removeAttribute("disabled");
        }
      } else if (key === "checked") {
        if (value === true) {
          element.html.setAttribute("checked", "checked");
        } else {
          element.html.removeAttribute("checked");
        }
      } else if (key === "value") {
        (element.html as HTMLInputElement).value = value;
      } else if (value === null || value === undefined) {
        element.html.removeAttribute(key);
      } else {
        element.html.setAttribute(key, value);
      }
    }
  }
}
