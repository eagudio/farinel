/**
 * Multi-step form test - simulating MentorAI onboarding scenario
 * Tests conditional rendering with key-based elements that toggle between steps
 */

import { farinel } from '../main';
import { Div, Input, Button, P, Select, Option, Label } from '../html';

describe('Multi-step form with conditional rendering', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should correctly toggle between two conditional steps using keys', async () => {
    const domContainer = document.getElementById('root')!;
    const component = domContainer as any;

    component.spy = () => {
      return new Promise(resolve => {
        setTimeout(() => resolve(true), 0);
      });
    };

    const app = farinel().stating(() => ({
      step: 1,
      name: '',
      age: '',
      email: '',
      preferences: ''
    }));

    const MultiStepForm = () => {
      return app.otherwise(() => {
        return Div({},
          P({}, `Current step: ${app.state.step}`),
          
          // Step 1 - con key per identificazione
          app.state.step === 1 ? Div({ key: 'step-1', class: 'step-container' },
            P({}, 'Step 1: Basic Info'),
            Label({}, 'Name:'),
            Input({ 
              value: app.state.name, 
              placeholder: 'Enter name',
              class: 'name-input'
            }).on('input', async (e: any) => {
              await app.dispatch({ ...app.state, name: e.target.value });
            }),
            Label({}, 'Age:'),
            Input({ 
              value: app.state.age, 
              placeholder: 'Enter age',
              class: 'age-input'
            }).on('input', async (e: any) => {
              await app.dispatch({ ...app.state, age: e.target.value });
            }),
            Button({ class: 'next-btn' }, 'Next').on('click', async () => {
              await app.dispatch({ ...app.state, step: 2 });
            })
          ) : null,

          // Step 2 - con key per identificazione
          app.state.step === 2 ? Div({ key: 'step-2', class: 'step-container' },
            P({}, 'Step 2: Additional Info'),
            Label({}, 'Email:'),
            Input({ 
              value: app.state.email, 
              placeholder: 'Enter email',
              class: 'email-input'
            }).on('input', async (e: any) => {
              await app.dispatch({ ...app.state, email: e.target.value });
            }),
            Label({}, 'Preferences:'),
            Select({ 
              value: app.state.preferences,
              class: 'preferences-select'
            },
              Option({ value: '' }, 'Select...'),
              Option({ value: 'opt1' }, 'Option 1'),
              Option({ value: 'opt2' }, 'Option 2')
            ).on('change', async (e: any) => {
              await app.dispatch({ ...app.state, preferences: e.target.value });
            }),
            Button({ class: 'back-btn' }, 'Back').on('click', async () => {
              await app.dispatch({ ...app.state, step: 1 });
            }),
            Button({ class: 'submit-btn' }, 'Submit')
          ) : null
        );
      });
    };

    await app.createRoot(domContainer, MultiStepForm());

    // Verificare stato iniziale - Step 1 visibile
    expect(domContainer.textContent).toContain('Current step: 1');
    expect(domContainer.textContent).toContain('Step 1: Basic Info');
    expect(domContainer.textContent).not.toContain('Step 2: Additional Info');
    expect(domContainer.querySelector('.name-input')).toBeTruthy();
    expect(domContainer.querySelector('.next-btn')).toBeTruthy();
    expect(domContainer.querySelector('.back-btn')).toBeFalsy();

    // Contare i bottoni - dovrebbe esserci solo "Next"
    const initialButtons = domContainer.querySelectorAll('button');
    expect(initialButtons.length).toBe(1);
    expect(initialButtons[0].textContent).toBe('Next');

    // Andare avanti allo step 2
    const nextBtn = domContainer.querySelector('.next-btn') as HTMLButtonElement;
    let stateUpdate = component.spy();
    nextBtn.click();
    await stateUpdate;

    // Verificare che siamo allo step 2
    expect(domContainer.textContent).toContain('Current step: 2');
    expect(domContainer.textContent).toContain('Step 2: Additional Info');
    expect(domContainer.textContent).not.toContain('Step 1: Basic Info');
    expect(domContainer.querySelector('.email-input')).toBeTruthy();
    expect(domContainer.querySelector('.back-btn')).toBeTruthy();
    expect(domContainer.querySelector('.submit-btn')).toBeTruthy();
    expect(domContainer.querySelector('.next-btn')).toBeFalsy();

    // Contare i bottoni - dovrebbero essere "Back" e "Submit"
    const step2Buttons = domContainer.querySelectorAll('button');
    expect(step2Buttons.length).toBe(2);
    const buttonTexts = Array.from(step2Buttons).map(btn => btn.textContent);
    expect(buttonTexts).toContain('Back');
    expect(buttonTexts).toContain('Submit');
    expect(buttonTexts).not.toContain('Next');

    // Tornare indietro allo step 1
    const backBtn = domContainer.querySelector('.back-btn') as HTMLButtonElement;
    stateUpdate = component.spy();
    backBtn.click();
    await stateUpdate;

    // Verificare che siamo tornati allo step 1
    expect(domContainer.textContent).toContain('Current step: 1');
    expect(domContainer.textContent).toContain('Step 1: Basic Info');
    expect(domContainer.textContent).not.toContain('Step 2: Additional Info');

    // CRUCIALE: Verificare che non ci siano bottoni duplicati
    const finalButtons = domContainer.querySelectorAll('button');
    expect(finalButtons.length).toBe(1);
    expect(finalButtons[0].textContent).toBe('Next');
    
    // Verificare che non ci siano elementi duplicati
    const stepContainers = domContainer.querySelectorAll('.step-container');
    expect(stepContainers.length).toBe(1);
  });

  it('should handle multiple back-and-forth toggles without duplicating elements', async () => {
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

    const ToggleForm = () => {
      return app.otherwise(() => {
        return Div({},
          app.state.step === 1 ? Div({ key: 'step-1' },
            P({}, 'Content A'),
            Button({}, 'Go to B').on('click', async () => {
              await app.dispatch({ ...app.state, step: 2 });
            })
          ) : null,

          app.state.step === 2 ? Div({ key: 'step-2' },
            P({}, 'Content B'),
            Button({}, 'Go to A').on('click', async () => {
              await app.dispatch({ ...app.state, step: 1 });
            })
          ) : null
        );
      });
    };

    await app.createRoot(domContainer, ToggleForm());

    // Fare 5 toggle avanti e indietro
    for (let i = 0; i < 5; i++) {
      // Verificare stato corrente
      const currentStep = app.state.step;
      const buttons = domContainer.querySelectorAll('button');
      expect(buttons.length).toBe(1);

      if (currentStep === 1) {
        expect(domContainer.textContent).toContain('Content A');
        expect(buttons[0].textContent).toBe('Go to B');
        
        // Andare a step 2
        let stateUpdate = component.spy();
        buttons[0].click();
        await stateUpdate;
      } else {
        expect(domContainer.textContent).toContain('Content B');
        expect(buttons[0].textContent).toBe('Go to A');
        
        // Tornare a step 1
        let stateUpdate = component.spy();
        buttons[0].click();
        await stateUpdate;
      }
    }

    // Verificare che alla fine abbiamo ancora un solo bottone
    const finalButtons = domContainer.querySelectorAll('button');
    expect(finalButtons.length).toBe(1);
  });

  it('should preserve input values when toggling between steps', async () => {
    const domContainer = document.getElementById('root')!;
    const component = domContainer as any;

    component.spy = () => {
      return new Promise(resolve => {
        setTimeout(() => resolve(true), 0);
      });
    };

    const app = farinel().stating(() => ({
      step: 1,
      firstName: '',
      lastName: ''
    }));

    const Form = () => {
      return app.otherwise(() => {
        return Div({},
          app.state.step === 1 ? Div({ key: 'step-1' },
            Input({ 
              value: app.state.firstName, 
              placeholder: 'First Name',
              id: 'firstName'
            }).on('input', async (e: any) => {
              await app.dispatch({ ...app.state, firstName: e.target.value });
            }),
            Button({ id: 'next' }, 'Next').on('click', async () => {
              await app.dispatch({ ...app.state, step: 2 });
            })
          ) : null,

          app.state.step === 2 ? Div({ key: 'step-2' },
            Input({ 
              value: app.state.lastName, 
              placeholder: 'Last Name',
              id: 'lastName'
            }),
            Button({ id: 'back' }, 'Back').on('click', async () => {
              await app.dispatch({ ...app.state, step: 1 });
            })
          ) : null
        );
      });
    };

    await app.createRoot(domContainer, Form());

    // Inserire un valore nello step 1
    const firstNameInput = domContainer.querySelector('#firstName') as HTMLInputElement;
    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(new Event('input', { bubbles: true }));
    await component.spy();

    expect(app.state.firstName).toBe('John');

    // Andare allo step 2
    const nextBtn = domContainer.querySelector('#next') as HTMLButtonElement;
    let stateUpdate = component.spy();
    nextBtn.click();
    await stateUpdate;

    expect(domContainer.querySelector('#lastName')).toBeTruthy();
    expect(domContainer.querySelector('#firstName')).toBeFalsy();

    // Tornare allo step 1
    const backBtn = domContainer.querySelector('#back') as HTMLButtonElement;
    stateUpdate = component.spy();
    backBtn.click();
    await stateUpdate;

    // Verificare che il valore sia ancora lì
    const firstNameInputAgain = domContainer.querySelector('#firstName') as HTMLInputElement;
    expect(firstNameInputAgain.value).toBe('John');
    expect(app.state.firstName).toBe('John');
  });

  it('should handle conditional error messages appearing and disappearing', async () => {
    const domContainer = document.getElementById('root')!;
    const component = domContainer as any;

    component.spy = () => {
      return new Promise(resolve => {
        setTimeout(() => resolve(true), 0);
      });
    };

    const app = farinel().stating(() => ({
      value: '',
      error: ''
    }));

    const FormWithError = () => {
      return app.otherwise(() => {
        return Div({},
          Input({ value: app.state.value }).on('input', async (e: any) => {
            const newValue = e.target.value;
            const hasError = newValue.length > 0 && newValue.length < 3;
            await app.dispatch({ 
              ...app.state, 
              value: newValue,
              error: hasError ? 'Too short!' : ''
            });
          }),
          app.state.error ? P({ class: 'error', style: 'color: red' }, app.state.error) : null,
          Button({}, 'Submit')
        );
      });
    };

    await app.createRoot(domContainer, FormWithError());

    // Inizialmente nessun errore
    expect(domContainer.querySelector('.error')).toBeFalsy();
    const initialButtons = domContainer.querySelectorAll('button');
    expect(initialButtons.length).toBe(1);

    // Digitare un carattere - dovrebbe apparire l'errore
    const input = domContainer.querySelector('input') as HTMLInputElement;
    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await component.spy();

    expect(domContainer.querySelector('.error')).toBeTruthy();
    expect(domContainer.querySelector('.error')?.textContent).toBe('Too short!');
    
    // Il bottone Submit deve essere ancora uno solo
    const buttonsWithError = domContainer.querySelectorAll('button');
    expect(buttonsWithError.length).toBe(1);

    // Digitare abbastanza caratteri - l'errore dovrebbe scomparire
    input.value = 'abc';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await component.spy();

    expect(domContainer.querySelector('.error')).toBeFalsy();
    
    // Il bottone Submit deve essere ancora uno solo
    const finalButtons = domContainer.querySelectorAll('button');
    expect(finalButtons.length).toBe(1);
  });
});

