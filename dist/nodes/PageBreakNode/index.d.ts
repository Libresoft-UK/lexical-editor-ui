/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { JSX } from 'react';
import './index.css';
import { DecoratorNode, DOMConversionMap, LexicalNode, SerializedLexicalNode } from 'lexical';
export type SerializedPageBreakNode = SerializedLexicalNode;
export declare class PageBreakNode extends DecoratorNode<JSX.Element> {
    static getType(): string;
    static clone(node: PageBreakNode): PageBreakNode;
    static importJSON(serializedNode: SerializedPageBreakNode): PageBreakNode;
    static importDOM(): DOMConversionMap | null;
    createDOM(): HTMLElement;
    getTextContent(): string;
    isInline(): false;
    updateDOM(): boolean;
    decorate(): JSX.Element;
}
export declare function $createPageBreakNode(): PageBreakNode;
export declare function $isPageBreakNode(node: LexicalNode | null | undefined): node is PageBreakNode;
