import { Div, Button } from "../html";

describe('Event handler prop updates via patch', () => {
  let domContainer: HTMLElement;

  beforeEach(() => {
    domContainer = document.createElement('div');
    document.body.appendChild(domContainer);
  });

  afterEach(() => {
    document.body.removeChild(domContainer);
  });

  it('should remove event handler prop when set to null', async () => {
    const handler = jest.fn();

    const button1 = Button({ onClick: handler }, 'Click');
    const element = Div({}, button1);
    
    const button2 = Button({}, 'Click');
    const newElement = Div({}, button2);

    await element.render();
    domContainer.appendChild(element.html);

    let btn = domContainer.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(handler).toHaveBeenCalledTimes(1);

    await newElement.render();
    await element.patch(newElement);

    btn = domContainer.querySelector('button') as HTMLButtonElement;
    btn.click();
    // Handler count should stay at 1 since we removed the onClick prop
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
