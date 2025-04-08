/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { addClassNamesToElement } from '@lexical/utils';
import { $applyNodeReplacement, TextNode } from 'lexical';
/** @noInheritDoc */
export class SpecialTextNode extends TextNode {
    static getType() {
        return 'specialText';
    }
    static clone(node) {
        return new SpecialTextNode(node.__text, node.__key);
    }
    createDOM(config) {
        const dom = document.createElement('span');
        addClassNamesToElement(dom, config.theme.specialText);
        dom.textContent = this.getTextContent();
        return dom;
    }
    updateDOM(prevNode, dom, config) {
        if (prevNode.__text.startsWith('[') && prevNode.__text.endsWith(']')) {
            const strippedText = this.__text.substring(1, this.__text.length - 1); // Strip brackets again
            dom.textContent = strippedText; // Update the text content
        }
        addClassNamesToElement(dom, config.theme.specialText);
        return false;
    }
    static importJSON(serializedNode) {
        return $createSpecialTextNode().updateFromJSON(serializedNode);
    }
    isTextEntity() {
        return true;
    }
    canInsertTextAfter() {
        return false; // Prevents appending text to this node
    }
}
/**
 * Creates a SpecialTextNode with the given text.
 * @param text - Text content for the SpecialTextNode.
 * @returns A new SpecialTextNode instance.
 */
export function $createSpecialTextNode(text = '') {
    return $applyNodeReplacement(new SpecialTextNode(text));
}
/**
 * Checks if a node is a SpecialTextNode.
 * @param node - Node to check.
 * @returns True if the node is a SpecialTextNode.
 */
export function $isSpecialTextNode(node) {
    return node instanceof SpecialTextNode;
}
