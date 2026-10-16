const stateStore = [];
let cursor = 0;
let triggerRender = () => {};

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