
import type {EditorConfig, LexicalNode, SerializedTextNode, DOMExportOutput} from 'lexical';

import {$applyNodeReplacement, TextNode} from 'lexical';
import {useDynamicContent} from "../context/DynamicContentContext";

export type SerializedDynamicContentNode = SerializedTextNode;

export class DynamicContentNode extends TextNode {

    static getType(): string {
        return 'dynamicContent';
    }

    static clone(node: DynamicContentNode): DynamicContentNode {
        return new DynamicContentNode(node.__text, node.__key);
    }

    static importJSON(serializedNode: SerializedDynamicContentNode): DynamicContentNode {
        return $createDynamicContentNode().updateFromJSON(serializedNode);
    }

    createDOM(config: EditorConfig): HTMLElement {
        const dom = super.createDOM(config);
        dom.style.cursor = 'default';
        dom.className = 'dynamicContent bg-blue-300 px-1 rounded';
        dom.innerText = 'Dynamic Content';
        dom.setAttribute('contenteditable', 'false');
        return dom;
    }

    updateDOM(prevNode: DynamicContentNode, dom: HTMLElement, config: EditorConfig): boolean {
        // Always keep the label as 'Dynamic Content'
        if (dom.innerText !== 'Dynamic Content') {
            dom.innerText = 'Dynamic Content';
        }
        return false; // Prevent Lexical from updating the DOM based on text changes
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement('span');
        element.innerText = this.__text;
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

export function $createDynamicContentNode(dynamicContent: string = ''): DynamicContentNode {
    return $applyNodeReplacement(new DynamicContentNode(dynamicContent));
}

export function $isDynamicContentNode(node: LexicalNode | null | undefined): boolean {
    return node instanceof DynamicContentNode;
}
