import { $applyNodeReplacement, TextNode } from 'lexical';
export class DynamicContentNode extends TextNode {
    static getType() {
        return 'dynamicContent';
    }
    static clone(node) {
        return new DynamicContentNode(node.__text, node.__key);
    }
    static importJSON(serializedNode) {
        return $createDynamicContentNode().updateFromJSON(serializedNode);
    }
    createDOM(config) {
        const dom = super.createDOM(config);
        dom.style.cursor = 'default';
        dom.className = 'dynamicContent bg-blue-300 px-1 rounded';
        dom.innerText = 'Dynamic Content';
        dom.setAttribute('contenteditable', 'false');
        return dom;
    }
    updateDOM(prevNode, dom, config) {
        // Always keep the label as 'Dynamic Content'
        if (dom.innerText !== 'Dynamic Content') {
            dom.innerText = 'Dynamic Content';
        }
        return false; // Prevent Lexical from updating the DOM based on text changes
    }
    exportDOM() {
        const element = document.createElement('span');
        element.innerText = this.__text;
        return { element };
    }
    canInsertTextBefore() {
        return false;
    }
    canInsertTextAfter() {
        return false;
    }
    isTextEntity() {
        return true;
    }
    isToken() {
        return true;
    }
    isSimpleText() {
        return false;
    }
    isInline() {
        return true;
    }
    getMode() {
        return 'token';
    }
}
export function $createDynamicContentNode(dynamicContent = '') {
    return $applyNodeReplacement(new DynamicContentNode(dynamicContent));
}
export function $isDynamicContentNode(node) {
    return node instanceof DynamicContentNode;
}
