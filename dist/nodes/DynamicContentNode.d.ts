import type { EditorConfig, LexicalNode, SerializedTextNode, SerializedLexicalNode, DOMExportOutput, NodeKey, LexicalEditor } from 'lexical';
import { TextNode, LexicalUpdateJSON } from 'lexical';
interface serializedDynamicContentNode extends SerializedTextNode {
    label?: string;
}
export interface DynamicContentPayload {
    text: string;
    label: string;
    key?: NodeKey;
}
export declare class DynamicContentNode extends TextNode {
    __label: string;
    constructor(text?: string, label?: string, key?: NodeKey);
    static getType(): string;
    setLabel(label: string): this;
    getLabel(): string;
    static clone(node: DynamicContentNode): DynamicContentNode;
    static importJSON(serializedNode: SerializedLexicalNode): DynamicContentNode;
    updateFromJSON(serializedNode: LexicalUpdateJSON<serializedDynamicContentNode>): this;
    exportJSON(): serializedDynamicContentNode;
    createDOM(config: EditorConfig): HTMLElement;
    updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean;
    exportDOM(editor: LexicalEditor): DOMExportOutput;
    canInsertTextBefore(): boolean;
    canInsertTextAfter(): boolean;
    isTextEntity(): boolean;
    isToken(): boolean;
    isSimpleText(): boolean;
    isInline(): true;
    getMode(): 'segmented' | 'token';
}
export declare function $createDynamicContentNode({ text, label }: DynamicContentPayload): DynamicContentNode;
export declare function $isDynamicContentNode(node: LexicalNode | null | undefined): node is DynamicContentNode;
export {};
