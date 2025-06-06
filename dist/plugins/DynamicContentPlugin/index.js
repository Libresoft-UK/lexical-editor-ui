import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, $createParagraphNode, $isRootOrShadowRoot, $insertNodes, createCommand, COMMAND_PRIORITY_EDITOR } from 'lexical';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import { $createDynamicContentNode, DynamicContentNode } from '../../nodes/DynamicContentNode';
import { useLexicalTextEntity } from '@lexical/react/useLexicalTextEntity';
import { useDynamicContent } from "../../context/DynamicContentContext";
import Button from "../../ui/Button";
export const INSERT_DYNAMIC_CONTENT_COMMAND = createCommand('INSERT_DYNAMIC_CONTENT_COMMAND');
// const DYNAMIC_CONTENT_REGEX = /(^|[^A-Za-z0-9_])(\{\{([^}]+)\}\})/i;
const DYNAMIC_CONTENT_REGEX = /(\{\{([^}]+)\}\})/i;
export default function DynamicContentsPlugin() {
    const [editor] = useLexicalComposerContext();
    const { getDynamicContentBySlug } = useDynamicContent();
    useEffect(() => {
        if (!editor.hasNodes([DynamicContentNode])) {
            throw new Error('DynamicContentsPlugin: DynamicContentNode not registered on editor');
        }
        // Register a node transform to move the selection after the node
        return mergeRegister(editor.registerNodeTransform(DynamicContentNode, (node) => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                if (selection.anchor.key === node.getKey() || selection.focus.key === node.getKey()) {
                    node.selectNext();
                }
            }
        }), editor.registerCommand(INSERT_DYNAMIC_CONTENT_COMMAND, (payload) => {
            const dcNode = $createDynamicContentNode(payload);
            $insertNodes([dcNode]);
            if ($isRootOrShadowRoot(dcNode.getParentOrThrow())) {
                $wrapNodeInElement(dcNode, $createParagraphNode).selectEnd();
            }
            return true;
        }, COMMAND_PRIORITY_EDITOR));
    }, [editor]);
    const $createDynamicContentNode_ = useCallback((textNode) => {
        const label = getDynamicContentBySlug(textNode.getTextContent());
        return $createDynamicContentNode({ text: textNode.getTextContent(), label: label });
    }, []);
    const getDynamicContentMatch = useCallback((text) => {
        const matchArr = DYNAMIC_CONTENT_REGEX.exec(text);
        if (matchArr === null) {
            return null;
        }
        const startOffset = matchArr.index;
        const endOffset = startOffset + matchArr[1].length;
        if (startOffset < 0 ||
            endOffset > text.length ||
            startOffset >= endOffset) {
            return null;
        }
        return {
            start: startOffset,
            end: endOffset,
        };
    }, []);
    useLexicalTextEntity(getDynamicContentMatch, DynamicContentNode, $createDynamicContentNode_);
    return null;
}
export function InsertDynamicContentDialog({ activeEditor, onClose, }) {
    const { options } = useDynamicContent();
    return (_jsx(_Fragment, { children: options.map((dcoption, index) => (_jsx(InsertDCNestedRow, { dcoption: dcoption, onClick: (payload) => {
                activeEditor.dispatchCommand(INSERT_DYNAMIC_CONTENT_COMMAND, payload);
                onClose();
            } }, index))) }));
}
function InsertDCNestedRow({ dcoption, onClick, parentSlug = '' }) {
    const { getDynamicContentBySlug } = useDynamicContent();
    const slug = parentSlug ? `${parentSlug}.${dcoption.slug}` : dcoption.slug;
    const hasOptions = dcoption?.options && dcoption?.options !== undefined && dcoption.options.length > 0;
    // get only options that have no nested options
    const finalOptions = hasOptions && dcoption.options.filter((option) => {
        return !option?.options || option.options.length === 0;
    });
    // get only options that have nested options
    const nestedOptions = hasOptions && dcoption.options.filter((option) => {
        return option?.options && option.options.length > 0;
    });
    return _jsx(_Fragment, { children: hasOptions ? (_jsxs("div", { className: 'flex flex-col gap-1', children: [_jsx("div", { children: _jsx("span", { className: 'text-sm font-semibold', children: dcoption.label }) }), finalOptions && finalOptions.length > 0 && _jsx("div", { className: 'flex flex-row gap-1 pl-4', children: finalOptions.map((option, index) => (_jsx(InsertDCNestedRow, { dcoption: option, onClick: onClick, parentSlug: slug }, index))) }), nestedOptions && nestedOptions.length > 0 && _jsx("div", { className: 'flex flex-col gap-1 pl-4', children: nestedOptions.sort((a, b) => {
                        const aCount = a.options ? a.options.length : 0;
                        const bCount = b.options ? b.options.length : 0;
                        return aCount - bCount;
                    }).map((option, index) => (_jsx(InsertDCNestedRow, { dcoption: option, onClick: onClick, parentSlug: slug }, index))) })] })) : (_jsx(Button, { onClick: () => onClick({ text: `{{${slug}}}`, label: getDynamicContentBySlug(slug) }), children: dcoption.label })) });
}
