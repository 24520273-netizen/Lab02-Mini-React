/**
 * Creates an immutable VNode for primitive text content.
 */
export function createTextElement(text) {
  const props = Object.freeze({
    nodeValue: String(text),
    children: [],
  });

  return Object.freeze({
    type: 'TEXT_ELEMENT',
    props,
  });
}

/**
 * Creates an immutable VNode from a type, props, and explicit children.
 */
export function createElement(type, props, ...children) {
  const { children: _ignoredChildren, ...safeProps } = props ?? {};

  const normalizedChildren = children
    .flat(Infinity)
    .filter(
      (child) =>
        child !== null &&
        child !== undefined &&
        child !== true &&
        child !== false
    )
    .map((child) =>
      typeof child === 'string' || typeof child === 'number'
        ? createTextElement(child)
        : child
    );

  const vnodeProps = Object.freeze({
    ...safeProps,
    children: normalizedChildren,
  });

  return Object.freeze({
    type,
    props: vnodeProps,
  });
}

