import { Element } from "./element";

class ArticleElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("article", attributes, ...children);
  }
}

customElements.define('f-article', ArticleElement);

export const Article = (attributes: any, ...children: any[]) => new ArticleElement(attributes, ...children); 