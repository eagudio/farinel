import { Farinel, farinel } from '../main';
import { Div, Input, Select, Option, P, Button, Form } from '../html';

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
        .rendering(() => 
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
        .rendering(() => 
          Div({}, 
            Div({}, `counter: ${farinelInstance.state.counter}`),
            Button({}, "Increment")
              .on("click", async () => {
                await farinelInstance.dispatch({
                  ...farinelInstance.state,
                  counter: farinelInstance.state.counter + 1
                });
              })
          )
        );

      await farinel().createRoot(domContainer, farinelInstance);
      
      expect(domContainer.innerHTML).toContain('counter: 0');
      
      let button = domContainer.querySelector('button') as HTMLButtonElement;

      expect(button.innerHTML).toContain('Increment');

      const stateUpdated = farinelInstance.spy();
      
      button.click();

      await stateUpdated;
      
      expect(domContainer.innerHTML).toContain('counter: 1');

      button = domContainer.querySelector('button') as HTMLButtonElement;

      expect(button.innerHTML).toContain('Increment');
    });
  });

  describe('Select with options', () => {
    it('should correctly render the select with options', async () => {
      farinelInstance
        .stating(() => ({
          value: 0
        }))
        .rendering(() => 
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
              await farinelInstance.dispatch({
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
        .rendering(() => 
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
        .rendering(() => 
          Input({
            type: 'text',
            value: farinelInstance.state.value
          })
            .on("input", async (e: any) => {
              await farinelInstance.dispatch({
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

  describe('Tree of farinel elements', () => {
    it('should update state on click', async () => {
      const MyButton = () => farinel()
        .stating(() => ({}))
        .rendering(() => 
          Button({}, 'Login')
            .on("click", async () => {
              await farinelInstance.dispatch({
                logged: true
              });
            })
          );

      farinelInstance
        .stating(() => ({
          logged: false
        }))
        .when(() => farinelInstance.state.logged, () =>
          P({}, 'Logged in')
        )
        .otherwise(() => 
          MyButton()
        );

      await farinel().createRoot(domContainer, farinelInstance);

      const button = domContainer.querySelector('button') as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.textContent).toBe('Login');
      
      const stateUpdated = farinelInstance.spy();

      button.click();

      await stateUpdated;

      expect(domContainer.innerHTML).toContain('Logged in');
    });

    it('should correctly render the tree of farinel elements', async () => {
      const MyButton = ({
        text
      }: {
        text: string
      }) => {
        const button: Farinel = farinel()
          .stating(() => ({
            login: false,
          }))
          .when(() => button.state.login === true, () =>
            Button({}, 'Waiting...')
          )
          .otherwise(() =>
            Button({}, text)
              .on("click", async () => {
                await button.dispatch({
                  login: true
                });

                await farinelInstance.dispatch({
                  logged: true
                });
              })
            );

        return button;
      }

      const loginButton = MyButton({ text: 'Login' });

      farinelInstance
        .stating(() => ({
          logged: false,
        }))
        .when(() => farinelInstance.state.logged, () =>
          MyButton({ text: 'Logout' })
        )
        .otherwise(() => 
          loginButton
        );

      await farinel().createRoot(domContainer, farinelInstance);

      let button = domContainer.querySelector('button') as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.textContent).toBe('Login');
      
      const loginButtonUpdateState = loginButton.spy();
      const farinelInstanceUpdateState = farinelInstance.spy();

      button.click();

      const loginButtonStateUpdated: HTMLButtonElement = await loginButtonUpdateState;

      expect(loginButtonStateUpdated.textContent).toBe('Waiting...');

      await farinelInstanceUpdateState;

      button = domContainer.querySelector('button') as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.textContent).toBe('Logout');
    });

    it('should correctly render the tree of farinel elements nested in a div', async () => {
      const MyButton = ({
        text
      }: {
        text: string
      }) => {
        const button: Farinel = farinel()
          .stating(() => ({
            login: false,
          }))
          .when(() => button.state.login === true, () =>
            Div({}, Button({}, 'Waiting...'))
          )
          .otherwise(() =>
            Div({},
              Button({}, text)
                .on("click", async () => {
                  await button.dispatch({
                    login: true
                  });

                  await farinelInstance.dispatch({
                    logged: true
                  });
                })
              )
          );

        return button;
      }

      const loginButton = MyButton({ text: 'Login' });

      farinelInstance
        .stating(() => ({
          logged: false,
        }))
        .when(() => farinelInstance.state.logged, () =>
          MyButton({ text: 'Logout' })
        )
        .otherwise(() => 
          loginButton
        );

      await farinel().createRoot(domContainer, farinelInstance);

      let button = domContainer.querySelector('button') as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.textContent).toBe('Login');
      
      const loginButtonUpdateState = loginButton.spy();
      const farinelInstanceUpdateState = farinelInstance.spy();

      button.click();

      const loginButtonStateUpdated: HTMLButtonElement = await loginButtonUpdateState;

      expect(loginButtonStateUpdated.textContent).toBe('Waiting...');

      await farinelInstanceUpdateState;

      button = domContainer.querySelector('button') as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.textContent).toBe('Logout');
    });

    it('should correctly render deeply nested farinel elements', async () => {
      const LoginForm = ({
        text,
        showLogin,
      }: {
        text: string,
        showLogin: boolean
      }) => {
        const form: Farinel = farinel()
          .stating(() => ({
            loading: false
          }))
          .when(() => showLogin === false, () =>
            Button({}, text)
          )
          .otherwise(() =>
            Div({},
              P({}, 'Please login:'),
              Div({},
                Input({
                  type: 'text',
                  placeholder: 'Username'
                }),
                Input({
                  type: 'password',
                  placeholder: 'Password'
                })
              ),
              Button({ disabled: form.state.loading }, form.state.loading ? 'Waiting...' : text)
                .on("click", async () => {
                  await form.dispatch({
                    loading: true
                  });
                  
                  await new Promise(resolve => setTimeout(resolve, 100));

                  await farinelInstance.dispatch({
                    logged: true
                  });
                })
            )
          );

        return form;
      }

      const loginForm = LoginForm({ text: 'Login', showLogin: true });

      farinelInstance
        .stating(() => ({
          logged: false,
        }))
        .when(() => farinelInstance.state.logged, () =>
          Div({},
            P({}, 'Welcome back!'),
            LoginForm({ text: 'Logout', showLogin: !farinelInstance.state.logged })
          )
        )
        .otherwise(() => 
          Div({},
            P({}, 'Please login to continue'),
            loginForm
          )
        );

      await farinel().createRoot(domContainer, farinelInstance);

      let button = domContainer.querySelector('button') as HTMLButtonElement;
      let inputs = domContainer.querySelectorAll('input');
      expect(button).toBeTruthy();
      expect(button.textContent).toBe('Login');
      expect(inputs.length).toBe(2);
      expect(domContainer.innerHTML).toContain('Please login to continue');
      
      const loginFormUpdateState = loginForm.spy();
      const farinelInstanceUpdateState = farinelInstance.spy();

      button.click();

      await loginFormUpdateState;

      expect(domContainer.querySelector('button')?.textContent).toBe('Waiting...');
      expect(domContainer.querySelector('button')?.disabled).toBe(true);

      await farinelInstanceUpdateState;

      button = domContainer.querySelector('button') as HTMLButtonElement;
      inputs = domContainer.querySelectorAll('input');
      expect(button).toBeTruthy();
      expect(button.textContent).toBe('Logout');
      expect(inputs.length).toBe(0);
      expect(domContainer.innerHTML).toContain('Welcome back!');
    });
  });

  describe('Login/Logout flow', () => {
    it('should handle login and logout flow correctly', async () => {
      const mockUser = { id: 1, name: 'Test User' };
      const mockApi = {
        auth: {
          login: jest.fn().mockResolvedValue({ user: mockUser })
        }
      };

      const LoginPage = ({
        onLogin
      }: {
        onLogin: (email: string, password: string) => void
      }) => {
        const loginPage = farinel()
        .stating(() => ({
          loading: false,
        }))
        .rendering(() =>
          Div({},
            Input({ type: 'email' })
              .on("input", (e: any) => loginPage.state.email = e.target.value),
            Input({ type: 'password' })
              .on("input", (e: any) => loginPage.state.password = e.target.value),
            Button({
              disabled: loginPage.state.loading
            }, "Login")
              .on("click", async () => {
                await loginPage.dispatch({
                  ...loginPage.state,
                  loading: true
                });

                await onLogin(loginPage.state.email, loginPage.state.password);
              })
          )
        );

        return loginPage;
      }

      const Container = () => farinel()
        .stating(() => ({}))
        .rendering(() =>
          loginPage
        );

      const DashboardPage = ({
        user,
        onLogout
      }: {
        user: any,
        onLogout: () => void
      }) => farinel()
        .stating(() => ({}))
        .rendering(() =>
          Div({}, 
            P({}, `Welcome ${user.name}!`),
            Button({}, "Logout")
              .on("click", onLogout)
          )
        );

      const onLogin = async (email: string, password: string) => {
        const { user } = await mockApi.auth.login(email, password);

        await farinelInstance.dispatch({ isAuthenticated: true, user });
      }
      
      const onLogout = async () => {
        await farinelInstance.dispatch({ isAuthenticated: false, user: null });
      }

      const loginPage = LoginPage({ onLogin });

      farinelInstance
        .stating(() => ({
          isAuthenticated: false,
          user: null
        }))
        .when((state: any) => state.isAuthenticated, () =>
          DashboardPage({
            user: farinelInstance.state.user!,
            onLogout
          })
        )
        .otherwise(() =>
          Container()
        );

      await farinel().createRoot(domContainer, farinelInstance);

      expect(domContainer.innerHTML).toContain('Login');
      expect(domContainer.innerHTML).not.toContain('Welcome');

      const emailInput: HTMLInputElement = domContainer.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput: any = domContainer.querySelector('input[type="password"]') as HTMLInputElement;
      const loginButton: any = domContainer.querySelector('button') as HTMLButtonElement;

      emailInput.value = 'test@example.com';
      passwordInput.value = 'password123';
      
      emailInput.dispatchEvent(new InputEvent('input', { bubbles: true, }));
      passwordInput.dispatchEvent(new InputEvent('input', { bubbles: true }));

      const farinelInstanceUpdateState = farinelInstance.spy();
      const loginPageUpdateState = loginPage.spy();

      loginButton.click();

      await loginPageUpdateState;

      expect(loginPage.state.email).toEqual('test@example.com');
      expect(loginPage.state.password).toEqual('password123');

      expect(domContainer.querySelector('button')?.disabled).toBe(true);

      await farinelInstanceUpdateState;

      expect(domContainer.innerHTML).toContain('Welcome Test User!');
      expect(domContainer.innerHTML).toContain('Logout');

      const logoutButton = domContainer.querySelector('button') as HTMLButtonElement;

      const logoutStateUpdated = farinelInstance.spy();
      logoutButton.click();
      await logoutStateUpdated;

      expect(domContainer.innerHTML).toContain('Login');
      expect(domContainer.innerHTML).not.toContain('Welcome');
    });
  });
});
