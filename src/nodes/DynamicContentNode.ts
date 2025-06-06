
import type {EditorConfig, LexicalNode, SerializedTextNode, SerializedLexicalNode, DOMExportOutput, NodeKey} from 'lexical';

import {$applyNodeReplacement, TextNode, LexicalUpdateJSON} from 'lexical';

interface serializedDynamicContentNode extends SerializedTextNode {
    label?: string;
}

export interface DynamicContentPayload {
    text: string;
    label: string;
    key?: NodeKey;
}

export class DynamicContentNode extends TextNode {

    __label: string = 'Dynamic Content';

    constructor(text?: string, label?: string, key?: NodeKey,) {
        super(text, key);
        if (label){
            this.__label = label;
        }
    }

    static getType(): string {
        return 'dynamicContent';
    }

    setLabel(label: string): this {
        const self = this.getWritable();
        self.__label = label;
        return self;
    }

    getLabel(): string {
        const self = this.getLatest();
        return self.__label;
    }

    static clone(node: DynamicContentNode): DynamicContentNode {
        return new DynamicContentNode(node.__text, node.__label, node.__key, );
    }

    static importJSON(serializedNode: SerializedLexicalNode): DynamicContentNode {
        return new DynamicContentNode().updateFromJSON(
            serializedNode as unknown as LexicalUpdateJSON<serializedDynamicContentNode>
        );
    }

    updateFromJSON(
        serializedNode: LexicalUpdateJSON<serializedDynamicContentNode>
    ): this {
        const self = super.updateFromJSON(serializedNode);
        return typeof serializedNode.label === 'string'
            ? self.setLabel(serializedNode.label)
            : self;
    }

    exportJSON(): serializedDynamicContentNode {
        const serializedNode: serializedDynamicContentNode = super.exportJSON();
        const label = this.getLabel();
        if (label !== '') {
            serializedNode.label = label;
        }
        return serializedNode;
    }

    createDOM(config: EditorConfig): HTMLElement {
        const dom = super.createDOM(config);
        dom.style.cursor = 'default';
        dom.className = "dynamicContent bg-blue-300 text-white pr-1 rounded before:content-['➲'] before:bg-black before:text-white before:px-1 before:rounded-l before:me-1";
        dom.innerText = this.getLabel();
        dom.setAttribute('contenteditable', 'false');
        return dom;
    }

    updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
        return true;
    }

    exportDOM(): DOMExportOutput {
        const element = document.createTextNode(this.__text);
        return {element};
    }

    canInsertTextBefore(): boolean {
        return false;
    }

    canInsertTextAfter(): boolean {
        return false;
    }

    isTextEntity(): boolean {
        return true;
    }

    isToken(): boolean {
        return true;
    }

    isSimpleText(): boolean {
        return false;
    }

    isInline(): true {
        return true;
    }

    getMode(): 'segmented' | 'token' {
        return 'token';
    }
}

export function $createDynamicContentNode({text = '', label = ''} : DynamicContentPayload): DynamicContentNode {
    return $applyNodeReplacement(new DynamicContentNode(text, label));
}

export function $isDynamicContentNode(node: LexicalNode | null | undefined): node is DynamicContentNode {
    return node instanceof DynamicContentNode;
}
