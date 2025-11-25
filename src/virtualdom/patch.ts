import { Element } from "../html";

export abstract class Patch {
  abstract applyTo(element: any, parent: Element | null): void | Promise<void>;
}
