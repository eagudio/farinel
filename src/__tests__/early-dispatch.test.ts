import { Farinel, farinel } from '../main';
import { Div, P, Button } from '../html';

describe('Farinel early dispatch', () => {
  let domContainer: HTMLElement;

  beforeEach(() => {
    domContainer = document.createElement('div');
    document.body.appendChild(domContainer);
  });

  afterEach(() => {
    document.body.removeChild(domContainer);
  });

  it('should wait for mount before executing dispatch called immediately', async () => {
    const component = farinel()
      .stating(() => ({
        data: null,
        loading: true,
      }))
      .otherwise(() =>
        Div({},
          component.state.loading
            ? P({}, 'Loading...')
            : P({}, `Data: ${component.state.data}`)
        )
      );

    // Simulate immediate data loading (before mount)
    const loadData = async () => {
      // This dispatch is called before createRoot completes
      await component.dispatch({
        ...component.state,
        loading: true,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 10));

      await component.dispatch({
        data: 'test data',
        loading: false,
      });
    };

    // Start loading immediately (before mount)
    const loadingPromise = loadData();

    // Mount the component
    await farinel().createRoot(domContainer, component);

    // Wait for loading to complete
    await loadingPromise;

    // Component should show the loaded data
    expect(domContainer.innerHTML).toContain('Data: test data');
    expect(domContainer.innerHTML).not.toContain('Loading...');
  });

  it('should handle multiple early dispatches in sequence', async () => {
    const component = farinel()
      .stating(() => ({
        count: 0,
      }))
      .otherwise(() => Div({}, P({}, `Count: ${component.state.count}`)));

    // Multiple dispatches before mount
    const updates = (async () => {
      await component.dispatch({ count: 1 });
      await component.dispatch({ count: 2 });
      await component.dispatch({ count: 3 });
    })();

    // Mount while dispatches are pending
    await farinel().createRoot(domContainer, component);

    // Wait for all updates to complete
    await updates;

    expect(domContainer.innerHTML).toContain('Count: 3');
  });

  it('should work with IIFE pattern (common use case)', async () => {
    const component = farinel()
      .stating(() => ({
        boards: [],
        loading: true,
      }))
      .otherwise(() =>
        Div({},
          component.state.loading
            ? P({}, 'Loading boards...')
            : Div({},
                P({}, `Loaded ${component.state.boards.length} boards`),
                component.state.boards.map((board: string) => P({}, board))
              )
        )
      );

    // IIFE pattern - immediately start loading
    (async () => {
      await component.dispatch({
        ...component.state,
        loading: true,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 10));
      const boards = ['Board 1', 'Board 2', 'Board 3'];

      await component.dispatch({
        boards,
        loading: false,
      });
    })();

    // Mount the component (potentially after IIFE has started)
    await farinel().createRoot(domContainer, component);

    // Wait a bit for the IIFE to complete
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(domContainer.innerHTML).toContain('Loaded 3 boards');
    expect(domContainer.innerHTML).toContain('Board 1');
    expect(domContainer.innerHTML).toContain('Board 2');
    expect(domContainer.innerHTML).toContain('Board 3');
  });

  it('should timeout if createRoot is never called', async () => {
    jest.setTimeout(15000); // Increase test timeout

    const component = farinel()
      .stating(() => ({ count: 0 }))
      .otherwise(() => Div({}, P({}, `Count: ${component.state.count}`)));

    // Try to dispatch without ever calling createRoot
    const dispatchPromise = component.dispatch({ count: 1 });

    // Should reject with timeout error after 10 seconds
    await expect(dispatchPromise).rejects.toThrow('Component mount timeout');
  });
});

