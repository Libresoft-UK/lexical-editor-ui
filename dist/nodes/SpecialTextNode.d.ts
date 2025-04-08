/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { EditorConfig, LexicalNode, SerializedTextNode } from 'lexical';
import { TextNode } from 'lexical';
/** @noInheritDoc */
export declare class SpecialTextNode extends TextNode {
    static getType(): string;
    static clone(node: SpecialTextNode): SpecialTextNode;
    createDOM(config: EditorConfig): HTMLElement;
    updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean;
    static importJSON(serializedNode: SerializedTextNode): SpecialTextNode;
    isTextEntity(): true;
    canInsertTextAfter(): boolean;
}
/**
 * Creates a SpecialTextNode with the given text.
 * @param text - Text content for the SpecialTextNode.
 * @returns A new SpecialTextNode instance.
 */
export declare function $createSpecialTextNode(text?: string): SpecialTextNode;
/**
 * Checks if a node is a SpecialTextNode.
 * @param node - Node to check.
 * @returns True if the node is a SpecialTextNode.
 */
export declare function $isSpecialTextNode(node: LexicalNode | null | undefined): node is SpecialTextNode;
