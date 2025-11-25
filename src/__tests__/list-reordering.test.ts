import { Div, Li, Ul, Button } from "../html";

describe('List reordering and edge cases', () => {
  let domContainer: HTMLElement;

  beforeEach(() => {
    domContainer = document.createElement('div');
    document.body.appendChild(domContainer);
  });

  afterEach(() => {
    document.body.removeChild(domContainer);
  });

  it('should patch list items correctly with array normalization', async () => {
    // Create nested array structure (tests flattening)
    const items1 = [[Li({}, 'Item 1'), Li({}, 'Item 2')]];
    const list1 = Ul({}, ...items1);

    const items2 = [[Li({}, 'Item 1'), Li({}, 'Item 2'), Li({}, 'Item 3')]];
    const list2 = Ul({}, ...items2);

    await list1.render();
    domContainer.appendChild(list1.html);

    expect(domContainer.querySelectorAll('li').length).toBe(2);

    await list2.render();
    await list1.patch(list2);

    expect(domContainer.querySelectorAll('li').length).toBe(3);
    expect(domContainer.innerHTML).toContain('Item 3');
  });

  it('should correctly handle deeply nested button clicks with list rendering', async () => {
    const handler = jest.fn();

    const items = [
      Button({ onClick: handler }, 'A'),
      Button({ onClick: handler }, 'B')
    ];
    const element = Div({}, items);

    await element.render();
    domContainer.appendChild(element.html);

    const buttons = domContainer.querySelectorAll('button');
    expect(buttons.length).toBe(2);

    buttons[0].click();
    expect(handler).toHaveBeenCalledTimes(1);

    buttons[1].click();
    expect(handler).toHaveBeenCalledTimes(2);
  });
});
