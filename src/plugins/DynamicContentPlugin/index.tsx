import type {JSX} from 'react';
import {useCallback, useEffect} from 'react';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$getSelection, $isRangeSelection, RangeSelection, TextNode} from 'lexical';
import {$createDynamicContentNode, DynamicContentNode} from '../../nodes/DynamicContentNode';
import {useLexicalTextEntity} from '@lexical/react/useLexicalTextEntity';


// const DYNAMIC_CONTENT_REGEX = /(^|[^A-Za-z0-9_])(\{\{([^}]+)\}\})/i;
const DYNAMIC_CONTENT_REGEX = /(\{\{([^}]+)\}\})/i;
export default function DynamicContentsPlugin(): JSX.Element | null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([DynamicContentNode])) {
            throw new Error('DynamicContentsPlugin: DynamicContentNode not registered on editor');
        }

        // Register a node transform to move the selection after the node
        return editor.registerNodeTransform(DynamicContentNode, (node) => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                if (selection.anchor.key === node.getKey() || selection.focus.key === node.getKey()) {
                    node.selectNext();
                }
            }
        });
    }, [editor]);

    const $createDynamicContentNode_ = useCallback((textNode: TextNode): DynamicContentNode => {
        return $createDynamicContentNode(textNode.getTextContent());
    }, []);

    const getDynamicContentMatch = useCallback((text: string) => {
        const matchArr = DYNAMIC_CONTENT_REGEX.exec(text); // Adding a space to ensure the regex matches at the end of the string

        if (matchArr === null) {
            return null;
        }

        const startOffset = matchArr.index;
        const endOffset = startOffset + matchArr[1].length;
        if (
            startOffset < 0 ||
            endOffset > text.length ||
            startOffset >= endOffset
        ) {
            return null;
        }
        return {
            start: startOffset,
            end: endOffset,
        };
    }, []);


    useLexicalTextEntity<DynamicContentNode>(
        getDynamicContentMatch,
        DynamicContentNode,
        $createDynamicContentNode_
    );

    return null;
}
