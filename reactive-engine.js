const stateStore = [];
let cursor = 0;
let triggerRender = () => {};
let renderQueued = false;

/**
 * Resets the hook cursor before a new render pass.
 */
export function resetCursor() {
  cursor = 0;
}

/**
 * Registers the root rerender callback.
 */
export function setRenderer(fn) {
  triggerRender = fn;
}

/**
 * Stores state by hook position and returns the state with its setter.
 */
export function useState(initialValue) {
  const currentCursor = cursor;

  if (!(currentCursor in stateStore)) {
    stateStore[currentCursor] = initialValue;
  }

  const setState = (nextValue) => {
    const previousValue = stateStore[currentCursor];

    const resolvedValue =
      typeof nextValue === 'function'
        ? nextValue(previousValue)
        : nextValue;

    if (Object.is(previousValue, resolvedValue)) {
      return;
    }

    stateStore[currentCursor] = resolvedValue;

    if (!renderQueued) {
      renderQueued = true;

      queueMicrotask(() => {
        renderQueued = false;
        triggerRender();
      });
    }
  };

  cursor += 1;

  return [stateStore[currentCursor], setState];
}