import { Element } from '../virtualdom/element';

export { Element };

// Basic elements
export const A = (attributes: any, ...children: any[]) => new Element("a", attributes, ...children);
export const B = (attributes: any, ...children: any[]) => new Element("b", attributes, ...children);
export const Br = (attributes: any, ...children: any[]) => new Element("br", attributes, ...children);
export const Div = (attributes: any, ...children: any[]) => new Element("div", attributes, ...children);
export const Hr = (attributes: any, ...children: any[]) => new Element("hr", attributes, ...children);
export const I = (attributes: any, ...children: any[]) => new Element("i", attributes, ...children);
export const P = (attributes: any, ...children: any[]) => new Element("p", attributes, ...children);
export const Span = (attributes: any, ...children: any[]) => new Element("span", attributes, ...children);
export const U = (attributes: any, ...children: any[]) => new Element("u", attributes, ...children);

// Headings
export const H1 = (attributes: any, ...children: any[]) => new Element("h1", attributes, ...children);
export const H2 = (attributes: any, ...children: any[]) => new Element("h2", attributes, ...children);
export const H3 = (attributes: any, ...children: any[]) => new Element("h3", attributes, ...children);
export const H4 = (attributes: any, ...children: any[]) => new Element("h4", attributes, ...children);
export const H5 = (attributes: any, ...children: any[]) => new Element("h5", attributes, ...children);
export const H6 = (attributes: any, ...children: any[]) => new Element("h6", attributes, ...children);

// Form elements
export const Button = (attributes: any, ...children: any[]) => new Element("button", attributes, ...children);
export const Datalist = (attributes: any, ...children: any[]) => new Element("datalist", attributes, ...children);
export const Fieldset = (attributes: any, ...children: any[]) => new Element("fieldset", attributes, ...children);
export const Form = (attributes: any, ...children: any[]) => new Element("form", attributes, ...children);
export const Input = (attributes: any, ...children: any[]) => new Element("input", attributes, ...children);
export const Label = (attributes: any, ...children: any[]) => new Element("label", attributes, ...children);
export const Legend = (attributes: any, ...children: any[]) => new Element("legend", attributes, ...children);
export const Meter = (attributes: any, ...children: any[]) => new Element("meter", attributes, ...children);
export const Optgroup = (attributes: any, ...children: any[]) => new Element("optgroup", attributes, ...children);
export const Option = (attributes: any, ...children: any[]) => new Element("option", attributes, ...children);
export const Output = (attributes: any, ...children: any[]) => new Element("output", attributes, ...children);
export const Progress = (attributes: any, ...children: any[]) => new Element("progress", attributes, ...children);
export const Select = (attributes: any, ...children: any[]) => new Element("select", attributes, ...children);
export const Textarea = (attributes: any, ...children: any[]) => new Element("textarea", attributes, ...children);

// Lists
export const Dl = (attributes: any, ...children: any[]) => new Element("dl", attributes, ...children);
export const Dt = (attributes: any, ...children: any[]) => new Element("dt", attributes, ...children);
export const Dd = (attributes: any, ...children: any[]) => new Element("dd", attributes, ...children);
export const Li = (attributes: any, ...children: any[]) => new Element("li", attributes, ...children);
export const Ol = (attributes: any, ...children: any[]) => new Element("ol", attributes, ...children);
export const Ul = (attributes: any, ...children: any[]) => new Element("ul", attributes, ...children);

// Tables
export const Caption = (attributes: any, ...children: any[]) => new Element("caption", attributes, ...children);
export const Col = (attributes: any, ...children: any[]) => new Element("col", attributes, ...children);
export const Colgroup = (attributes: any, ...children: any[]) => new Element("colgroup", attributes, ...children);
export const Table = (attributes: any, ...children: any[]) => new Element("table", attributes, ...children);
export const Tbody = (attributes: any, ...children: any[]) => new Element("tbody", attributes, ...children);
export const Td = (attributes: any, ...children: any[]) => new Element("td", attributes, ...children);
export const Tfoot = (attributes: any, ...children: any[]) => new Element("tfoot", attributes, ...children);
export const Th = (attributes: any, ...children: any[]) => new Element("th", attributes, ...children);
export const Thead = (attributes: any, ...children: any[]) => new Element("thead", attributes, ...children);
export const Tr = (attributes: any, ...children: any[]) => new Element("tr", attributes, ...children);

// Semantic elements
export const Article = (attributes: any, ...children: any[]) => new Element("article", attributes, ...children);
export const Aside = (attributes: any, ...children: any[]) => new Element("aside", attributes, ...children);
export const Dialog = (attributes: any, ...children: any[]) => new Element("dialog", attributes, ...children);
export const Details = (attributes: any, ...children: any[]) => new Element("details", attributes, ...children);
export const Figcaption = (attributes: any, ...children: any[]) => new Element("figcaption", attributes, ...children);
export const Figure = (attributes: any, ...children: any[]) => new Element("figure", attributes, ...children);
export const Footer = (attributes: any, ...children: any[]) => new Element("footer", attributes, ...children);
export const Header = (attributes: any, ...children: any[]) => new Element("header", attributes, ...children);
export const Main = (attributes: any, ...children: any[]) => new Element("main", attributes, ...children);
export const Mark = (attributes: any, ...children: any[]) => new Element("mark", attributes, ...children);
export const Nav = (attributes: any, ...children: any[]) => new Element("nav", attributes, ...children);
export const Section = (attributes: any, ...children: any[]) => new Element("section", attributes, ...children);
export const Summary = (attributes: any, ...children: any[]) => new Element("summary", attributes, ...children);

// Media elements
export const Audio = (attributes: any, ...children: any[]) => new Element("audio", attributes, ...children);
export const Canvas = (attributes: any, ...children: any[]) => new Element("canvas", attributes, ...children);
export const Embed = (attributes: any, ...children: any[]) => new Element("embed", attributes, ...children);
export const Iframe = (attributes: any, ...children: any[]) => new Element("iframe", attributes, ...children);
export const Img = (attributes: any, ...children: any[]) => new Element("img", attributes, ...children);
export const Map = (attributes: any, ...children: any[]) => new Element("map", attributes, ...children);
export const ObjectE = (attributes: any, ...children: any[]) => new Element("object", attributes, ...children);
export const Picture = (attributes: any, ...children: any[]) => new Element("picture", attributes, ...children);
export const Source = (attributes: any, ...children: any[]) => new Element("source", attributes, ...children);
export const Track = (attributes: any, ...children: any[]) => new Element("track", attributes, ...children);
export const Video = (attributes: any, ...children: any[]) => new Element("video", attributes, ...children);

// Text elements
export const Bdi = (attributes: any, ...children: any[]) => new Element("bdi", attributes, ...children);
export const Bdo = (attributes: any, ...children: any[]) => new Element("bdo", attributes, ...children);
export const Blockquote = (attributes: any, ...children: any[]) => new Element("blockquote", attributes, ...children);
export const Cite = (attributes: any, ...children: any[]) => new Element("cite", attributes, ...children);
export const Code = (attributes: any, ...children: any[]) => new Element("code", attributes, ...children);
export const Data = (attributes: any, ...children: any[]) => new Element("data", attributes, ...children);
export const Del = (attributes: any, ...children: any[]) => new Element("del", attributes, ...children);
export const Dfn = (attributes: any, ...children: any[]) => new Element("dfn", attributes, ...children);
export const Em = (attributes: any, ...children: any[]) => new Element("em", attributes, ...children);
export const Ins = (attributes: any, ...children: any[]) => new Element("ins", attributes, ...children);
export const Kbd = (attributes: any, ...children: any[]) => new Element("kbd", attributes, ...children);
export const Pre = (attributes: any, ...children: any[]) => new Element("pre", attributes, ...children);
export const Q = (attributes: any, ...children: any[]) => new Element("q", attributes, ...children);
export const Rp = (attributes: any, ...children: any[]) => new Element("rp", attributes, ...children);
export const Rt = (attributes: any, ...children: any[]) => new Element("rt", attributes, ...children);
export const Ruby = (attributes: any, ...children: any[]) => new Element("ruby", attributes, ...children);
export const S = (attributes: any, ...children: any[]) => new Element("s", attributes, ...children);
export const Samp = (attributes: any, ...children: any[]) => new Element("samp", attributes, ...children);
export const Small = (attributes: any, ...children: any[]) => new Element("small", attributes, ...children);
export const Strong = (attributes: any, ...children: any[]) => new Element("strong", attributes, ...children);
export const Sub = (attributes: any, ...children: any[]) => new Element("sub", attributes, ...children);
export const Sup = (attributes: any, ...children: any[]) => new Element("sup", attributes, ...children);
export const Time = (attributes: any, ...children: any[]) => new Element("time", attributes, ...children);
export const Var = (attributes: any, ...children: any[]) => new Element("var", attributes, ...children);
export const Wbr = (attributes: any, ...children: any[]) => new Element("wbr", attributes, ...children);

// Other elements
export const Base = (attributes: any, ...children: any[]) => new Element("base", attributes, ...children);
export const Meta = (attributes: any, ...children: any[]) => new Element("meta", attributes, ...children);
export const Noscript = (attributes: any, ...children: any[]) => new Element("noscript", attributes, ...children);
export const Script = (attributes: any, ...children: any[]) => new Element("script", attributes, ...children);
export const Style = (attributes: any, ...children: any[]) => new Element("style", attributes, ...children);
export const Template = (attributes: any, ...children: any[]) => new Element("template", attributes, ...children);
export const Title = (attributes: any, ...children: any[]) => new Element("title", attributes, ...children); 