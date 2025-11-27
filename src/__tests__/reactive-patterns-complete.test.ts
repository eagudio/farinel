import { farinel } from '../main';
import { Div, P, H1, Button } from '../html';

/**
 * Comprehensive tests for Reactive Pattern Matching in Farinel v2.5.0
 * Tests .when(), .with(), .withType() reactivity
 */
describe('Reactive Pattern Matching (v2.5.0)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should reactively switch between .when() patterns', async () => {
    const root = document.getElementById('root')!;
    
    const app = farinel()
      .stating(() => ({ status: 'loading' }))
      .when((s: any) => s.status === 'loading', () => Div({}, P({}, 'Loading...')))
      .when((s: any) => s.status === 'success', () => Div({}, P({}, 'Success!')))
      .when((s: any) => s.status === 'error', () => Div({}, P({}, 'Error!')))
      .otherwise(() => Div({}, P({}, 'Unknown')));

    await app.createRoot(root, app);
    expect(root.textContent).toBe('Loading...');

    await app.dispatch({ status: 'success' });
    expect(root.textContent).toBe('Success!');

    await app.dispatch({ status: 'error' });
    expect(root.textContent).toBe('Error!');

    await app.dispatch({ status: 'other' });
    expect(root.textContent).toBe('Unknown');
  });

  it('should reactively switch between .with() patterns', async () => {
    const root = document.getElementById('root')!;
    
    const app = farinel()
      .stating(() => 'A')
      .with('A', () => Div({}, P({}, 'Type A')))
      .with('B', () => Div({}, P({}, 'Type B')))
      .otherwise(() => Div({}, P({}, 'Unknown')));

    await app.createRoot(root, app);
    expect(root.textContent).toBe('Type A');

    await app.dispatch('B');
    expect(root.textContent).toBe('Type B');

    await app.dispatch('C');
    expect(root.textContent).toBe('Unknown');
  });

  it('should reactively switch between .withType() patterns', async () => {
    const root = document.getElementById('root')!;
    
    class UserState { constructor(public name: string) {} }
    class AdminState { constructor(public name: string) {} }
    class GuestState {}

    const app = farinel()
      .stating(() => new GuestState())
      .withType(UserState, () => Div({}, P({}, `User: ${(app.state as UserState).name}`)))
      .withType(AdminState, () => Div({}, P({}, `Admin: ${(app.state as AdminState).name}`)))
      .otherwise(() => Div({}, P({}, 'Guest')));

    await app.createRoot(root, app);
    expect(root.textContent).toBe('Guest');

    await app.dispatch(new UserState('Alice'));
    expect(root.textContent).toBe('User: Alice');

    await app.dispatch(new AdminState('Bob'));
    expect(root.textContent).toBe('Admin: Bob');
  });

  it('should handle mixed patterns in order', async () => {
    const root = document.getElementById('root')!;
    
    class Special {}

    const app = farinel()
      .stating(() => ({ value: 'normal' }))
      .withType(Special, () => Div({}, P({}, 'Special')))
      .when((s: any) => s.value === 'priority', () => Div({}, P({}, 'Priority')))
      .with('exact', () => Div({}, P({}, 'Exact')))
      .otherwise(() => Div({}, P({}, 'Normal')));

    await app.createRoot(root, app);
    expect(root.textContent).toBe('Normal');

    await app.dispatch(new Special());
    expect(root.textContent).toBe('Special');

    await app.dispatch({ value: 'priority' });
    expect(root.textContent).toBe('Priority');

    await app.dispatch('exact');
    expect(root.textContent).toBe('Exact');
  });

  it('should handle rapid state changes', async () => {
    const root = document.getElementById('root')!;
    
    const app = farinel()
      .stating(() => ({ count: 0 }))
      .when((s: any) => s.count < 5, () => Div({}, P({}, 'Low')))
      .when((s: any) => s.count >= 5 && s.count < 10, () => Div({}, P({}, 'Medium')))
      .when((s: any) => s.count >= 10, () => Div({}, P({}, 'High')))
      .otherwise(() => Div({}, P({}, 'Unknown')));

    await app.createRoot(root, app);
    expect(root.textContent).toBe('Low');

    for (let i = 1; i <= 15; i++) {
      await app.dispatch({ count: i });
    }
    
    expect(root.textContent).toBe('High');
    
    await app.dispatch({ count: 6 });
    expect(root.textContent).toBe('Medium');
  });

  it('should work with event handlers in reactive patterns', async () => {
    const root = document.getElementById('root')!;
    let clickCount = 0;

    const app = farinel()
      .stating(() => ({ view: 'counter', count: 0 }))
      .when((s: any) => s.view === 'counter', () =>
        Div({},
          P({}, `Count: ${app.state.count}`),
          Button({}, 'Click').on('click', async () => {
            clickCount++;
            await app.dispatch({ ...app.state, count: app.state.count + 1 });
          })
        )
      )
      .when((s: any) => s.view === 'done', () =>
        Div({}, P({}, 'Done!'))
      )
      .otherwise(() => Div({}, P({}, 'Unknown')));

    await app.createRoot(root, app);
    expect(root.textContent).toContain('Count: 0');

    const btn = root.querySelector('button');
    btn?.dispatchEvent(new Event('click'));
    await new Promise(r => setTimeout(r, 50));

    expect(clickCount).toBe(1);
    expect(root.textContent).toContain('Count: 1');

    await app.dispatch({ view: 'done', count: 1 });
    expect(root.textContent).toBe('Done!');
  });

  it('should preserve backwards compatibility with .otherwise() only', async () => {
    const root = document.getElementById('root')!;
    
    const app = farinel()
      .stating(() => ({ count: 0 }))
      .otherwise(() => Div({}, P({}, `Count: ${app.state.count}`)));

    await app.createRoot(root, app);
    expect(root.textContent).toBe('Count: 0');

    await app.dispatch({ count: 5 });
    expect(root.textContent).toBe('Count: 5');

    await app.dispatch({ count: 10 });
    expect(root.textContent).toBe('Count: 10');
  });

  it('should handle async predicates in .when()', async () => {
    const root = document.getElementById('root')!;
    
    const app = farinel()
      .stating(() => ({ value: 5 }))
      .when(async (s: any) => {
        await new Promise(r => setTimeout(r, 10));
        return s.value > 10;
      }, () => Div({}, P({}, 'Greater')))
      .when((s: any) => s.value > 0, () => Div({}, P({}, 'Positive')))
      .otherwise(() => Div({}, P({}, 'Other')));

    await app.createRoot(root, app);
    expect(root.textContent).toBe('Positive');

    await app.dispatch({ value: 15 });
    // Should wait for async predicate
    expect(root.textContent).toBe('Greater');
  });
});

