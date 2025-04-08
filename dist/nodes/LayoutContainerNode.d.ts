/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { DOMConversionMap, DOMExportOutput, EditorConfig, LexicalNode, LexicalUpdateJSON, NodeKey, SerializedElementNode, Spread } from 'lexical';
import { ElementNode } from 'lexical';
export type SerializedLayoutContainerNode = Spread<{
    templateColumns: string;
}, SerializedElementNode>;
export declare class LayoutContainerNode extends ElementNode {
    __templateColumns: string;
    constructor(templateColumns: string, key?: NodeKey);
    static getType(): string;
    static clone(node: LayoutContainerNode): LayoutContainerNode;
    createDOM(config: EditorConfig): HTMLElement;
    exportDOM(): DOMExportOutput;
    updateDOM(prevNode: this, dom: HTMLElement): boolean;
    static importDOM(): DOMConversionMap | null;
    static importJSON(json: SerializedLayoutContainerNode): LayoutContainerNode;
    updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedLayoutContainerNode>): this;
    isShadowRoot(): boolean;
    canBeEmpty(): boolean;
    exportJSON(): SerializedLayoutContainerNode;
    getTemplateColumns(): string;
    setTemplateColumns(templateColumns: string): this;
}
export declare function $createLayoutContainerNode(templateColumns?: string): LayoutContainerNode;
export declare function $isLayoutContainerNode(node: LexicalNode | null | undefined): node is LayoutContainerNode;
