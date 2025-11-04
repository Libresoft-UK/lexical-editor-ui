import {JSX, useRef, useState} from 'react';
import {useCallback, useEffect} from 'react';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$getSelection, $isRangeSelection, $createParagraphNode, $isRootOrShadowRoot, $insertNodes, TextNode, LexicalEditor, LexicalCommand, createCommand, COMMAND_PRIORITY_EDITOR} from 'lexical';
import {$wrapNodeInElement, mergeRegister} from '@lexical/utils';
import {$createDynamicContentNode, DynamicContentNode, DynamicContentPayload} from '../../nodes/DynamicContentNode';
import {useLexicalTextEntity} from '@lexical/react/useLexicalTextEntity';
import {DCOption, useDynamicContent} from "../../context/DynamicContentContext";
import Button from "../../ui/Button";
import * as React from "react";

export type InsertDynamicContentPayload = Readonly<DynamicContentPayload>;

export const INSERT_DYNAMIC_CONTENT_COMMAND: LexicalCommand<InsertDynamicContentPayload> =
    createCommand('INSERT_DYNAMIC_CONTENT_COMMAND');


// const DYNAMIC_CONTENT_REGEX = /(^|[^A-Za-z0-9_])(\{\{([^}]+)\}\})/i;
const DYNAMIC_CONTENT_REGEX = /(\{\{([^}]+)\}\})/i;
export default function DynamicContentsPlugin(): JSX.Element | null {
    const [editor] = useLexicalComposerContext();
    const {getDynamicContentBySlug} = useDynamicContent();

    useEffect(() => {
        if (!editor.hasNodes([DynamicContentNode])) {
            throw new Error('DynamicContentsPlugin: DynamicContentNode not registered on editor');
        }

        // Register a node transform to move the selection after the node
        return mergeRegister(
            editor.registerNodeTransform(DynamicContentNode, (node) => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    if (selection.anchor.key === node.getKey() && selection.focus.key === node.getKey()) {
                        node.selectNext();
                    }
                }
            }),
            editor.registerCommand<InsertDynamicContentPayload>(
                INSERT_DYNAMIC_CONTENT_COMMAND,
                (payload) => {
                   const dcNode = $createDynamicContentNode(payload);
                   $insertNodes([dcNode]);
                    if ($isRootOrShadowRoot(dcNode.getParentOrThrow())) {
                        $wrapNodeInElement(dcNode, $createParagraphNode).selectEnd();
                    }
                    return true;
                },
                COMMAND_PRIORITY_EDITOR
            )
        );
    }, [editor]);

    const $createDynamicContentNode_ = useCallback((textNode: TextNode): DynamicContentNode => {
        const label = getDynamicContentBySlug(textNode.getTextContent());
        return $createDynamicContentNode({text: textNode.getTextContent(), label: label});
    }, []);

    const getDynamicContentMatch = useCallback((text: string) => {
        const matchArr = DYNAMIC_CONTENT_REGEX.exec(text);

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

export function InsertDynamicContentDialog({
      activeEditor,
      onClose,
  }: {
    activeEditor: LexicalEditor;
    onClose: () => void;
}): JSX.Element {

    const {options} = useDynamicContent();

    return (
        <>
            {options.map((dcoption: DCOption, index: number) => (
                <InsertDCNestedRow
                    key={index}
                    dcoption={dcoption}
                    onClick={(payload: InsertDynamicContentPayload) => {
                        activeEditor.dispatchCommand(INSERT_DYNAMIC_CONTENT_COMMAND, payload);
                        onClose();
                    }}
                />
            ))}
        </>
    );
}

function InsertDCNestedRow({
    dcoption,
    onClick,
    parentSlug = ''
}: {
    dcoption: DCOption,
    onClick: (payload: InsertDynamicContentPayload) => void,
    parentSlug?: string
   }) : JSX.Element {

    const {getDynamicContentBySlug} = useDynamicContent();

    const slug = parentSlug ? `${parentSlug}.${dcoption.slug}` : dcoption.slug;

    const hasOptions = dcoption?.options && dcoption?.options !== undefined && dcoption.options.length > 0;

    // get only options that have no nested options
    const finalOptions = hasOptions && dcoption.options!.filter((option: DCOption) => {
        return !option?.options || option.options.length === 0;
    });
    // get only options that have nested options
    const nestedOptions = hasOptions && dcoption.options!.filter((option: DCOption) => {
        return option?.options && option.options.length > 0;
    });

    return <>
        {hasOptions ? (
            <div className={'flex flex-col gap-1'}>
                <div>
                    <span className={'text-sm font-semibold'}>{dcoption.label}</span>
                </div>
                {finalOptions && finalOptions.length > 0 && <div className={'flex flex-row gap-1 pl-4'}>
                    {finalOptions.map((option: DCOption, index: number) => (
                        <InsertDCNestedRow key={index} dcoption={option} onClick={onClick} parentSlug={slug} />
                    ))}
                </div>}
                { nestedOptions && nestedOptions.length > 0 && <div className={'flex flex-col gap-1 pl-4'}>
                    {nestedOptions.sort((a: DCOption, b: DCOption) => {
                        const aCount = a.options ? a.options.length : 0;
                        const bCount = b.options ? b.options.length : 0;
                        return aCount - bCount;
                    }).map((option: DCOption, index: number) => (
                        <InsertDCNestedRow key={index} dcoption={option} onClick={onClick} parentSlug={slug} />
                    ))}
                </div>}
            </div>
        ) : (
            <Button
                onClick={() => onClick({text: `{{${slug}}}`, label: getDynamicContentBySlug(slug)})}
            >
                {dcoption.label}
            </Button>
        )}
    </>
}
