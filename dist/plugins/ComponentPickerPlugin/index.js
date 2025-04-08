import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { $createCodeNode } from '@lexical/code';
import { INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { LexicalTypeaheadMenuPlugin, MenuOption, useBasicTypeaheadTriggerMatch, } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { $createParagraphNode, $getSelection, $isRangeSelection, FORMAT_ELEMENT_COMMAND, } from 'lexical';
import { useCallback, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
import useModal from '../../hooks/useModal';
import catTypingGif from '../../images/cat-typing.gif';
import { INSERT_IMAGE_COMMAND, InsertImageDialog } from '../ImagesPlugin';
import { INSERT_PAGE_BREAK } from '../PageBreakPlugin';
import { InsertTableDialog } from '../TablePlugin';
class ComponentPickerOption extends MenuOption {
    // What shows up in the editor
    title;
    // Icon for display
    icon;
    // For extra searching.
    keywords;
    // TBD
    keyboardShortcut;
    // What happens when you select this option?
    onSelect;
    constructor(title, options) {
        super(title);
        this.title = title;
        this.keywords = options.keywords || [];
        this.icon = options.icon;
        this.keyboardShortcut = options.keyboardShortcut;
        this.onSelect = options.onSelect.bind(this);
    }
}
function ComponentPickerMenuItem({ index, isSelected, onClick, onMouseEnter, option, }) {
    let className = 'item';
    if (isSelected) {
        className += ' selected';
    }
    return (_jsxs("li", { tabIndex: -1, className: className, ref: option.setRefElement, role: "option", "aria-selected": isSelected, id: 'typeahead-item-' + index, onMouseEnter: onMouseEnter, onClick: onClick, children: [option.icon, _jsx("span", { className: "text", children: option.title })] }, option.key));
}
function getDynamicOptions(editor, queryString) {
    const options = [];
    if (queryString == null) {
        return options;
    }
    const tableMatch = queryString.match(/^([1-9]\d?)(?:x([1-9]\d?)?)?$/);
    if (tableMatch !== null) {
        const rows = tableMatch[1];
        const colOptions = tableMatch[2]
            ? [tableMatch[2]]
            : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String);
        options.push(...colOptions.map((columns) => new ComponentPickerOption(`${rows}x${columns} Table`, {
            icon: _jsx("i", { className: "icon table" }),
            keywords: ['table'],
            onSelect: () => editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns, rows }),
        })));
    }
    return options;
}
function getBaseOptions(editor, showModal) {
    return [
        new ComponentPickerOption('Paragraph', {
            icon: _jsx("i", { className: "icon paragraph" }),
            keywords: ['normal', 'paragraph', 'p', 'text'],
            onSelect: () => editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createParagraphNode());
                }
            }),
        }),
        ...[1, 2, 3].map((n) => new ComponentPickerOption(`Heading ${n}`, {
            icon: _jsx("i", { className: `icon h${n}` }),
            keywords: ['heading', 'header', `h${n}`],
            onSelect: () => editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createHeadingNode(`h${n}`));
                }
            }),
        })),
        new ComponentPickerOption('Table', {
            icon: _jsx("i", { className: "icon table" }),
            keywords: ['table', 'grid', 'spreadsheet', 'rows', 'columns'],
            onSelect: () => showModal('Insert Table', (onClose) => (_jsx(InsertTableDialog, { activeEditor: editor, onClose: onClose }))),
        }),
        new ComponentPickerOption('Numbered List', {
            icon: _jsx("i", { className: "icon number" }),
            keywords: ['numbered list', 'ordered list', 'ol'],
            onSelect: () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
        }),
        new ComponentPickerOption('Bulleted List', {
            icon: _jsx("i", { className: "icon bullet" }),
            keywords: ['bulleted list', 'unordered list', 'ul'],
            onSelect: () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
        }),
        new ComponentPickerOption('Check List', {
            icon: _jsx("i", { className: "icon check" }),
            keywords: ['check list', 'todo list'],
            onSelect: () => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
        }),
        new ComponentPickerOption('Quote', {
            icon: _jsx("i", { className: "icon quote" }),
            keywords: ['block quote'],
            onSelect: () => editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createQuoteNode());
                }
            }),
        }),
        new ComponentPickerOption('Code', {
            icon: _jsx("i", { className: "icon code" }),
            keywords: ['javascript', 'python', 'js', 'codeblock'],
            onSelect: () => editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    if (selection.isCollapsed()) {
                        $setBlocksType(selection, () => $createCodeNode());
                    }
                    else {
                        // Will this ever happen?
                        const textContent = selection.getTextContent();
                        const codeNode = $createCodeNode();
                        selection.insertNodes([codeNode]);
                        selection.insertRawText(textContent);
                    }
                }
            }),
        }),
        new ComponentPickerOption('Divider', {
            icon: _jsx("i", { className: "icon horizontal-rule" }),
            keywords: ['horizontal rule', 'divider', 'hr'],
            onSelect: () => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
        }),
        new ComponentPickerOption('Page Break', {
            icon: _jsx("i", { className: "icon page-break" }),
            keywords: ['page break', 'divider'],
            onSelect: () => editor.dispatchCommand(INSERT_PAGE_BREAK, undefined),
        }),
        new ComponentPickerOption('GIF', {
            icon: _jsx("i", { className: "icon gif" }),
            keywords: ['gif', 'animate', 'image', 'file'],
            onSelect: () => editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                altText: 'Cat typing on a laptop',
                src: catTypingGif,
            }),
        }),
        new ComponentPickerOption('Image', {
            icon: _jsx("i", { className: "icon image" }),
            keywords: ['image', 'photo', 'picture', 'file'],
            onSelect: () => showModal('Insert Image', (onClose) => (_jsx(InsertImageDialog, { activeEditor: editor, onClose: onClose }))),
        }),
        ...['left', 'center', 'right', 'justify'].map((alignment) => new ComponentPickerOption(`Align ${alignment}`, {
            icon: _jsx("i", { className: `icon ${alignment}-align` }),
            keywords: ['align', 'justify', alignment],
            onSelect: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment),
        })),
    ];
}
export default function ComponentPickerMenuPlugin() {
    const [editor] = useLexicalComposerContext();
    const [modal, showModal] = useModal();
    const [queryString, setQueryString] = useState(null);
    const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
        minLength: 0,
    });
    const options = useMemo(() => {
        const baseOptions = getBaseOptions(editor, showModal);
        if (!queryString) {
            return baseOptions;
        }
        const regex = new RegExp(queryString, 'i');
        return [
            ...getDynamicOptions(editor, queryString),
            ...baseOptions.filter((option) => regex.test(option.title) ||
                option.keywords.some((keyword) => regex.test(keyword))),
        ];
    }, [editor, queryString, showModal]);
    const onSelectOption = useCallback((selectedOption, nodeToRemove, closeMenu, matchingString) => {
        editor.update(() => {
            nodeToRemove?.remove();
            selectedOption.onSelect(matchingString);
            closeMenu();
        });
    }, [editor]);
    return (_jsxs(_Fragment, { children: [modal, _jsx(LexicalTypeaheadMenuPlugin, { onQueryChange: setQueryString, onSelectOption: onSelectOption, triggerFn: checkForTriggerMatch, options: options, menuRenderFn: (anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => anchorElementRef.current && options.length
                    ? ReactDOM.createPortal(_jsx("div", { className: "typeahead-popover component-picker-menu absolute p-1 bg-default-100 text-default-900 shadow-md rounded-md z-10", children: _jsx("ul", { children: options.map((option, i) => (_jsx(ComponentPickerMenuItem, { index: i, isSelected: selectedIndex === i, onClick: () => {
                                    setHighlightedIndex(i);
                                    selectOptionAndCleanUp(option);
                                }, onMouseEnter: () => {
                                    setHighlightedIndex(i);
                                }, option: option }, option.key))) }) }), anchorElementRef.current)
                    : null })] }));
}
