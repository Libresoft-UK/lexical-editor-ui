
import type {EditorConfig, LexicalNode, SerializedTextNode, SerializedLexicalNode, DOMExportOutput, NodeKey, LexicalEditor} from 'lexical';

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
        // get the default dom element from TextNode
        const dom = super.createDOM(config);

        // create a span to hold the token
        let token = document.createElement('span');
        // token.style.userSelect = 'none';
        token.style.pointerEvents = 'none';
        token.style.cursor = 'default';
        token.className = "dynamicContent bg-blue-300 text-white pr-1 m-1 rounded before:content-['➲'] before:bg-black before:text-white before:px-1 before:rounded-l before:me-1";
        token.innerText = this.getLabel();
        token.setAttribute('contenteditable', 'false');

        // clear existing dom content and append the token
        dom.textContent = '';
        dom.appendChild(token);
        return dom;
    }

    updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
        return super.updateDOM(prevNode, dom, config);
    }

    exportDOM(editor: LexicalEditor): DOMExportOutput {
        // Let the superclass produce the element so any character-level styles/formatting are preserved.
        const output = super.exportDOM(editor);
        const {element} = output;

        if (element == null) {
            return output;
        }

        const el = element as HTMLElement;

        //find and replace the dynamicContent span with its label text
        const dynamicContentSpan = el.querySelector('span.dynamicContent');
        if (dynamicContentSpan) {
            dynamicContentSpan.replaceWith(this.__text);
        }

        return {element: element};
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
