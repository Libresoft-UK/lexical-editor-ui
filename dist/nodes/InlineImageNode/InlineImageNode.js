import { jsx as _jsx } from "react/jsx-runtime";
import { addClassNamesToElement, removeClassNamesFromElement, } from '@lexical/utils';
import { $applyNodeReplacement, createEditor, DecoratorNode, isHTMLElement, } from 'lexical';
import * as React from 'react';
const InlineImageComponent = React.lazy(() => import('./InlineImageComponent'));
function $convertInlineImageElement(domNode) {
    if (isHTMLElement(domNode) && domNode.nodeName === 'IMG') {
        const { alt: altText, src, width, height } = domNode;
        const node = $createInlineImageNode({ altText, height, src, width });
        return { node };
    }
    return null;
}
function getPositionClass(position) {
    return typeof position === 'string' ? `position-${position}` : undefined;
}
export class InlineImageNode extends DecoratorNode {
    __src;
    __altText;
    __width;
    __height;
    __showCaption;
    __caption;
    __position;
    static getType() {
        return 'inline-image';
    }
    static clone(node) {
        return new InlineImageNode(node.__src, node.__altText, node.__position, node.__width, node.__height, node.__showCaption, node.__caption, node.__key);
    }
    static importJSON(serializedNode) {
        const { altText, height, width, src, showCaption, position } = serializedNode;
        return $createInlineImageNode({
            altText,
            height,
            position,
            showCaption,
            src,
            width,
        }).updateFromJSON(serializedNode);
    }
    updateFromJSON(serializedNode) {
        const { caption } = serializedNode;
        const node = super.updateFromJSON(serializedNode);
        const nestedEditor = node.__caption;
        const editorState = nestedEditor.parseEditorState(caption.editorState);
        if (!editorState.isEmpty()) {
            nestedEditor.setEditorState(editorState);
        }
        return node;
    }
    static importDOM() {
        return {
            img: (node) => ({
                conversion: $convertInlineImageElement,
                priority: 0,
            }),
        };
    }
    constructor(src, altText, position, width, height, showCaption, caption, key) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__width = width || 'inherit';
        this.__height = height || 'inherit';
        this.__showCaption = showCaption || false;
        this.__caption = caption || createEditor();
        this.__position = position;
    }
    exportDOM() {
        const element = document.createElement('img');
        element.setAttribute('src', this.__src);
        element.setAttribute('alt', this.__altText);
        element.setAttribute('width', this.__width.toString());
        element.setAttribute('height', this.__height.toString());
        return { element };
    }
    exportJSON() {
        return {
            ...super.exportJSON(),
            altText: this.getAltText(),
            caption: this.__caption.toJSON(),
            height: this.__height === 'inherit' ? 0 : this.__height,
            position: this.__position,
            showCaption: this.__showCaption,
            src: this.getSrc(),
            width: this.__width === 'inherit' ? 0 : this.__width,
        };
    }
    getSrc() {
        return this.__src;
    }
    getAltText() {
        return this.__altText;
    }
    setAltText(altText) {
        const writable = this.getWritable();
        writable.__altText = altText;
    }
    setWidthAndHeight(width, height) {
        const writable = this.getWritable();
        writable.__width = width;
        writable.__height = height;
    }
    getShowCaption() {
        return this.__showCaption;
    }
    setShowCaption(showCaption) {
        const writable = this.getWritable();
        writable.__showCaption = showCaption;
    }
    getPosition() {
        return this.__position;
    }
    setPosition(position) {
        const writable = this.getWritable();
        writable.__position = position;
    }
    update(payload) {
        const writable = this.getWritable();
        const { altText, showCaption, position } = payload;
        if (altText !== undefined) {
            writable.__altText = altText;
        }
        if (showCaption !== undefined) {
            writable.__showCaption = showCaption;
        }
        if (position !== undefined) {
            writable.__position = position;
        }
    }
    // View
    createDOM(config) {
        const span = document.createElement('span');
        for (const cls of [
            config.theme.inlineImage,
            getPositionClass(this.__position),
        ]) {
            if (cls) {
                addClassNamesToElement(span, cls);
            }
        }
        return span;
    }
    updateDOM(prevNode, dom, config) {
        const position = this.__position;
        if (position !== prevNode.__position) {
            removeClassNamesFromElement(dom, getPositionClass(prevNode.__position));
            addClassNamesToElement(dom, getPositionClass(position));
        }
        return false;
    }
    decorate() {
        return (_jsx(InlineImageComponent, { src: this.__src, altText: this.__altText, width: this.__width, height: this.__height, nodeKey: this.getKey(), showCaption: this.__showCaption, caption: this.__caption, position: this.__position }));
    }
}
export function $createInlineImageNode({ altText, position, height, src, width, showCaption, caption, key, }) {
    return $applyNodeReplacement(new InlineImageNode(src, altText, position, width, height, showCaption, caption, key));
}
export function $isInlineImageNode(node) {
    return node instanceof InlineImageNode;
}
