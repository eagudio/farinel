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
          .on("input", (e) => {
            // Update state directly to preserve focus
            form.state.email = e.target.value;
          }),
        Input({
          type: 'password',
          value: form.state.password,
          disabled: form.state.loading
        })
          .on("input", (e) => {
            // Update state directly to preserve focus
            form.state.password = e.target.value;
          }),
        Button({
          disabled: form.state.loading
        }, "Login")
          .on("click", async () => {
            // Dispatch only on submit, not on every keystroke
            await form.dispatch({ 
              ...form.state,
              loading: true 
            });
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
            .on("input", (e) => {
              loginPage.state.email = e.target.value;
              loginPage.state.error = null;
            }),
          Input({
            type: 'password',
            value: loginPage.state.password,
            disabled: loginPage.state.loading
          })
            .on("input", (e) => {
              loginPage.state.password = e.target.value;
              loginPage.state.error = null;
            }),
          Button({
            disabled: loginPage.state.loading
          }, "Login")
            .on("click", async () => {
              await loginPage.dispatch({ 
                ...loginPage.state,
                loading: true 
              });
              try {
                // ... handle login
                await loginPage.dispatch({ 
                  ...loginPage.state,
                  loading: false,
                  error: null
                });
              } catch (error) {
                await loginPage.dispatch({ 
                  ...loginPage.state,
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
            .on("input", (e) => {
              loginPage.state.email = e.target.value;
              loginPage.state.error = null;
            }),
          Input({
            type: 'password',
            value: loginPage.state.password,
            disabled: loginPage.state.loading
          })
            .on("input", (e) => {
              loginPage.state.password = e.target.value;
              loginPage.state.error = null;
            }),
          Button({
            disabled: loginPage.state.loading
          }, "Login")
            .on("click", async () => {
              await loginPage.dispatch({ 
                ...loginPage.state,
                loading: true 
              });
              try {
                // ... handle login
                await loginPage.dispatch({ 
                  ...loginPage.state,
                  loading: false,
                  error: null
                });
              } catch (error) {
                await loginPage.dispatch({ 
                  ...loginPage.state,
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

## Best Practices

### Conditional Rendering

**Always use ternary operators with `null` for conditional rendering**, not logical AND (`&&`) operators:

```typescript
// ✅ CORRECT - Use ternary operator
state.showModal ? Div({}, "Modal content") : null

// ❌ WRONG - Using && can cause rendering issues
state.showModal && Div({}, "Modal content")  // Returns false when condition is false
```

**Why?** When using `&&`, JavaScript returns `false` when the condition is false. Farinel normalizes `false` to an empty string `''`, which corrupts the children array structure and breaks the diffing algorithm. Using ternary operators with `: null` ensures proper handling of conditional elements.

### Input Focus Preservation

**For text inputs, avoid calling `dispatch()` on every keystroke**. Instead, update state directly:

```typescript
// ✅ CORRECT - Direct state update preserves focus
Input({ value: component.state.text })
  .on("input", (e) => {
    component.state.text = e.target.value;  // No re-render
  })

// ❌ WRONG - Dispatch on every keystroke loses focus
Input({ value: component.state.text })
  .on("input", async (e) => {
    await component.dispatch({ text: e.target.value });  // Re-renders, loses focus
  })
```

**Why?** Calling `dispatch()` triggers a full re-render and diff/patch cycle. Farinel's `PropsPatch` automatically preserves input focus, but only if the input element is patched, not replaced. Direct state updates avoid unnecessary re-renders while typing.

### Multi-Step Forms and Conditional Steps

**Use unique `key` attributes for conditional elements** to help Farinel's diffing algorithm:

```typescript
state.step === 1 ? Div({ key: 'step-1' }, 
  // Step 1 content
) : null,

state.step === 2 ? Div({ key: 'step-2' }, 
  // Step 2 content
) : null
```

**Why?** Keys enable identity-based diffing, allowing Farinel to correctly track which elements are added, removed, or moved, rather than relying on positional matching.

## License

MIT

## Changelog

### v2.3.0 (2025-11-26)

**Major Improvements:**

- **Robust Null/Undefined Handling**: Conditional rendering with `null`/`undefined` now uses comment placeholders (`document.createComment("placeholder")`) to maintain consistent DOM structure and prevent index mismatches during patching
- **Input Focus Preservation**: Enhanced `PropsPatch` to automatically preserve input focus and cursor position during patches, eliminating focus loss issues
- **Key-Based Diffing**: Implemented identity-based diffing using `id` and `key` attributes, enabling efficient updates for lists, conditional elements, and multi-step forms
- **Direct State Updates**: Components can now update `component.state` directly without triggering re-renders, useful for form inputs and frequent state changes
- **Improved Conditional Rendering**: Better handling of ternary operators and `null` children in the virtual DOM
- **Enhanced Patch Robustness**: All patch types now gracefully handle missing or undefined elements common in conditional rendering scenarios

**Breaking Changes:**
- None - fully backward compatible

**Best Practices Added:**
- Use ternary operators (`: null`) instead of `&&` for conditional rendering
- Update input state directly to preserve focus during typing
- Use `key` attributes for conditional/dynamic elements

### v2.2.0

**Key-Based Diffing:**

- Implemented identity-based diffing using `id` and `key` attributes
- Automatic input focus and cursor position preservation in `PropsPatch`

### v2.1.0

**Auto-Wait Mechanism:**

- `dispatch()` now automatically waits for component mount before executing
- Prevents "Element not found" errors when calling dispatch early in component lifecycle

### v2.0.1+

## Bug Fixes and Improvements

### Nested Children Rendering (v2.0.1+)

Fixed a bug where nested arrays of children were not properly handled during rendering and patching. The virtual DOM now correctly flattens nested array structures in children:

```typescript
// This now works correctly:
Div({}, 
  [[Button({}, 'A'), Button({}, 'B')], 
   [Button({}, 'C')]]  
);
// Renders as: <div><button>A</button><button>B</button><button>C</button></div>
```

#### What was fixed:

1. **Array Flattening**: Children passed as nested arrays are automatically flattened to a single level
2. **Boolean Normalization**: Boolean children (`true`/`false`) are converted to empty text nodes, consistent with render behavior
3. **Event Handling on Nested Elements**: Event handlers now correctly attach to elements inside nested arrays
4. **Patching Consistency**: The diff/patch algorithm now correctly compares and updates elements with normalized children structure

#### Event Handler Cleanup (Props)

Event handlers passed as props (e.g., `onClick`) that are removed during patch are now properly tracked and removed. The `attachListener` and `detachPropListeners` methods on Element ensure listeners don't leak.

### Running Tests

To verify the fixes and run the test suite:

```bash
npm test
```

Test files covering these fixes:
- `src/__tests__/nested-events.test.ts` - Nested array rendering and event handling
- `src/__tests__/events-update.test.ts` - Event handler prop removal  
- `src/__tests__/list-reordering.test.ts` - List and array handling edge cases
