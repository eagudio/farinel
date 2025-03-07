import { Farinel } from './main';

declare global {
  namespace JSX {
    interface Element extends Farinel {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module '*.tsx' {
  const content: any;
  export default content;
}

declare function createElement(
  type: string | ((props: any) => Farinel),
  props: any,
  ...children: any[]
): Farinel; 