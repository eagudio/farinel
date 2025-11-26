/**
 * Reactive .otherwise() test
 * Tests that the template handler is re-executed when state changes via dispatch()
 */

import { farinel } from '../main';
import { Div, P, Button } from '../html';

describe('Reactive .otherwise() rendering', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should re-execute otherwise() template when state changes via dispatch', async () => {
    const domContainer = document.getElementById('root')!;
    const component = domContainer as any;

    component.spy = () => {
      return new Promise(resolve => {
        setTimeout(() => resolve(true), 0);
      });
    };

    let renderCount = 0;

    const app = farinel().stating(() => ({
      count: 0,
      showModal: false
    }));

    const App = () => {
      return app.otherwise(() => {
        renderCount++;
        console.log(`[Test] Template executed ${renderCount} times, state:`, app.state);
        
        return Div({},
          P({}, `Count: ${app.state.count}`),
          P({}, `Modal: ${app.state.showModal ? 'visible' : 'hidden'}`),
          Button({}, 'Increment').on('click', async () => {
            await app.dispatch({ ...app.state, count: app.state.count + 1 });
          }),
          Button({}, 'Toggle Modal').on('click', async () => {
            await app.dispatch({ ...app.state, showModal: !app.state.showModal });
          }),
          app.state.showModal ? Div({ class: 'modal' }, P({}, 'Modal Content')) : null
        );
      });
    };

    await app.createRoot(domContainer, App());

    // Initial render
    expect(renderCount).toBe(1);
    expect(domContainer.textContent).toContain('Count: 0');
    expect(domContainer.textContent).toContain('Modal: hidden');
    expect(domContainer.querySelector('.modal')).toBeFalsy();

    // Click increment button
    const incrementBtn = Array.from(domContainer.querySelectorAll('button'))
      .find(btn => btn.textContent === 'Increment') as HTMLButtonElement;
    
    let stateUpdate = component.spy();
    incrementBtn.click();
    await stateUpdate;

    // Template should have been re-executed
    expect(renderCount).toBe(2);
    expect(domContainer.textContent).toContain('Count: 1');

    // Click toggle modal button
    const toggleBtn = Array.from(domContainer.querySelectorAll('button'))
      .find(btn => btn.textContent === 'Toggle Modal') as HTMLButtonElement;
    
    stateUpdate = component.spy();
    toggleBtn.click();
    await stateUpdate;

    // Template should have been re-executed again
    expect(renderCount).toBe(3);
    expect(domContainer.textContent).toContain('Modal: visible');
    expect(domContainer.querySelector('.modal')).toBeTruthy();
    expect(domContainer.querySelector('.modal')?.textContent).toContain('Modal Content');
  });

  it('should handle conditional rendering changes via dispatch', async () => {
    const domContainer = document.getElementById('root')!;
    const component = domContainer as any;

    component.spy = () => {
      return new Promise(resolve => {
        setTimeout(() => resolve(true), 0);
      });
    };

    const app = farinel().stating(() => ({
      step: 1
    }));

    const App = () => {
      return app.otherwise(() => {
        return Div({},
          P({}, `Current step: ${app.state.step}`),
          app.state.step === 1 ? Div({ key: 'step-1' },
            P({}, 'Step 1 Content'),
            Button({}, 'Next').on('click', async () => {
              await app.dispatch({ ...app.state, step: 2 });
            })
          ) : null,
          app.state.step === 2 ? Div({ key: 'step-2' },
            P({}, 'Step 2 Content'),
            Button({}, 'Back').on('click', async () => {
              await app.dispatch({ ...app.state, step: 1 });
            })
          ) : null
        );
      });
    };

    await app.createRoot(domContainer, App());

    // Initial state - Step 1 should be visible
    expect(domContainer.textContent).toContain('Current step: 1');
    expect(domContainer.textContent).toContain('Step 1 Content');
    expect(domContainer.textContent).not.toContain('Step 2 Content');

    // Go to Step 2
    const nextBtn = domContainer.querySelector('button')!;
    let stateUpdate = component.spy();
    nextBtn.click();
    await stateUpdate;

    // Step 2 should now be visible, Step 1 should be gone
    expect(domContainer.textContent).toContain('Current step: 2');
    expect(domContainer.textContent).toContain('Step 2 Content');
    expect(domContainer.textContent).not.toContain('Step 1 Content');

    // Go back to Step 1
    const backBtn = domContainer.querySelector('button')!;
    stateUpdate = component.spy();
    backBtn.click();
    await stateUpdate;

    // Step 1 should be back, Step 2 should be gone
    expect(domContainer.textContent).toContain('Current step: 1');
    expect(domContainer.textContent).toContain('Step 1 Content');
    expect(domContainer.textContent).not.toContain('Step 2 Content');
  });
});

