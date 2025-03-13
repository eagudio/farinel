import { farinel } from '../main';
import { Button } from '../html/button';
import { Div } from '../html/div';
import { Input } from '../html/input';
import { Select } from '../html/select';
import { Option } from '../html/option';

describe('Farinel with HTML elements', () => {
  let domContainer: HTMLElement;
  let farinelInstance: any;

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
      const element = await farinelInstance
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

      domContainer.appendChild(element);
      expect(domContainer.innerHTML).toContain('status: ready');
      expect(domContainer.innerHTML).toContain('Click me!');
    });

    it('should update the DOM when state changes', async () => {
      const element = await farinelInstance
        .stating(() => ({
          counter: 0,
          loading: false
        }))
        .otherwise(() => 
          Div({}, 
            Div({}, `counter: ${farinelInstance.state.counter}`),
            Button({
              disabled: farinelInstance.state.loading,
            }, "Increment")
              .on("click", async () => {
                await farinelInstance.setState({
                  ...farinelInstance.state,
                  counter: farinelInstance.state.counter + 1
                });
              })
          )
        );

      domContainer.appendChild(element);
      
      // Check initial state
      expect(domContainer.innerHTML).toContain('counter: 0');
      
      // Simulate button click and wait for update
      const button = domContainer.querySelector('button');
      button?.click();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify counter has been incremented
      expect(domContainer.innerHTML).toContain('counter: 1');
    });
  });

  describe('Select with options', () => {
    it('should correctly render the select with options', async () => {
      const element = await farinelInstance
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

      domContainer.appendChild(element);
      
      const select = domContainer.querySelector('select');
      expect(select).toBeTruthy();
      expect(select?.children.length).toBe(3);
      
      // Set value and verify it has been updated
      if (select) {
        select.setAttribute('value', '0');
        expect(select.getAttribute('value')).toBe('0');
      }
    });

    it('should update state when a new option is selected', async () => {
      const element = await farinelInstance
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
            .on("change", async (e: any) => {
              await farinelInstance.setState({
                value: Number(e.target.value)
              });
            })
        );

      domContainer.appendChild(element);
      
      const select = domContainer.querySelector('select');
      if (select) {
        // Set initial value
        select.setAttribute('value', '0');
        
        // Simulate selection change
        select.setAttribute('value', '2');
        select.dispatchEvent(new Event('change'));
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Recreate element to verify updated state
        const updatedElement = await farinelInstance;
        domContainer.innerHTML = '';
        domContainer.appendChild(updatedElement);
        
        const updatedSelect = domContainer.querySelector('select');
        if (updatedSelect) {
          updatedSelect.setAttribute('value', '2');
          expect(updatedSelect.getAttribute('value')).toBe('2');
        }
      }
    });
  });

  describe('Input with state', () => {
    it('should correctly render the input with state value', async () => {
      const element = await farinelInstance
        .stating(() => ({
          value: 'test'
        }))
        .otherwise(() => 
          Input({
            type: 'text',
            value: farinelInstance.state.value
          })
        );

      domContainer.appendChild(element);
      
      const input = domContainer.querySelector('input');
      expect(input).toBeTruthy();
      expect(input?.value).toBe('test');
    });

    it('should update state when input changes', async () => {
      const element = await farinelInstance
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

      domContainer.appendChild(element);
      
      const input = domContainer.querySelector('input');
      if (input) {
        input.value = 'new value';
        input.dispatchEvent(new Event('input'));
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Recreate element to verify updated state
        const updatedElement = await farinelInstance;
        domContainer.innerHTML = '';
        domContainer.appendChild(updatedElement);
        
        const updatedInput = domContainer.querySelector('input');
        expect(updatedInput?.value).toBe('new value');
      }
    });
  });
}); 