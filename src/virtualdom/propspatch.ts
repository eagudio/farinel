import { Element } from "../html";
import { Patch } from "./patch";

export class PropsPatch extends Patch {
  private _props: Record<string, any>;

  constructor(props: Record<string, any>) {
    super("props");

    this._props = props;
  }

  applyTo(element: Element): void {
    for (const key in this._props) {
      const value = this._props[key];
      if (key.startsWith('on')) {
        const eventName = key.substring(2).toLowerCase();
        if (typeof value === 'function') {
          element.html.addEventListener(eventName, value);
        } else {
          element.html.removeEventListener(eventName, () => {});
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
