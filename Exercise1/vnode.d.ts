export type VNodeType = string | ((props: any) => VNode);

export interface VNode {
  readonly type: VNodeType;
  readonly props: {
    [key: string]: any;
    children: VNode[];
    nodeValue?: string;
  };
}

/**
 * `TEXT_ELEMENT` is a reserved VNode type used to represent text nodes.
 * Primitive text values are normalized into VNodes whose `type` is
 * `"TEXT_ELEMENT"` and whose text content is stored in `props.nodeValue`.
 *
 * This file defines the type contract only and contains no implementation.
 */