import { Element } from "../html";

export abstract class Patch {
  private _type: string;

  constructor(type: string) {
    this._type = type;
  }

  get type() {
    return this._type;
  }

  abstract applyTo(element: any, parent: Element | null): void;
}
