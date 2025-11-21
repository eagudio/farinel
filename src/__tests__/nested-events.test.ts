import { Div, P, Button } from "../html";

describe('Nested arrays and events', () => {
  let domContainer: HTMLElement;

  beforeEach(() => {
    domContainer = document.createElement('div');
    document.body.appendChild(domContainer);
  });

  afterEach(() => {
    document.body.removeChild(domContainer);
  });

  it('should handle deeply nested arrays of children and patch correctly', async () => {
    const element = Div({}, [[P({}, 'A'), [P({}, 'B')]]]);
    const newElement = Div({}, P({}, 'X'), P({}, 'Y'));

    await element.render();
    domContainer.appendChild(element.html);

    await newElement.render();

    element.patch(newElement);

    expect(element.html.outerHTML).toEqual('<div><p>X</p><p>Y</p></div>');
  });

  it('should attach event handlers on elements inside nested arrays', async () => {
    const handler = jest.fn();

    const nested = [
      [
        Button({}, 'Inner').on('click', handler)
      ]
    ];

    const element = Div({}, nested);

    await element.render();
    domContainer.appendChild(element.html);

    const button = domContainer.querySelector('button') as HTMLButtonElement;
    expect(button).toBeTruthy();

    button.click();

    expect(handler).toHaveBeenCalled();
  });
});
