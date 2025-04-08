/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { DOMConversionMap, EditorConfig, LexicalNode, SerializedElementNode } from 'lexical';
import { ElementNode } from 'lexical';
export type SerializedLayoutItemNode = SerializedElementNode;
export declare class LayoutItemNode extends ElementNode {
    static getType(): string;
    static clone(node: LayoutItemNode): LayoutItemNode;
    createDOM(config: EditorConfig): HTMLElement;
    updateDOM(): boolean;
    static importDOM(): DOMConversionMap | null;
    static importJSON(serializedNode: SerializedLayoutItemNode): LayoutItemNode;
    isShadowRoot(): boolean;
}
export declare function $createLayoutItemNode(): LayoutItemNode;
export declare function $isLayoutItemNode(node: LexicalNode | null | undefined): node is LayoutItemNode;
