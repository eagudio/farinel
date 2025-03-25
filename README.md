# Farinel

Farinel is a lightweight and reactive UI framework for creating user interfaces in JavaScript/TypeScript. It provides a declarative and functional approach to state management and component rendering, built on top of Ciaplu for pattern matching and state management.

## Features

- 🎯 Reactive state management with Ciaplu integration
- 🎨 Native HTML components with TypeScript support
- 🔄 Automatic DOM updates
- 🎭 Simplified event handling
- 📦 Zero external dependencies
- 🎨 Conditional rendering with `.when()`
- 🔄 State transformations with `.extracting()`
- 🧪 State testing with `.test()`
- 🎯 Multiple state handlers with `.with()`
- 🔍 Pattern matching with Ciaplu's matchers
- 🎭 Type-safe component creation

## Installation

```bash
npm install farinel
```

## Quick Start

### Basic Component

```typescript
import { farinel } from 'farinel';
import { Div, Button } from './html';

const Counter = () => {
  const component = farinel()
    .stating(() => ({
      count: 0
    }))
    .otherwise(() => 
      Div({}, 
        Button({}, `Count: ${component.state.count}`)
          .on("click", async () => {
            await component.dispatch({
              count: component.state.count + 1
            });
          })
      )
    );

  return component;
}
```

## Core Concepts

### State Management

Farinel uses Ciaplu's pattern matching for state management. The state is managed through the `stating()` method:

```typescript
const component = farinel()
  .stating(() => ({
    user: null,
    loading: false
  }));
```

### State Updates (Dispatch)

State updates are handled through the `dispatch()` method:

```typescript
await component.dispatch({
  user: { id: 1, name: 'John' },
  loading: true
});
```

### Pattern Matching

Farinel exports all Ciaplu's pattern matching functions:

```typescript
component
  .with({ type: 'success' }, () => 
    Div({}, "Success!")
  )
  .withType(Error, () => 
    Div({}, "Error occurred")
  )
  .when(state => state.count > 10, () => 
    Div({}, "Count is high!")
  )
  .otherwise(() => 
    Div({}, "Default view")
  );
```

### State Transformations

Transform state before rendering:

```typescript
component
  .stating(() => ({
    firstName: 'John',
    lastName: 'Doe'
  }))
  .extracting(state => ({
    ...state,
    fullName: `${state.firstName} ${state.lastName}`
  }))
  .otherwise(() => 
    Div({}, `Hello ${component.state.fullName}!`)
  );
```

### Component Composition

Components can be composed and nested:

```typescript
const UserProfile = ({ user }) => {
  const profile = farinel()
    .stating(() => ({
      user,
      editing: false
    }))
    .otherwise(() => 
      Div({}, 
        UserHeader({ user: profile.state.user }),
        UserDetails({ 
          user: profile.state.user,
          editing: profile.state.editing,
          onEdit: () => profile.dispatch({ editing: true })
        })
      )
    );

  return profile;
};
```

### Event Handling

Events are handled with the `on()` method:

```typescript
Button({}, "Submit")
  .on("click", async (e) => {
    e.preventDefault();
    await component.dispatch({
      loading: true
    });
    // ... handle submission
  });
```

### Form Components

Farinel provides form components with state management:

```typescript
const LoginForm = () => {
  const form = farinel()
    .stating(() => ({
      email: '',
      password: '',
      loading: false
    }))
    .otherwise(() => 
      Form({}, 
        Input({
          type: 'email',
          value: form.state.email,
          disabled: form.state.loading
        })
          .on("input", async (e) => {
            await form.dispatch({
              email: e.target.value
            });
          }),
        Input({
          type: 'password',
          value: form.state.password,
          disabled: form.state.loading
        })
          .on("input", async (e) => {
            await form.dispatch({
              password: e.target.value
            });
          }),
        Button({
          disabled: form.state.loading
        }, "Login")
          .on("click", async () => {
            await form.dispatch({ loading: true });
            // ... handle login
          })
      )
    );

  return form;
};
```

### Root Creation

Create a root component and mount it to the DOM:

```typescript
const app = farinel();
await app.createRoot(document.body, App);
```

### State Observation

Observe state changes with the `spy()` method:

```typescript
const stateChange = component.spy();
await component.dispatch({ count: 1 });
const newState = await stateChange;
```

## Complete Example

```typescript
import { farinel } from 'farinel';
import { Div, Button, Input, Form } from './html';

const LoginPage = () => {
  const loginPage = farinel()
    .stating(() => ({
      email: '',
      password: '',
      loading: false,
      error: null
    }))
    .when(state => state.error, () => 
      Div({}, 
        Form({}, 
          Div({}, `Error: ${loginPage.state.error}`),
          Input({
            type: 'email',
            value: loginPage.state.email,
            disabled: loginPage.state.loading
          })
            .on("input", async (e) => {
              await loginPage.dispatch({
                email: e.target.value,
                error: null
              });
            }),
          Input({
            type: 'password',
            value: loginPage.state.password,
            disabled: loginPage.state.loading
          })
            .on("input", async (e) => {
              await loginPage.dispatch({
                password: e.target.value,
                error: null
              });
            }),
          Button({
            disabled: loginPage.state.loading
          }, "Login")
            .on("click", async () => {
              await loginPage.dispatch({ loading: true });
              try {
                // ... handle login
                await loginPage.dispatch({ 
                  loading: false,
                  error: null
                });
              } catch (error) {
                await loginPage.dispatch({ 
                  loading: false,
                  error: error.message
                });
              }
            })
        )
      )
    )
    .otherwise(() => 
      Div({}, 
        Form({}, 
          Input({
            type: 'email',
            value: loginPage.state.email,
            disabled: loginPage.state.loading
          })
            .on("input", async (e) => {
              await loginPage.dispatch({
                email: e.target.value,
                error: null
              });
            }),
          Input({
            type: 'password',
            value: loginPage.state.password,
            disabled: loginPage.state.loading
          })
            .on("input", async (e) => {
              await loginPage.dispatch({
                password: e.target.value,
                error: null
              });
            }),
          Button({
            disabled: loginPage.state.loading
          }, "Login")
            .on("click", async () => {
              await loginPage.dispatch({ loading: true });
              try {
                // ... handle login
                await loginPage.dispatch({ 
                  loading: false,
                  error: null
                });
              } catch (error) {
                await loginPage.dispatch({ 
                  loading: false,
                  error: error.message
                });
              }
            })
        )
      )
    );

  return loginPage;
};

const App = async () => {
  const app = farinel();
  await app.createRoot(document.body, LoginPage);
};

App();
```

## API Reference

### Core Methods

- `stating(getState)`: Initialize component state
- `dispatch(newState)`: Update component state
- `createRoot(container, component)`: Mount component to DOM
- `spy()`: Observe state changes
- `resolve()`: Resolve component to final element

### Pattern Matching Methods (from Ciaplu)

- `with(value, handler)`: Match exact value
- `withType(type, handler)`: Match by type
- `when(matcher, handler)`: Match by condition
- `otherwise(handler)`: Default handler
- `extracting(handler)`: Transform state
- `test(matcher)`: Test state condition

### HTML Components

- `Div(attributes, children)`
- `Button(attributes, children)`
- `Input(attributes)`
- `Form(attributes, children)`
- `Select(attributes, children)`
- `Option(attributes, children)`

and more...

## License

MIT
