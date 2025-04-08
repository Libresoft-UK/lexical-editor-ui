/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { DOMConversionMap, DOMExportOutput, EditorConfig, LexicalEditor, LexicalNode, LexicalUpdateJSON, NodeKey, SerializedEditor, SerializedLexicalNode, Spread } from 'lexical';
import type { JSX } from 'react';
import { DecoratorNode } from 'lexical';
export type Position = 'left' | 'right' | 'full' | undefined;
export interface InlineImagePayload {
    altText: string;
    caption?: LexicalEditor;
    height?: number;
    key?: NodeKey;
    showCaption?: boolean;
    src: string;
    width?: number;
    position?: Position;
}
export interface UpdateInlineImagePayload {
    altText?: string;
    showCaption?: boolean;
    position?: Position;
}
export type SerializedInlineImageNode = Spread<{
    altText: string;
    caption: SerializedEditor;
    height?: number;
    showCaption: boolean;
    src: string;
    width?: number;
    position?: Position;
}, SerializedLexicalNode>;
export declare class InlineImageNode extends DecoratorNode<JSX.Element> {
    __src: string;
    __altText: string;
    __width: 'inherit' | number;
    __height: 'inherit' | number;
    __showCaption: boolean;
    __caption: LexicalEditor;
    __position: Position;
    static getType(): string;
    static clone(node: InlineImageNode): InlineImageNode;
    static importJSON(serializedNode: SerializedInlineImageNode): InlineImageNode;
    updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedInlineImageNode>): this;
    static importDOM(): DOMConversionMap | null;
    constructor(src: string, altText: string, position: Position, width?: 'inherit' | number, height?: 'inherit' | number, showCaption?: boolean, caption?: LexicalEditor, key?: NodeKey);
    exportDOM(): DOMExportOutput;
    exportJSON(): SerializedInlineImageNode;
    getSrc(): string;
    getAltText(): string;
    setAltText(altText: string): void;
    setWidthAndHeight(width: 'inherit' | number, height: 'inherit' | number): void;
    getShowCaption(): boolean;
    setShowCaption(showCaption: boolean): void;
    getPosition(): Position;
    setPosition(position: Position): void;
    update(payload: UpdateInlineImagePayload): void;
    createDOM(config: EditorConfig): HTMLElement;
    updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): false;
    decorate(): JSX.Element;
}
export declare function $createInlineImageNode({ altText, position, height, src, width, showCaption, caption, key, }: InlineImagePayload): InlineImageNode;
export declare function $isInlineImageNode(node: LexicalNode | null | undefined): node is InlineImageNode;
