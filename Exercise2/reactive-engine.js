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

/**
 * Attaches one delegated listener per supported event type to the root container.
 */
export function setupEventDelegation(rootContainer) {
  const supportedEvents = ['click', 'input', 'keydown'];

  supportedEvents.forEach((eventType) => {
    rootContainer.addEventListener(eventType, (nativeEvent) => {
      let target = nativeEvent.target;

      const handlerProp =
        `on${eventType.charAt(0).toUpperCase()}${eventType.slice(1)}`;

      while (target && target !== rootContainer) {
        const handler = target.__vnode?.props?.[handlerProp];

        if (typeof handler === 'function') {
          handler(nativeEvent);
          break;
        }

        target = target.parentNode;
      }
    });
  });
}