import { farinel } from '../main';
import { Div, Input, P } from '../html';

describe('Input Focus Preservation', () => {
  let domContainer: HTMLElement;

  beforeEach(() => {
    domContainer = document.createElement('div');
    document.body.appendChild(domContainer);
  });

  afterEach(() => {
    document.body.removeChild(domContainer);
  });

  it('should preserve focus when input value changes via dispatch', async () => {
    const component = farinel()
      .stating(() => ({
        text: '',
      }))
      .otherwise(() =>
        Div({},
          Input({
            type: "text",
            value: component.state.text,
          })
            .on("input", async (e: any) => {
              await component.dispatch({
                text: e.target.value,
              });
            }),
          P({}, `Text: ${component.state.text}`)
        )
      );

    await farinel().createRoot(domContainer, component);

    const input = domContainer.querySelector('input') as HTMLInputElement;

    // Focus the input
    input.focus();
    expect(document.activeElement).toBe(input);

    // Simulate typing
    const stateUpdate = component.spy();
    input.value = 'H';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await stateUpdate;

    // Input should still have focus
    expect(document.activeElement).toBe(domContainer.querySelector('input'));
    expect(domContainer.querySelector('input')?.value).toBe('H');
  });

  it('should preserve cursor position when input value changes', async () => {
    const component = farinel()
      .stating(() => ({
        text: 'Hello',
      }))
      .otherwise(() =>
        Div({},
          Input({
            type: "text",
            value: component.state.text,
          })
            .on("input", async (e: any) => {
              await component.dispatch({
                text: e.target.value,
              });
            })
        )
      );

    await farinel().createRoot(domContainer, component);

    const input = domContainer.querySelector('input') as HTMLInputElement;

    // Focus and set cursor in the middle
    input.focus();
    input.setSelectionRange(2, 2); // After "He"

    // Simulate inserting a character at cursor position
    const cursorPos = input.selectionStart!;
    const newValue = input.value.slice(0, cursorPos) + 'X' + input.value.slice(cursorPos);

    const stateUpdate = component.spy();
    input.value = newValue;
    input.setSelectionRange(cursorPos + 1, cursorPos + 1); // Set cursor after the new character
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await stateUpdate;

    // Cursor should be preserved
    const updatedInput = domContainer.querySelector('input') as HTMLInputElement;
    expect(updatedInput.value).toBe('HeXllo');
    expect(updatedInput.selectionStart).toBe(3); // After "HeX"
    expect(updatedInput.selectionEnd).toBe(3);
  });

  it('should handle rapid typing without losing focus', async () => {
    const component = farinel()
      .stating(() => ({
        text: '',
      }))
      .otherwise(() =>
        Div({},
          Input({
            type: "text",
            value: component.state.text,
          })
            .on("input", async (e: any) => {
              await component.dispatch({
                text: e.target.value,
              });
            })
        )
      );

    await farinel().createRoot(domContainer, component);

    const input = domContainer.querySelector('input') as HTMLInputElement;
    input.focus();

    // Simulate rapid typing
    const characters = ['H', 'He', 'Hel', 'Hell', 'Hello'];
    for (const text of characters) {
      const stateUpdate = component.spy();
      input.value = text;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await stateUpdate;

      // Should maintain focus after each character
      expect(document.activeElement).toBe(domContainer.querySelector('input'));
    }

    expect(domContainer.querySelector('input')?.value).toBe('Hello');
  });

  it('should not interfere with inputs that do not have focus', async () => {
    const component = farinel()
      .stating(() => ({
        input1: '',
        input2: '',
      }))
      .otherwise(() =>
        Div({},
          Input({
            type: "text",
            value: component.state.input1,
            class: "input1"
          })
            .on("input", async (e: any) => {
              await component.dispatch({
                ...component.state,
                input1: e.target.value,
              });
            }),
          Input({
            type: "text",
            value: component.state.input2,
            class: "input2"
          })
            .on("input", async (e: any) => {
              await component.dispatch({
                ...component.state,
                input2: e.target.value,
              });
            })
        )
      );

    await farinel().createRoot(domContainer, component);

    const input1 = domContainer.querySelector('.input1') as HTMLInputElement;
    const input2 = domContainer.querySelector('.input2') as HTMLInputElement;

    // Focus input1 and type
    input1.focus();
    let stateUpdate = component.spy();
    input1.value = 'First';
    input1.dispatchEvent(new Event('input', { bubbles: true }));
    await stateUpdate;

    expect(document.activeElement).toBe(domContainer.querySelector('.input1'));

    // Now focus input2 and type
    input2.focus();
    stateUpdate = component.spy();
    input2.value = 'Second';
    input2.dispatchEvent(new Event('input', { bubbles: true }));
    await stateUpdate;

    // Input2 should have focus now
    expect(document.activeElement).toBe(domContainer.querySelector('.input2'));
    expect((domContainer.querySelector('.input1') as HTMLInputElement)?.value).toBe('First');
    expect((domContainer.querySelector('.input2') as HTMLInputElement)?.value).toBe('Second');
  });

  it('should preserve selection range when updating value', async () => {
    const component = farinel()
      .stating(() => ({
        text: 'Hello World',
      }))
      .otherwise(() =>
        Div({},
          Input({
            type: "text",
            value: component.state.text,
          })
            .on("input", async (e: any) => {
              await component.dispatch({
                text: e.target.value,
              });
            })
        )
      );

    await farinel().createRoot(domContainer, component);

    const input = domContainer.querySelector('input') as HTMLInputElement;

    // Focus and select "World"
    input.focus();
    input.setSelectionRange(6, 11); // Select "World"

    // Simulate replacing selection
    const stateUpdate = component.spy();
    input.value = 'Hello Earth';
    input.setSelectionRange(6, 11); // Keep same selection range
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await stateUpdate;

    const updatedInput = domContainer.querySelector('input') as HTMLInputElement;
    expect(updatedInput.value).toBe('Hello Earth');
    expect(updatedInput.selectionStart).toBe(6);
    expect(updatedInput.selectionEnd).toBe(11);
  });
});

