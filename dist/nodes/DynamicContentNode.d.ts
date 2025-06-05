import type { EditorConfig, LexicalNode, SerializedTextNode, DOMExportOutput } from 'lexical';
import { TextNode } from 'lexical';
export type SerializedDynamicContentNode = SerializedTextNode;
export declare class DynamicContentNode extends TextNode {
    static getType(): string;
    static clone(node: DynamicContentNode): DynamicContentNode;
    static importJSON(serializedNode: SerializedDynamicContentNode): DynamicContentNode;
    createDOM(config: EditorConfig): HTMLElement;
    updateDOM(prevNode: DynamicContentNode, dom: HTMLElement, config: EditorConfig): boolean;
    exportDOM(): DOMExportOutput;
    canInsertTextBefore(): boolean;
    canInsertTextAfter(): boolean;
    isTextEntity(): boolean;
    isToken(): boolean;
    isSimpleText(): boolean;
    isInline(): true;
    getMode(): 'segmented' | 'token';
}
export declare function $createDynamicContentNode(dynamicContent?: string): DynamicContentNode;
export declare function $isDynamicContentNode(node: LexicalNode | null | undefined): boolean;
