import { Div, Form, P } from "../html"

describe('Virtual Dom', () => {
  let domContainer: HTMLElement;

  beforeEach(() => {
    domContainer = document.createElement('div');
    document.body.appendChild(domContainer);
  });

  afterEach(() => {
    document.body.removeChild(domContainer);
  });

  it('should patch node text', async () => {
    const element = Div({}, 'Hello World');
    const newElement = Div({}, 'Bye...');

    await element.render();
    await newElement.render();

    await element.patch(newElement);
    
    expect(element.html.outerHTML).toEqual('<div>Bye...</div>');
  })

  it('should patch element', async () => {
    const element = Div({}, 'Hello World');
    const newElement = P({}, 'Bye...');

    await element.render();

    domContainer.appendChild(element.html);

    await newElement.render();

    await element.patch(newElement);
    
    expect(element.html.outerHTML).toEqual('<p>Bye...</p>');
  })

  it('should patch children', async () => {
    const element = Div({}, 
      P({}, 'Hello'),
      P({}, 'Tom')
    );
    const newElement = Div({}, 
      P({}, 'Hello'),
      P({}, 'Alice')
    );

    await element.render();

    domContainer.appendChild(element.html);

    await newElement.render();

    await element.patch(newElement);
    
    expect(element.html.outerHTML).toEqual('<div><p>Hello</p><p>Alice</p></div>');
  })

  it('should patch children and add one child', async () => {
    const element = Div({}, 
      P({}, 'Hello'),
      P({}, 'Tom')
    );
    const newElement = Div({}, 
      P({}, 'Hello'),
      P({}, 'Alice'),
      P({}, 'and Bob')
    );

    await element.render();

    domContainer.appendChild(element.html);

    await newElement.render();

    await element.patch(newElement);
    
    expect(element.html.outerHTML).toEqual('<div><p>Hello</p><p>Alice</p><p>and Bob</p></div>');
  })

  it('should patch children and add one child', async () => {
    const element = Div({}, 
      P({}, 'Hello'),
      P({}, 'Tom'),
      P({}, 'and Bob')
    );
    const newElement = Div({}, 
      P({}, 'Hello'),
      P({}, 'Alice'),
    );

    await element.render();

    domContainer.appendChild(element.html);

    await newElement.render();

    await element.patch(newElement);
    
    expect(element.html.outerHTML).toEqual('<div><p>Hello</p><p>Alice</p></div>');
  })

  it('should patch children and add one child', async () => {
    const subelement = Div({},
      P({}, 'Tom'),
      P({}, 'and Bob')
    );
    const element = Div({}, 
      P({}, 'Hello'),
      subelement
    );

    const newSubelement = Form({},
      P({}, 'Alice'),
    );
    const newElement = Div({}, 
      P({}, 'Bye'),
      newSubelement
    );

    await element.render();

    domContainer.appendChild(element.html);

    await newElement.render();

    await element.patch(newElement);
    
    expect(element.html.outerHTML).toEqual('<div><p>Bye</p><form><p>Alice</p></form></div>');
  })

  it('should patch children and add array of element', async () => {
    const element = Div({}, 
      P({}, 'Hello'),
    );

    const newSubelement = [
      P({}, 'Tom'),
      P({}, 'and Bob')
    ];
    const newElement = Div({}, 
      P({}, 'Bye'),
      newSubelement
    );

    await element.render();

    expect(element.html.outerHTML).toEqual('<div><p>Hello</p></div>');

    domContainer.appendChild(element.html);

    await newElement.render();

    await element.patch(newElement);
    
    expect(element.html.outerHTML).toEqual('<div><p>Bye</p><p>Tom</p><p>and Bob</p></div>');
  })

  it('should patch children and add boolean element', async () => {
    const element = Div({}, 
      true && P({}, 'Hello'),
    );

    const newSubelement = [
      P({}, 'Tom'),
      P({}, 'and Bob')
    ];
    const newElement = Div({}, 
      P({}, 'Bye'),
      false && newSubelement
    );

    await element.render();

    expect(element.html.outerHTML).toEqual('<div><p>Hello</p></div>');

    domContainer.appendChild(element.html);

    await newElement.render();

    await element.patch(newElement);
    
    expect(element.html.outerHTML).toEqual('<div><p>Bye</p></div>');
  })
})
