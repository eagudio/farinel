import { Farinel, farinel } from '../main';
import { Button } from '../html/button';
import { Div } from '../html/div';
import { Input } from '../html/input';
import { Select } from '../html/select';
import { Option } from '../html/option';
import { P } from '../html/p';
describe('Farinel with HTML elements', () => {
  let domContainer: HTMLElement;
  let farinelInstance: Farinel;

  beforeEach(() => {
    domContainer = document.createElement('div');
    document.body.appendChild(domContainer);
    farinelInstance = farinel();
  });

  afterEach(() => {
    document.body.removeChild(domContainer);
  });

  describe('Container with state', () => {
    it('should correctly render the container with initial state', async () => {
      farinelInstance
        .stating(() => ({
          counter: 0,
          loading: false
        }))
        .otherwise(() => 
          Div({}, 
            Div({}, `status: ${farinelInstance.state.loading ? 'loading' : 'ready'}`),
            Button({
              disabled: farinelInstance.state.loading,
            }, "Click me!")
          )
        );

      await farinel().createRoot(domContainer, farinelInstance);

      expect(domContainer.innerHTML).toContain('status: ready');
      expect(domContainer.innerHTML).toContain('Click me!');
    });

    it('should update the DOM when state changes', async () => {
      farinelInstance
        .stating(() => ({
          counter: 0,
        }))
        .otherwise(() => 
          Div({}, 
            Div({}, `counter: ${farinelInstance.state.counter}`),
            Button({}, "Increment")
              .on("click", async () => {
                await farinelInstance.setState({
                  ...farinelInstance.state,
                  counter: farinelInstance.state.counter + 1
                });
              })
          )
        );

      await farinel().createRoot(domContainer, farinelInstance);
      
      expect(domContainer.innerHTML).toContain('counter: 0');
      
      const button = domContainer.querySelector('button') as HTMLButtonElement;

      const stateUpdated = farinelInstance.spy();
      
      button.click();

      await stateUpdated;
      
      expect(domContainer.innerHTML).toContain('counter: 1');
    });
  });

  describe('Select with options', () => {
    it('should correctly render the select with options', async () => {
      farinelInstance
        .stating(() => ({
          value: 0
        }))
        .otherwise(() => 
          Select({
            value: farinelInstance.state.value
          }, 
            [0, 1, 2].map(i => Option({
              value: i
            }, `Option ${i}`))
          )
        );

      await farinel().createRoot(domContainer, farinelInstance);
      
      const select = domContainer.querySelector('select');
      expect(select).toBeTruthy();
      expect(select?.children.length).toBe(3);
      
      if (select) {
        select.setAttribute('value', '0');
        expect(select.getAttribute('value')).toBe('0');
      }
    });

    it('should update state when a new option is selected', async () => {
      farinelInstance
        .stating(() => ({
          value: 0
        }))
        .when(() =>farinelInstance.state.value === 2, () =>
          P({}, `value: ${farinelInstance.state.value}`)
        )
        .otherwise(() => 
          Select({
            value: farinelInstance.state.value
          }, 
            [0, 1, 2].map(i => Option({
              value: i
            }, `Option ${i}`))
          )
            .on("change", async (e: any) => {
              await farinelInstance.setState({
                value: Number(e.target.value)
              });
            })
        );

      await farinel().createRoot(domContainer, farinelInstance);

      let select = domContainer.querySelector('select') as HTMLSelectElement;
      let selectedOption = select.querySelector(`option[value="1"]`) as HTMLOptionElement;

      let stateUpdated = farinelInstance.spy();

      select.value = '1';
      selectedOption.selected = true;
      selectedOption.dispatchEvent(new Event('change', { bubbles: true }));

      await stateUpdated;

      expect(domContainer.innerHTML).toContain('select');
      
      select = domContainer.querySelector('select') as HTMLSelectElement;
      selectedOption = select.querySelector(`option[value="2"]`) as HTMLOptionElement;

      stateUpdated = farinelInstance.spy();

      select.value = '2';
      selectedOption.selected = true;
      selectedOption.dispatchEvent(new Event('change', { bubbles: true }));

      await stateUpdated;

      expect(domContainer.innerHTML).toContain('value: 2');
    });
  });

  describe('Input with state', () => {
    it('should correctly render the input with state value', async () => {
      farinelInstance
        .stating(() => ({
          value: 'test'
        }))
        .otherwise(() => 
          Input({
            type: 'text',
            value: farinelInstance.state.value
          })
        );

      await farinel().createRoot(domContainer, farinelInstance);
      
      const input = domContainer.querySelector('input');
      expect(input).toBeTruthy();
      expect(input?.value).toBe('test');
    });

    it('should update state when input changes', async () => {
      farinelInstance
        .stating(() => ({
          value: ''
        }))
        .otherwise(() => 
          Input({
            type: 'text',
            value: farinelInstance.state.value
          })
            .on("input", async (e: any) => {
              await farinelInstance.setState({
                value: e.target.value
              });
            })
        );

      await farinel().createRoot(domContainer, farinelInstance);
      
      const input = domContainer.querySelector('input') as HTMLInputElement;

      const stateUpdated = farinelInstance.spy();
      
      input.value = 'new value';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      await stateUpdated;

      const updatedInput = domContainer.querySelector('input') as HTMLInputElement;
      expect(updatedInput.value).toBe('new value');
      expect(farinelInstance.state.value).toBe('new value');
    });
  });

  // describe('Tree of farinel elements', () => {
  //   it('should correctly render the tree of farinel elements', async () => {
  //     const MyButton = () => farinel()
  //       .stating(() => ({}))
  //       .otherwise(() => 
  //         Button({}, 'Login')
  //           .on("click", async () => {
  //             await farinelInstance.setState({
  //               logged: true
  //             });
  //           })
  //         );

  //     farinelInstance
  //       .stating(() => ({
  //         logged: false
  //       }))
  //       .when(() => farinelInstance.state.logged, () =>
  //         P({}, 'Logged in')
  //       )
  //       .otherwise(() => 
  //         MyButton()
  //       );

  //     await farinel().createRoot(domContainer, farinelInstance);

  //     const button = domContainer.querySelector('button') as HTMLButtonElement;
  //     expect(button).toBeTruthy();
  //     expect(button.textContent).toBe('Login');
      
  //     const stateUpdated = farinelInstance.spy();

  //     button.click();

  //     await stateUpdated;

  //     expect(domContainer.innerHTML).toContain('Logged in');
  //   });
  // });
}); 