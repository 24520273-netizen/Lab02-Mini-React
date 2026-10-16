# Project Rules — Lab 02 Mini-React Engine

## 1. Project Stack

- Use Vite with Vanilla JavaScript and ES modules.
- Use TypeScript only for interfaces, type definitions, and contracts.
- Do not use React or another UI framework.
- JSX must be transformed by Vite/esbuild.
- JSX must resolve to the custom Mini-React `createElement` implementation.
- Do not use Babel Standalone in the browser.

---

## 2. JavaScript Standards

- Do not use `var`.
- Use `const` by default.
- Use `let` only when reassignment is required.
- Do not create implicit global variables.
- Keep state and framework internals scoped to modules.
- Use ES module `import` and `export`.

### Forbidden

```js
var count = 0;
undeclaredValue = 10;
```

### Allowed

```js
const initialCount = 0;
let currentCount = initialCount;
```

---

## 3. Event Standards

- Do not use `keypress`.
- Do not use `event.keyCode`.
- Use `keydown`.
- Use `event.key` or `event.code`.
- Do not use inline event handlers.
- Use `addEventListener` or root event delegation.

### Forbidden

```html
<button onclick="handleClick()">Click</button>
```

```js
element.addEventListener('keypress', handler);

if (event.keyCode === 13) {
  // ...
}
```

### Allowed

```js
root.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    // ...
  }
});
```

---

## 4. DOM Security Rules

- Never use `innerHTML` with dynamic data.
- Treat user-provided or dynamic strings as plain text.
- Use safe DOM APIs.

Preferred APIs:

```js
document.createElement();
document.createTextNode();
element.textContent;
element.replaceChildren();
```

The following input:

```text
<img onerror=alert(1)>
```

must be rendered as plain text and must never create an executable `<img>` element.

---

## 5. Semantic HTML Rules

Avoid unnecessary `<div>` wrappers.

Prefer semantic elements such as:

```text
main
header
section
article
nav
button
ul
li
h1
h2
p
```

### Preferred structure

```text
main
├── header
│   └── h2
├── section
│   └── ul
│       └── li
└── button
```

Do not create div soup.

---

## 6. Immutability Rules

- Never mutate received props.
- Never mutate shared state directly.
- Always return a new object or array when updating state.
- Functional components must behave as pure functions whenever possible.

### Forbidden

```js
tasks.push(newTask);
props.title = 'Changed';
```

### Allowed

```js
setTasks((previousTasks) => [
  ...previousTasks,
  newTask,
]);
```

```js
const nextState = {
  ...previousState,
  status: 'LOADING',
};
```

---

## 7. VNode Contract

A Virtual DOM node must follow the Mini-React contract.

```ts
export type VNodeType =
  | string
  | ((props: any) => VNode);

export interface VNode {
  readonly type: VNodeType;

  readonly props: {
    [key: string]: any;
    children: VNode[];
    nodeValue?: string;
  };
}
```

Primitive text values must be normalized into a reserved:

```text
TEXT_ELEMENT
```

VNode.

Example:

```js
{
  type: 'TEXT_ELEMENT',
  props: {
    nodeValue: 'Hello',
    children: [],
  },
}
```

---

## 8. createTextElement Rules

`createTextElement(text)` must:

- Convert the input using `String(text)`.
- Return a new POJO.
- Use `type: 'TEXT_ELEMENT'`.
- Store the text in `props.nodeValue`.
- Use an empty `children` array.
- Freeze the VNode.
- Freeze its `props`.

Expected structure:

```js
{
  type: 'TEXT_ELEMENT',
  props: {
    nodeValue: String(text),
    children: [],
  },
}
```

---

## 9. createElement Rules

`createElement(type, props, ...children)` must:

- Accept `props = null`.
- Treat null props as an empty object.
- Flatten nested children using `flat(Infinity)`.
- Remove:
  - `null`
  - `undefined`
  - `true`
  - `false`
- Convert string children using `createTextElement`.
- Convert number children using `createTextElement`.
- Preserve existing VNodes.
- Prefer explicit rest children over `props.children`.
- Do not copy user-provided `props.children` into the final VNode.
- Return a new frozen VNode.
- Freeze its `props`.

---

## 10. renderToDOM Rules

`renderToDOM(vNode)` must:

- Render `TEXT_ELEMENT` with `document.createTextNode()`.
- Render native HTML elements with `document.createElement()`.
- Render SVG elements with `document.createElementNS()` when the node is `<svg>` or is inside an SVG tree.
- Execute function components with their props.
- Render returned component VNodes recursively.
- Ignore `children` and `nodeValue` during attribute assignment.
- Assign `className` correctly.
- Support style objects using `Object.assign(element.style, styleObject)`.
- Assign ordinary attributes with `element.setAttribute()`.
- Support attributes such as `role`, `aria-*`, and `data-*`.
- Never use `innerHTML`.
- Render children recursively.
- Store the originating VNode on each generated DOM node:

```js
dom.__vnode = vNode;
```

---

## 11. Event Delegation Rules

Supported delegated events:

```text
click
input
keydown
```

For each supported event type:

- Attach exactly one listener to the root container.
- Do not attach native event listeners to child elements.
- Start traversal from `event.target`.
- Traverse toward the root container.
- Read the virtual handler from:

```js
node.__vnode.props[handlerName];
```

Example mapping:

```text
click   -> onClick
input   -> onInput
keydown -> onKeydown
```

- Execute the first matching handler.
- Stop traversal after the first matching handler.

`renderToDOM()` must not call `addEventListener()` for `onXxx` props after event delegation is enabled.

---

## 12. State Store Rules

Hook state must be stored outside function components.

Framework state must use module-level storage similar to:

```js
const stateStore = [];
let cursor = 0;
```

The cursor must be reset before every render pass.

```js
resetCursor();
```

Hook order must remain deterministic across renders.

---

## 13. Hook Rules

Hooks must:

- Be called at the top level.
- Be called in the same order on every render.
- Never be placed inside:
  - `if`
  - `for`
  - `while`
  - nested callbacks

Changing hook call order may corrupt state cursor positions.

---

## 14. useState Rules

`useState(initialValue)` must:

- Capture the allocated slot using:

```js
const currentCursor = cursor;
```

- Initialize the slot only if it has never been assigned.
- Do not use `??` for initialization.
- Use an existence check such as:

```js
currentCursor in stateStore
```

- Correctly preserve valid initial values such as:
  - `null`
  - `undefined`
  - `0`
  - `false`
  - `''`

- Support direct updates:

```js
setState(nextValue);
```

- Support functional updates:

```js
setState((previousValue) => nextValue);
```

- Trigger rerender only when:

```js
!Object.is(previousValue, nextValue)
```

- Increment the cursor after allocating the state slot.
- Return:

```js
[stateStore[currentCursor], setState]
```

---

## 15. State Update Batching

Multiple state updates occurring in the same tick must be batched.

Use a microtask queue such as:

```js
queueMicrotask();
```

Only one rerender should occur for multiple updates in the same tick.

Example:

```js
setCount((count) => count + 1);
setCount((count) => count + 1);
setCount((count) => count + 1);
```

Expected result:

```text
count = 3
render count = 1
```

---

## 16. Render Cycle Rules

The application render function must follow this order:

```text
resetCursor
→ execute root component
→ generate VNode tree
→ convert VNode tree to DOM
→ replace root children
```

Example:

```js
export function renderApp() {
  resetCursor();

  const vNode = TaskApp();

  root.replaceChildren(
    renderToDOM(vNode)
  );
}
```

---

## 17. Component Rules

Components must:

- Be pure functions whenever possible.
- Receive data through props.
- Never mutate props.
- Return VNodes.
- Follow unidirectional data flow.
- Prefer composition over inheritance.

Component names must begin with a capital letter when used as JSX-style components.

---

## 18. Task Manager Rules

The Exercise 2 Task Manager follows the Lab specification.

State:

```text
tasks
filter
```

Task entries use stable IDs:

```js
{
  id: crypto.randomUUID(),
  title: 'Task title',
}
```

Do not use array indexes as keys.

Use:

```js
key: task.id
```

State updates must use immutable operations such as:

```js
[
  ...previousTasks,
  newTask,
]
```

or:

```js
previousTasks.filter(...)
```

Do not use mutating operations such as:

```js
push();
splice();
```

unless operating on a newly created local copy.

---

## 19. State Machine Rules

Async UI state must use a finite state machine.

Allowed states:

```text
IDLE
LOADING
SUCCESS
ERROR
```

The state model must prevent conflicting UI states.

Example contract:

```ts
type ViewState<T> =
  | { status: 'IDLE' }
  | { status: 'LOADING' }
  | { status: 'SUCCESS'; data: T }
  | { status: 'ERROR'; error: string };
```

Expected transition:

```text
IDLE
  ↓
LOADING
  ↓
SUCCESS
   or
ERROR
```

---

## 20. Loading State Rules

The `LOADING` state must display a skeleton placeholder.

The skeleton must:

- Use CSS animation.
- Represent expected content layout.
- Not display stale success content.
- Not display the error UI simultaneously.

---

## 21. Error State Rules

The `ERROR` state must:

- Display a human-readable error message.
- Provide a retry action.
- Include a semantic `<button>`.
- Retry the async operation safely.
- Transition back to `LOADING` when retrying.

Example label:

```text
Retry Connection
```

---

## 22. Workflow Protocol

Every task must follow the Lab 02 engineering workflow:

```text
1. Functional Slicing
2. Contract-First Specification
3. Atomic Generation
4. Independent Verification
```

### Functional Slicing

Break requirements into isolated sub-problems.

### Contract-First Specification

Define interfaces and contracts before implementation when applicable.

### Atomic Generation

Generate exactly one isolated sub-task at a time.

### Independent Verification

Verify generated code using:

```text
DevTools
console.assert
Git diff
manual interaction
```

---

## 23. AI Generation Rules

AI must never generate multiple unrelated sub-tasks in one response.

When requesting AI assistance:

- Provide one task.
- Verify the result.
- Commit the result.
- Continue to the next task.

Generated code must not be accepted without verification.

---

## 24. Manual Verification Rules

Every implementation task must include:

- A small manual test.
- Relevant `console.assert` checks.
- Edge cases that were handled.
- Known limitations.

A task is not considered complete until its output has been verified.

---

## 25. Security Verification

Unsafe-looking text must remain text.

Example:

```text
<img onerror=alert(1)> Safe Text
```

Verification:

```js
console.assert(
  paragraph.querySelector('img') === null,
  'Unsafe image element detected'
);
```

No executable `<img>` element should be created.

---

## 26. Event Verification

Delegated event architecture must be verified in DevTools.

Child controls should have zero direct listeners.

Expected:

```js
getEventListeners(button);
```

Result:

```text
{}
```

The root container should contain the delegated listeners.

---

## 27. Semantic Verification

The rendered Mini-React verification tree must avoid div soup.

Example:

```js
console.assert(
  root.querySelector('#root-view div') === null,
  'Div soup detected'
);
```

---

## 28. Git Workflow Rules

Use atomic Git commits for engineering milestones.

Required Exercise 1 commits:

```text
feat(core): implement createElement factory
feat(core): implement renderToDOM
```

Required Exercise 2 commits:

```text
feat(state): implement stateStore and resetCursor engine
feat(state): implement reactive useState dispatcher
feat(events): attach root event delegation listener
feat(ui): assemble reactive todo application
```

Do not combine unrelated implementation stages into one commit when they can be committed independently.

---

## 29. Mandatory Project Artifacts

The Lab project must include:

```text
project-rules.md
TASK_DECOMPOSITION.md
```

`TASK_DECOMPOSITION.md` defines the Work Breakdown Structure.

`project-rules.md` defines the engineering constraints that apply across all Lab 02 exercises.

---

## 30. Final Rule

RULE: Never prompt AI with more than 1 sub-task.
