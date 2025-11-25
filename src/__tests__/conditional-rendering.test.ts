import { farinel } from '../main';
import { Div, Button, P, Input, H2 } from '../html';

describe('Conditional Rendering', () => {
  let domContainer: HTMLElement;

  beforeEach(() => {
    domContainer = document.createElement('div');
    document.body.appendChild(domContainer);
  });

  afterEach(() => {
    document.body.removeChild(domContainer);
  });

  it('should handle modal appearing and disappearing', async () => {
    const component = farinel()
      .stating(() => ({
        showModal: false,
      }))
      .otherwise(() =>
        Div({},
          Button({}, "Open Modal")
            .on("click", async () => {
              await component.dispatch({
                showModal: true,
              });
            }),
          
          // Conditional modal - use ternary to avoid boolean false in children
          component.state.showModal ? Div({ class: "modal" },
            H2({}, "Modal Title"),
            P({}, "Modal content"),
            Button({}, "Close")
              .on("click", async () => {
                await component.dispatch({
                  showModal: false,
                });
              })
          ) : null
        )
      );

    await farinel().createRoot(domContainer, component);

    // Initially modal should not be visible
    expect(domContainer.querySelector('.modal')).toBeNull();
    expect(domContainer.innerHTML).toContain('Open Modal');

    // Click to open modal
    const openButton = domContainer.querySelector('button') as HTMLButtonElement;
    const openStateUpdate = component.spy();
    openButton.click();
    await openStateUpdate;

    // Modal should now be visible
    expect(domContainer.querySelector('.modal')).toBeTruthy();
    expect(domContainer.innerHTML).toContain('Modal Title');
    expect(domContainer.innerHTML).toContain('Modal content');

    // Click to close modal
    const closeButton = Array.from(domContainer.querySelectorAll('button'))
      .find(btn => btn.textContent === 'Close') as HTMLButtonElement;
    const closeStateUpdate = component.spy();
    closeButton.click();
    await closeStateUpdate;

    // Modal should be gone
    expect(domContainer.querySelector('.modal')).toBeNull();
    expect(domContainer.innerHTML).toContain('Open Modal');
  });

  it('should handle multiple conditional elements', async () => {
    const component = farinel()
      .stating(() => ({
        showA: false,
        showB: false,
      }))
      .otherwise(() =>
        Div({},
          Button({ class: "toggle-a" }, "Toggle A")
            .on("click", async () => {
              await component.dispatch({
                ...component.state,
                showA: !component.state.showA,
              });
            }),
          Button({ class: "toggle-b" }, "Toggle B")
            .on("click", async () => {
              await component.dispatch({
                ...component.state,
                showB: !component.state.showB,
              });
            }),
          
          component.state.showA ? Div({ class: "element-a" }, "Element A") : null,
          component.state.showB ? Div({ class: "element-b" }, "Element B") : null
        )
      );

    await farinel().createRoot(domContainer, component);

    // Initially both hidden
    expect(domContainer.querySelector('.element-a')).toBeNull();
    expect(domContainer.querySelector('.element-b')).toBeNull();

    // Show A
    const toggleAButton = domContainer.querySelector('.toggle-a') as HTMLButtonElement;
    let stateUpdate = component.spy();
    toggleAButton.click();
    await stateUpdate;

    expect(domContainer.querySelector('.element-a')).toBeTruthy();
    expect(domContainer.querySelector('.element-b')).toBeNull();

    // Show B
    const toggleBButton = domContainer.querySelector('.toggle-b') as HTMLButtonElement;
    stateUpdate = component.spy();
    toggleBButton.click();
    await stateUpdate;

    expect(domContainer.querySelector('.element-a')).toBeTruthy();
    expect(domContainer.querySelector('.element-b')).toBeTruthy();

    // Hide A
    stateUpdate = component.spy();
    domContainer.querySelector('.toggle-a')!.dispatchEvent(new Event('click', { bubbles: true }));
    await stateUpdate;

    expect(domContainer.querySelector('.element-a')).toBeNull();
    expect(domContainer.querySelector('.element-b')).toBeTruthy();
  });

  it('should handle form with conditional error message', async () => {
    const component = farinel()
      .stating(() => ({
        email: '',
        error: '',
      }))
      .otherwise(() =>
        Div({},
          Input({
            type: "email",
            value: component.state.email,
            placeholder: "Enter email"
          })
            .on("input", async (e: any) => {
              await component.dispatch({
                ...component.state,
                email: e.target.value,
                error: '',
              });
            }),
          
          Button({}, "Submit")
            .on("click", async () => {
              if (!component.state.email.includes('@')) {
                await component.dispatch({
                  ...component.state,
                  error: 'Invalid email',
                });
              }
            }),
          
          component.state.error ? Div({ class: "error" }, component.state.error) : null
        )
      );

    await farinel().createRoot(domContainer, component);

    // Initially no error
    expect(domContainer.querySelector('.error')).toBeNull();

    // Click submit without valid email
    const submitButton = domContainer.querySelector('button') as HTMLButtonElement;
    let stateUpdate = component.spy();
    submitButton.click();
    await stateUpdate;

    // Error should appear
    expect(domContainer.querySelector('.error')).toBeTruthy();
    expect(domContainer.innerHTML).toContain('Invalid email');

    // Type valid email
    const input = domContainer.querySelector('input') as HTMLInputElement;
    stateUpdate = component.spy();
    input.value = 'test@example.com';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await stateUpdate;

    // Error should disappear
    expect(domContainer.querySelector('.error')).toBeNull();
  });

  it.skip('should handle nested conditional rendering', async () => {
    const component = farinel()
      .stating(() => ({
        step: 1,
      }))
      .otherwise(() =>
        Div({},
          component.state.step === 1 ? Div({},
            P({}, "Step 1"),
            Button({}, "Next")
              .on("click", async () => {
                await component.dispatch({ step: 2 });
              })
          ) : null,
          
          component.state.step === 2 ? Div({},
            P({}, "Step 2"),
            Button({}, "Back")
              .on("click", async () => {
                await component.dispatch({ step: 1 });
              }),
            Button({}, "Next")
              .on("click", async () => {
                await component.dispatch({ step: 3 });
              })
          ) : null,
          
          component.state.step === 3 ? Div({},
            P({}, "Step 3 - Done!"),
            Button({}, "Reset")
              .on("click", async () => {
                await component.dispatch({ step: 1 });
              })
          ) : null
        )
      );

    await farinel().createRoot(domContainer, component);

    // Step 1
    expect(domContainer.innerHTML).toContain('Step 1');
    expect(domContainer.innerHTML).not.toContain('Step 2');

    // Go to Step 2
    let nextButton = Array.from(domContainer.querySelectorAll('button'))
      .find(btn => btn.textContent === 'Next') as HTMLButtonElement;
    let stateUpdate = component.spy();
    nextButton.click();
    await stateUpdate;

    expect(domContainer.innerHTML).toContain('Step 2');
    expect(domContainer.innerHTML).not.toContain('Step 1');

    // Go to Step 3
    nextButton = Array.from(domContainer.querySelectorAll('button'))
      .find(btn => btn.textContent === 'Next') as HTMLButtonElement;
    stateUpdate = component.spy();
    nextButton.click();
    await stateUpdate;

    expect(domContainer.innerHTML).toContain('Step 3');
    expect(domContainer.innerHTML).not.toContain('Step 2');

    // Reset to Step 1
    const resetButton = Array.from(domContainer.querySelectorAll('button'))
      .find(btn => btn.textContent === 'Reset') as HTMLButtonElement;
    
    expect(resetButton).toBeTruthy();
    
    stateUpdate = component.spy();
    resetButton.click();
    await stateUpdate;

    expect(domContainer.innerHTML).toContain('Step 1');
    expect(domContainer.innerHTML).not.toContain('Step 3');
  });
});

