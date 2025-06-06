import { $applyNodeReplacement, TextNode } from 'lexical';
export class DynamicContentNode extends TextNode {
    __label = 'Dynamic Content';
    constructor(text, label, key) {
        super(text, key);
        if (label) {
            this.__label = label;
        }
    }
    static getType() {
        return 'dynamicContent';
    }
    setLabel(label) {
        const self = this.getWritable();
        self.__label = label;
        return self;
    }
    getLabel() {
        const self = this.getLatest();
        return self.__label;
    }
    static clone(node) {
        return new DynamicContentNode(node.__text, node.__label, node.__key);
    }
    static importJSON(serializedNode) {
        return new DynamicContentNode().updateFromJSON(serializedNode);
    }
    updateFromJSON(serializedNode) {
        const self = super.updateFromJSON(serializedNode);
        return typeof serializedNode.label === 'string'
            ? self.setLabel(serializedNode.label)
            : self;
    }
    exportJSON() {
        const serializedNode = super.exportJSON();
        const label = this.getLabel();
        if (label !== '') {
            serializedNode.label = label;
        }
        return serializedNode;
    }
    createDOM(config) {
        const dom = super.createDOM(config);
        dom.style.cursor = 'default';
        dom.className = "dynamicContent bg-blue-300 text-white pr-1 rounded before:content-['➲'] before:bg-black before:text-white before:px-1 before:rounded-l before:me-1";
        dom.innerText = this.getLabel();
        dom.setAttribute('contenteditable', 'false');
        return dom;
    }
    updateDOM(prevNode, dom, config) {
        return true;
    }
    exportDOM() {
        const element = document.createTextNode(this.__text);
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
export function $createDynamicContentNode({ text = '', label = '' }) {
    return $applyNodeReplacement(new DynamicContentNode(text, label));
}
export function $isDynamicContentNode(node) {
    return node instanceof DynamicContentNode;
}
