# Farinel

Farinel is a lightweight and reactive UI framework for creating user interfaces in JavaScript/TypeScript. It provides a declarative and functional approach to state management and component rendering.

## Features

- 🎯 Reactive state management
- 🎨 Native HTML components
- 🔄 Automatic DOM updates
- 🎭 Simplified event handling
- 📦 Zero external dependencies
- 🎨 Conditional rendering with `.when()`
- 🔄 State transformations with `.extracting()`
- 🧪 State testing with `.test()`
- 🎯 Multiple state handlers with `.with()`

## Installation

```bash
npm install farinel
```

## Quick Guide

### Creating an Instance

```typescript
import { farinel } from 'farinel';

const app = farinel();
```

### Basic Component Structure

```typescript
const MyComponent = () => {
  const component = farinel();

  return component
    .stating(() => ({
      counter: 0,
      loading: false
    }))
    .otherwise(() => 
      Div({}, 
        Div({}, `status: ${component.state.loading ? 'loading' : 'ready'}`),
        Button({
          disabled: component.state.loading,
        }, "Click me!")
      )
    );
}
```

### Conditional Rendering

```typescript
component
  .stating(() => ({
    counter: 0
  }))
  .when((state) => state.counter > 3, () => 
    Div({}, "Counter is greater than 3!")
  )
  .otherwise(() => 
    Div({}, "Counter is less than or equal to 3")
  );
```

### State Transformations

```typescript
component
  .stating(() => ({
    loading: false,
    counter: 0
  }))
  .extracting((state) => ({
    ...state,
    text: state.loading ? "Loading..." : "Click me!"
  }))
  .otherwise(() => 
    Button({}, component.state.text)
  );
```

### Multiple State Handlers

```typescript
component
  .stating(() => ({
    counter: 0
  }))
  .test((state, currentState) => state.counter === currentState)
  .with(5, () => 
    Div({}, "Counter is exactly 5!")
  )
  .otherwise(() => 
    Div({}, `Counter is ${component.state.counter}`)
  );
```

### Event Handling

```typescript
Button({}, "Increment")
  .on("click", async () => {
    await component.setState({
      ...component.state,
      counter: component.state.counter + 1
    });
  })
```

### Form Components

```typescript
// Input with state
Input({
  type: 'text',
  value: component.state.value,
  disabled: component.state.loading
})
  .on("input", async (e) => {
    await component.setState({
      value: e.target.value
    });
  });

// Select with options
Select({
  value: component.state.value
}, 
  [0, 1, 2].map(i => Option({
    value: i
  }, `Option ${i}`))
)
  .on("change", async (e) => {
    await component.setState({
      value: Number(e.target.value)
    });
  });
```

## Complete Example

```typescript
import { farinel } from 'farinel';
import { Div, Button, Input, Select, Option } from './html';

const CounterButton = ({ counter, loading, onButtonClick }) => {
  const button = farinel();

  const handleClick = async () => {
    await button.setState({...button.state, loading: true});
    onButtonClick({...button.state, loading: true});

    setTimeout(async () => {
      await button.setState({
        counter: button.state.counter + 1, 
        loading: false
      });
      onButtonClick({
        counter: button.state.counter, 
        loading: button.state.loading
      });
    }, 1000);
  }

  return button
    .stating(() => ({
      loading,
      counter,
    }))
    .when((state) => state.counter > 3, () => 
      Button({
        disabled: button.state.loading,
      }, "Counter is > 3!")
        .on("click", handleClick)
    )
    .extracting((state) => ({
      ...state,
      text: state.loading ? "Loading..." : "Click me!",
    }))
    .otherwise(() =>
      Button({
        disabled: button.state.loading,
      }, button.state.text)
        .on("click", handleClick)
    );
}

const App = async () => {
  const app = farinel();
  
  await app.createRoot(document.body, () => {
    const container = farinel();
    
    return container
      .stating(() => ({
        counter: 0,
        loading: false,
      }))
      .otherwise(() => 
        Div({}, 
          Div({}, `Status: ${container.state.loading ? 'loading' : 'ready'}`),
          CounterButton({
            counter: container.state.counter,
            loading: container.state.loading,
            onButtonClick: ({counter, loading}) => {
              container.setState({ counter, loading });
            },
          }),
          Input({
            type: "text",
            disabled: container.state.loading,
            value: container.state.counter,
          }),
          Select({
            value: container.state.counter,
          }, 
            [0, 1, 2, 3, 4].map(i => Option({
              value: i,
            }, `Option ${i}`))
          )
            .on("change", async (e) => {
              await container.setState({
                counter: Number(e.target.value)
              });
            })
        )
      );
  });
}

App();
```

## License

MIT
