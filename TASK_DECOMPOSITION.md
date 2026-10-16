# Work Breakdown Structure (WBS) — Lab 02

> Break Lab 02 into isolated sub-tasks so each task can be implemented, verified, and committed independently.

---

## Sprint 1 — VNode + Mounting Engine

- [ ] Task 1.1: Define VNode and Props interfaces
  - **Input:** Mini-React Virtual DOM structure requirements.
  - **Output:** TypeScript contracts for `VNode`, `VNodeType`, and `Props`.
  - **Acceptance Criteria:** VNode must contain `type`, `props`, and `children`. Contracts must be explicit and must not allow mutation of received data.

- [ ] Task 1.2: Implement createTextElement
  - **Input:** Primitive values such as `string` or `number`.
  - **Output:** A normalized `TEXT_ELEMENT` VNode.
  - **Acceptance Criteria:** Primitive values are converted to text VNodes with a string `nodeValue` and an empty `children` array.

- [ ] Task 1.3: Implement createElement
  - **Input:** `type`, `props`, and variadic `children`.
  - **Output:** A new VNode representing the JSX structure.
  - **Acceptance Criteria:** Null props are handled safely, nested children are flattened, `null`, `undefined`, and `false` are removed, primitive children are converted with `createTextElement`, and input data is never mutated.

- [ ] Task 1.4: Implement renderToDOM
  - **Input:** A valid VNode.
  - **Output:** The corresponding real DOM node.
  - **Acceptance Criteria:** `TEXT_ELEMENT` uses `document.createTextNode`, native elements use `document.createElement`, props are assigned safely, children are rendered recursively, and dynamic content never uses `innerHTML`.

- [ ] Task 1.5: Build verification page and create atomic commits
  - **Input:** Completed `createTextElement`, `createElement`, and `renderToDOM`.
  - **Output:** A verification page using semantic HTML and a working mount test.
  - **Acceptance Criteria:** The real DOM matches the VNode tree, strings such as `<script>alert(1)</script>` are rendered as plain text, no orphan nodes exist, and the required commits are created:
    - `feat(core): implement createElement factory`
    - `feat(core): implement renderToDOM`

---

## Sprint 2 — Reactive State + Event Delegation

- [ ] Task 2.1: Implement stateStore and resetCursor
  - **Input:** Requirement for external hook state storage.
  - **Output:** `stateStore`, cursor tracking, and `resetCursor`.
  - **Acceptance Criteria:** State is stored by cursor position, the cursor can be reset before each render pass, and no implicit globals are used.

- [ ] Task 2.2: Implement useState
  - **Input:** `initialValue`, state store, cursor, and render callback.
  - **Output:** Custom `useState` returning `[state, setState]`.
  - **Acceptance Criteria:** The setter captures the correct cursor with a closure, functional updates are supported, rerendering occurs only when the value changes according to `Object.is`, and shared state objects are not mutated.

- [ ] Task 2.3: Implement root event delegation hub
  - **Input:** Root container and event handlers stored in VNode props.
  - **Output:** Root event delegation for supported events such as `click`, `input`, and `keydown`.
  - **Acceptance Criteria:** Event listeners are attached to the root instead of individual child elements, bubbling is used to resolve handlers, and no inline handlers, `keypress`, or `keyCode` are used.

- [ ] Task 2.4: Build reactive Task Manager
  - **Input:** Custom `useState`, renderer, and event delegation hub.
  - **Output:** A reactive Task Manager with dynamic task and filter state.
  - **Acceptance Criteria:** UI updates after state changes, new arrays or objects are created instead of mutating previous state, child buttons have no orphan listeners, and semantic HTML is used.

---

## Sprint 3 — Resilient State Machine

- [ ] Task 3.1: Define ViewState type
  - **Input:** Async data lifecycle requirements.
  - **Output:** TypeScript union type `ViewState<T>`.
  - **Acceptance Criteria:** State is restricted to `IDLE`, `LOADING`, `SUCCESS`, and `ERROR`; `SUCCESS` contains `data`; `ERROR` contains an error message.

- [ ] Task 3.2: Implement DataFeed with skeleton and retry
  - **Input:** `ViewState`, `useState`, and an async data source.
  - **Output:** A `DataFeed` component with loading skeleton, success content, error feedback, and retry support.
  - **Acceptance Criteria:** Async operations follow `IDLE → LOADING → SUCCESS/ERROR`, `LOADING` renders a skeleton, `ERROR` renders a human-readable message and a `Retry Connection` button, retry starts the loading process again, and conflicting UI states cannot exist.

---

RULE: Never prompt AI with more than 1 sub-task.