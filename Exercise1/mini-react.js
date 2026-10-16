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

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

/**
 * Converts a VNode tree into real DOM nodes.
 */
export function renderToDOM(vNode) {
  return renderVNode(vNode, false);
}

function renderVNode(vNode, insideSvg) {
  if (typeof vNode.type === 'function') {
    const componentVNode = vNode.type(vNode.props);
    return renderVNode(componentVNode, insideSvg);
  }

  if (vNode.type === 'TEXT_ELEMENT') {
    const dom = document.createTextNode(vNode.props.nodeValue);
    dom.__vnode = vNode;
    return dom;
  }

  const isSvg = insideSvg || vNode.type === 'svg';

  const dom = isSvg
    ? document.createElementNS(SVG_NAMESPACE, vNode.type)
    : document.createElement(vNode.type);

  dom.__vnode = vNode;

  Object.entries(vNode.props).forEach(([name, value]) => {
    if (name === 'children' || name === 'nodeValue') {
      return;
    }

  if (name.startsWith('on') && typeof value === 'function') {
  return;
}

    if (name === 'className') {
      if (isSvg) {
        dom.setAttribute('class', value);
      } else {
        dom.className = value;
      }
      return;
    }

    if (name === 'style' && typeof value === 'object' && value !== null) {
      Object.assign(dom.style, value);
      return;
    }

    if (value !== null && value !== undefined) {
      dom.setAttribute(name, String(value));
    }
  });

  vNode.props.children.forEach((child) => {
    dom.appendChild(renderVNode(child, isSvg));
  });

  return dom;
}