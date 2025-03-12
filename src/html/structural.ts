import { Element } from "./element";

class SectionElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("section", attributes, ...children);
  }
}

class ArticleElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("article", attributes, ...children);
  }
}

class NavElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("nav", attributes, ...children);
  }
}

class AsideElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("aside", attributes, ...children);
  }
}

class FooterElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("footer", attributes, ...children);
  }
}

class HeaderElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("header", attributes, ...children);
  }
}

class MainElement extends Element {
  constructor(attributes: any, ...children: any[]) {
    super("main", attributes, ...children);
  }
}

customElements.define('f-section', SectionElement);
customElements.define('f-article', ArticleElement);
customElements.define('f-nav', NavElement);
customElements.define('f-aside', AsideElement);
customElements.define('f-footer', FooterElement);
customElements.define('f-header', HeaderElement);
customElements.define('f-main', MainElement);

export const Section = (attributes: any, ...children: any[]) => new SectionElement(attributes, ...children);
export const Article = (attributes: any, ...children: any[]) => new ArticleElement(attributes, ...children);
export const Nav = (attributes: any, ...children: any[]) => new NavElement(attributes, ...children);
export const Aside = (attributes: any, ...children: any[]) => new AsideElement(attributes, ...children);
export const Footer = (attributes: any, ...children: any[]) => new FooterElement(attributes, ...children);
export const Header = (attributes: any, ...children: any[]) => new HeaderElement(attributes, ...children);
export const Main = (attributes: any, ...children: any[]) => new MainElement(attributes, ...children); 