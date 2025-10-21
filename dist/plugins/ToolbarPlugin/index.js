import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { $isCodeNode, CODE_LANGUAGE_FRIENDLY_NAME_MAP, CODE_LANGUAGE_MAP, } from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isListNode, ListNode } from '@lexical/list';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { $isHeadingNode } from '@lexical/rich-text';
import { $getSelectionStyleValueForProperty, $isParentElementRTL, $patchStyleText, } from '@lexical/selection';
import { $isTableNode, $isTableSelection } from '@lexical/table';
import { $findMatchingParent, $getNearestNodeOfType, $isEditorIsNestedEditor, mergeRegister, } from '@lexical/utils';
import { $getNodeByKey, $getSelection, $isElementNode, $isRangeSelection, $isRootOrShadowRoot, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_CRITICAL, FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND, REDO_COMMAND, SELECTION_CHANGE_COMMAND, UNDO_COMMAND, } from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import { blockTypeToBlockName, useToolbarState, } from '../../context/ToolbarContext';
import useModal from '../../hooks/useModal';
import DropDown, { DropDownItem } from '../../ui/DropDown';
import DropdownColorPicker from '../../ui/DropdownColorPicker';
import { getSelectedNode } from '../../utils/getSelectedNode';
import { sanitizeUrl } from '../../utils/url';
import { INSERT_IMAGE_COMMAND, InsertImageDialog, } from '../ImagesPlugin';
import { INSERT_PAGE_BREAK } from '../PageBreakPlugin';
import { SHORTCUTS } from '../ShortcutsPlugin/shortcuts';
import FontSize from './fontSize';
import { clearFormatting, formatBulletList, formatHeading, formatNumberedList, formatParagraph, formatQuote, } from './utils';
import { Alphabet, AlphabetUppercase, ArrowClockwise, ArrowCounterclockwise, Eraser, FileBreak, Image, Justify, ListOl, ListTask, PaintBucket, Quote, Scissors, Subscript, Superscript, TextCenter, TextIndentLeft, TextIndentRight, TextLeft, TextParagraph, TextRight, Type, TypeBold, TypeH1, TypeH2, TypeH3, TypeH4, TypeH5, TypeH6, TypeItalic, TypeStrikethrough, TypeUnderline } from "react-bootstrap-icons";
import { InsertDynamicContentDialog } from "../DynamicContentPlugin";
import { useDynamicContent } from "../../context/DynamicContentContext";
const rootTypeToRootName = {
    root: 'Root',
    table: 'Table',
};
function getCodeLanguageOptions() {
    const options = [];
    for (const [lang, friendlyName] of Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP)) {
        options.push([lang, friendlyName]);
    }
    return options;
}
const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();
const FONT_FAMILY_OPTIONS = [
    ['Arial', 'Arial'],
    ['Courier New', 'Courier New'],
    ['Georgia', 'Georgia'],
    ['Times New Roman', 'Times New Roman'],
    ['Trebuchet MS', 'Trebuchet MS'],
    ['Verdana', 'Verdana'],
];
const FONT_SIZE_OPTIONS = [
    ['10px', '10px'],
    ['11px', '11px'],
    ['12px', '12px'],
    ['13px', '13px'],
    ['14px', '14px'],
    ['15px', '15px'],
    ['16px', '16px'],
    ['17px', '17px'],
    ['18px', '18px'],
    ['19px', '19px'],
    ['20px', '20px'],
];
const ELEMENT_FORMAT_OPTIONS = {
    center: {
        icon: _jsx(TextCenter, { size: 24 }),
        iconRTL: _jsx(TextCenter, { size: 24 }),
        name: 'Center Align',
    },
    justify: {
        icon: _jsx(Justify, { size: 24 }),
        iconRTL: _jsx(Justify, { size: 24 }),
        name: 'Justify Align',
    },
    left: {
        icon: _jsx(TextLeft, { size: 24 }),
        iconRTL: _jsx(TextLeft, { size: 24 }),
        name: 'Left Align',
    },
    right: {
        icon: _jsx(TextRight, { size: 24 }),
        iconRTL: _jsx(TextRight, { size: 24 }),
        name: 'Right Align',
    },
    end: {
        icon: 'right-align',
        iconRTL: 'left-align',
        name: 'End Align',
    },
    start: {
        icon: 'left-align',
        iconRTL: 'right-align',
        name: 'Start Align',
    },
};
function dropDownActiveClass(active) {
    if (active) {
        return 'active dropdown-item-active';
    }
    else {
        return '';
    }
}
function BlockFormatDropDown({ editor, blockType, rootType, disabled = false, }) {
    return (_jsxs(DropDown, { disabled: disabled, buttonClassName: "toolbar-item block-controls", buttonIconClassName: 'icon block-type ' + blockType, buttonLabel: blockTypeToBlockName[blockType], buttonAriaLabel: "Formatting options for text style", children: [_jsx(DropDownItem, { className: 'item wide ' + dropDownActiveClass(blockType === 'paragraph'), onClick: () => formatParagraph(editor), shortcut: SHORTCUTS.NORMAL, icon: _jsx(TextParagraph, { size: 24 }), children: _jsx("span", { className: "text", children: "Normal" }) }), _jsx(DropDownItem, { className: '' + dropDownActiveClass(blockType === 'h1'), onClick: () => formatHeading(editor, blockType, 'h1'), shortcut: SHORTCUTS.HEADING1, icon: _jsx(TypeH1, { size: 24 }), children: _jsx("span", { className: "", children: "Heading 1" }) }), _jsx(DropDownItem, { className: 'item wide ' + dropDownActiveClass(blockType === 'h2'), onClick: () => formatHeading(editor, blockType, 'h2'), shortcut: SHORTCUTS.HEADING2, icon: _jsx(TypeH2, { size: 24 }), children: _jsx("span", { className: "text", children: "Heading 2" }) }), _jsx(DropDownItem, { className: 'item wide ' + dropDownActiveClass(blockType === 'h3'), onClick: () => formatHeading(editor, blockType, 'h3'), shortcut: SHORTCUTS.HEADING3, icon: _jsx(TypeH3, { size: 24 }), children: _jsx("span", { className: "text", children: "Heading 3" }) }), _jsx(DropDownItem, { className: 'item wide ' + dropDownActiveClass(blockType === 'h4'), onClick: () => formatHeading(editor, blockType, 'h4'), shortcut: SHORTCUTS.HEADING4, icon: _jsx(TypeH4, { size: 24 }), children: _jsx("span", { className: "text", children: "Heading 4" }) }), _jsx(DropDownItem, { className: 'item wide ' + dropDownActiveClass(blockType === 'h5'), onClick: () => formatHeading(editor, blockType, 'h5'), shortcut: SHORTCUTS.HEADING5, icon: _jsx(TypeH5, { size: 24 }), children: _jsx("span", { className: "text", children: "Heading 5" }) }), _jsx(DropDownItem, { className: 'item wide ' + dropDownActiveClass(blockType === 'h6'), onClick: () => formatHeading(editor, blockType, 'h6'), shortcut: SHORTCUTS.HEADING6, icon: _jsx(TypeH6, { size: 24 }), children: _jsx("span", { className: "text", children: "Heading 6" }) }), _jsx(DropDownItem, { className: 'item wide ' + dropDownActiveClass(blockType === 'bullet'), onClick: () => formatBulletList(editor, blockType), shortcut: SHORTCUTS.BULLET_LIST, icon: _jsx(ListTask, { size: 24 }), children: _jsx("span", { className: "text", children: "Bullet List" }) }), _jsx(DropDownItem, { className: 'item wide ' + dropDownActiveClass(blockType === 'number'), onClick: () => formatNumberedList(editor, blockType), shortcut: SHORTCUTS.NUMBERED_LIST, icon: _jsx(ListOl, { size: 24 }), children: _jsx("span", { className: "text", children: "Numbered List" }) }), _jsx(DropDownItem, { className: 'item wide ' + dropDownActiveClass(blockType === 'quote'), onClick: () => formatQuote(editor, blockType), shortcut: SHORTCUTS.QUOTE, icon: _jsx(Quote, { size: 24 }), children: _jsx("span", { className: "text", children: "Quote" }) })] }));
}
function Divider() {
    return _jsx("div", { className: "w-0.5 h-full bg-default-200" });
}
function FontDropDown({ editor, value, style, disabled = false, }) {
    const handleClick = useCallback((option) => {
        editor.update(() => {
            const selection = $getSelection();
            if (selection !== null) {
                $patchStyleText(selection, {
                    [style]: option,
                });
            }
        }, { tag: 'toolbar-click' });
    }, [editor, style]);
    const buttonAriaLabel = style === 'font-family'
        ? 'Formatting options for font family'
        : 'Formatting options for font size';
    return (_jsx(DropDown, { disabled: disabled, buttonClassName: 'toolbar-item ' + style, buttonLabel: value, buttonIconClassName: style === 'font-family' ? 'icon block-type font-family' : '', buttonAriaLabel: buttonAriaLabel, children: (style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(([option, text]) => (_jsx(DropDownItem, { className: `item ${dropDownActiveClass(value === option)} ${style === 'font-size' ? 'fontsize-item' : ''}`, onClick: () => handleClick(option), children: _jsx("span", { className: "text", children: text }) }, option))) }));
}
function ElementFormatDropdown({ editor, value, isRTL, disabled = false, }) {
    const formatOption = ELEMENT_FORMAT_OPTIONS[value || 'left'];
    return (_jsxs(DropDown, { disabled: disabled, buttonLabel: formatOption.icon, buttonIconClassName: `icon`, buttonClassName: "toolbar-item spaced alignment", buttonAriaLabel: "Formatting options for text alignment", children: [_jsx(DropDownItem, { onClick: () => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
                }, className: "item wide", icon: _jsx(TextLeft, { size: 24 }), shortcut: SHORTCUTS.LEFT_ALIGN, children: _jsx("span", { className: "text", children: "Left Align" }) }), _jsx(DropDownItem, { onClick: () => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
                }, className: "item wide", icon: _jsx(TextCenter, { size: 24 }), shortcut: SHORTCUTS.CENTER_ALIGN, children: _jsx("span", { className: "text", children: "Center Align" }) }), _jsx(DropDownItem, { onClick: () => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
                }, className: "item wide", icon: _jsx(TextRight, { size: 24 }), shortcut: SHORTCUTS.RIGHT_ALIGN, children: _jsx("span", { className: "text", children: "Right Align" }) }), _jsx(DropDownItem, { onClick: () => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
                }, className: "item wide", icon: _jsx(Justify, { size: 24 }), shortcut: SHORTCUTS.JUSTIFY_ALIGN, children: _jsx("span", { className: "text", children: "Justify Align" }) }), _jsx(Divider, {}), _jsx(DropDownItem, { onClick: () => {
                    editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
                }, className: "item wide", icon: _jsx(TextIndentRight, { size: 24 }), shortcut: SHORTCUTS.OUTDENT, children: _jsx("span", { className: "text", children: "Outdent" }) }), _jsx(DropDownItem, { onClick: () => {
                    editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
                }, className: "item wide", icon: _jsx(TextIndentLeft, { size: 24 }), shortcut: SHORTCUTS.INDENT, children: _jsx("span", { className: "text", children: "Indent" }) })] }));
}
export default function ToolbarPlugin({ editor, activeEditor, setActiveEditor, setIsLinkEditMode, plugins, }) {
    const [selectedElementKey, setSelectedElementKey] = useState(null);
    const [modal, showModal] = useModal();
    const [isEditable, setIsEditable] = useState(() => editor.isEditable());
    const { toolbarState, updateToolbarState } = useToolbarState();
    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            if (activeEditor !== editor && $isEditorIsNestedEditor(activeEditor)) {
                const rootElement = activeEditor.getRootElement();
                updateToolbarState('isImageCaption', !!rootElement?.parentElement?.classList.contains('image-caption-container'));
            }
            else {
                updateToolbarState('isImageCaption', false);
            }
            const anchorNode = selection.anchor.getNode();
            let element = anchorNode.getKey() === 'root'
                ? anchorNode
                : $findMatchingParent(anchorNode, (e) => {
                    const parent = e.getParent();
                    return parent !== null && $isRootOrShadowRoot(parent);
                });
            if (element === null) {
                element = anchorNode.getTopLevelElementOrThrow();
            }
            const elementKey = element.getKey();
            const elementDOM = activeEditor.getElementByKey(elementKey);
            updateToolbarState('isRTL', $isParentElementRTL(selection));
            // Update links
            const node = getSelectedNode(selection);
            const parent = node.getParent();
            const isLink = $isLinkNode(parent) || $isLinkNode(node);
            updateToolbarState('isLink', isLink);
            const tableNode = $findMatchingParent(node, $isTableNode);
            if ($isTableNode(tableNode)) {
                updateToolbarState('rootType', 'table');
            }
            else {
                updateToolbarState('rootType', 'root');
            }
            if (elementDOM !== null) {
                setSelectedElementKey(elementKey);
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType(anchorNode, ListNode);
                    const type = parentList
                        ? parentList.getListType()
                        : element.getListType();
                    updateToolbarState('blockType', type);
                }
                else {
                    const type = $isHeadingNode(element)
                        ? element.getTag()
                        : element.getType();
                    if (type in blockTypeToBlockName) {
                        updateToolbarState('blockType', type);
                    }
                    if ($isCodeNode(element)) {
                        const language = element.getLanguage();
                        updateToolbarState('codeLanguage', language ? CODE_LANGUAGE_MAP[language] || language : '');
                        return;
                    }
                }
            }
            // Handle buttons
            updateToolbarState('fontColor', $getSelectionStyleValueForProperty(selection, 'color', '#000'));
            updateToolbarState('bgColor', $getSelectionStyleValueForProperty(selection, 'background-color', '#fff'));
            updateToolbarState('fontFamily', $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'));
            let matchingParent;
            if ($isLinkNode(parent)) {
                // If node is a link, we need to fetch the parent paragraph node to set format
                matchingParent = $findMatchingParent(node, (parentNode) => $isElementNode(parentNode) && !parentNode.isInline());
            }
            // If matchingParent is a valid node, pass it's format type
            updateToolbarState('elementFormat', $isElementNode(matchingParent)
                ? matchingParent.getFormatType()
                : $isElementNode(node)
                    ? node.getFormatType()
                    : parent?.getFormatType() || 'left');
        }
        if ($isRangeSelection(selection) || $isTableSelection(selection)) {
            // Update text format
            updateToolbarState('isBold', selection.hasFormat('bold'));
            updateToolbarState('isItalic', selection.hasFormat('italic'));
            updateToolbarState('isUnderline', selection.hasFormat('underline'));
            updateToolbarState('isStrikethrough', selection.hasFormat('strikethrough'));
            updateToolbarState('isSubscript', selection.hasFormat('subscript'));
            updateToolbarState('isSuperscript', selection.hasFormat('superscript'));
            updateToolbarState('isHighlight', selection.hasFormat('highlight'));
            updateToolbarState('isCode', selection.hasFormat('code'));
            updateToolbarState('fontSize', $getSelectionStyleValueForProperty(selection, 'font-size', '15px'));
            updateToolbarState('isLowercase', selection.hasFormat('lowercase'));
            updateToolbarState('isUppercase', selection.hasFormat('uppercase'));
            updateToolbarState('isCapitalize', selection.hasFormat('capitalize'));
        }
    }, [activeEditor, editor, updateToolbarState]);
    useEffect(() => {
        return editor.registerCommand(SELECTION_CHANGE_COMMAND, (_payload, newEditor) => {
            setActiveEditor(newEditor);
            $updateToolbar();
            return false;
        }, COMMAND_PRIORITY_CRITICAL);
    }, [editor, $updateToolbar, setActiveEditor]);
    useEffect(() => {
        activeEditor.getEditorState().read(() => {
            $updateToolbar();
        });
    }, [activeEditor, $updateToolbar]);
    useEffect(() => {
        return mergeRegister(editor.registerEditableListener((editable) => {
            setIsEditable(editable);
        }), activeEditor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                $updateToolbar();
            });
        }), activeEditor.registerCommand(CAN_UNDO_COMMAND, (payload) => {
            updateToolbarState('canUndo', payload);
            return false;
        }, COMMAND_PRIORITY_CRITICAL), activeEditor.registerCommand(CAN_REDO_COMMAND, (payload) => {
            updateToolbarState('canRedo', payload);
            return false;
        }, COMMAND_PRIORITY_CRITICAL));
    }, [$updateToolbar, activeEditor, editor, updateToolbarState]);
    const applyStyleText = useCallback((styles, skipHistoryStack) => {
        activeEditor.update(() => {
            const selection = $getSelection();
            if (selection !== null) {
                $patchStyleText(selection, styles);
            }
        }, skipHistoryStack ? { tag: 'historic' } : {});
    }, [activeEditor]);
    const onFontColorSelect = useCallback((value, skipHistoryStack) => {
        applyStyleText({ color: value }, skipHistoryStack);
    }, [applyStyleText]);
    const onBgColorSelect = useCallback((value, skipHistoryStack) => {
        applyStyleText({ 'background-color': value }, skipHistoryStack);
    }, [applyStyleText]);
    const insertLink = useCallback(() => {
        if (!toolbarState.isLink) {
            setIsLinkEditMode(true);
            activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
        }
        else {
            setIsLinkEditMode(false);
            activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        }
    }, [activeEditor, setIsLinkEditMode, toolbarState.isLink]);
    const onCodeLanguageSelect = useCallback((value) => {
        activeEditor.update(() => {
            if (selectedElementKey !== null) {
                const node = $getNodeByKey(selectedElementKey);
                if ($isCodeNode(node)) {
                    node.setLanguage(value);
                }
            }
        });
    }, [activeEditor, selectedElementKey]);
    const insertGifOnClick = (payload) => {
        activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    };
    const canViewerSeeInsertDropdown = !toolbarState.isImageCaption;
    const canViewerSeeInsertCodeButton = !toolbarState.isImageCaption;
    const buttonClassName = 'cursor-pointer rounded hover:bg-default-900 hover:text-default-50 disabled:opacity-50';
    const activeButtonClassName = 'bg-default-500 text-default-50';
    const { hasDynamicContent } = useDynamicContent();
    return (_jsxs("div", { className: "flex flex-row h-12 gap-2 p-1 overflow-y-auto", children: [plugins?.history !== false && _jsxs(_Fragment, { children: [_jsx("button", { disabled: !toolbarState.canUndo || !isEditable, onClick: () => {
                            activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
                        }, title: `Undo (${SHORTCUTS.UNDO})`, type: "button", className: buttonClassName, "aria-label": "Undo", children: _jsx(ArrowCounterclockwise, { size: 24 }) }), _jsx("button", { disabled: !toolbarState.canRedo || !isEditable, onClick: () => {
                            activeEditor.dispatchCommand(REDO_COMMAND, undefined);
                        }, title: `Redo (${SHORTCUTS.REDO})`, type: "button", className: buttonClassName, "aria-label": "Redo", children: _jsx(ArrowClockwise, { size: 24 }) })] }), _jsx(Divider, {}), toolbarState.blockType in blockTypeToBlockName &&
                activeEditor === editor && (_jsxs(_Fragment, { children: [_jsx(BlockFormatDropDown, { disabled: !isEditable, blockType: toolbarState.blockType, rootType: toolbarState.rootType, editor: activeEditor }), _jsx(Divider, {})] })), _jsx(FontDropDown, { disabled: !isEditable, style: 'font-family', value: toolbarState.fontFamily, editor: activeEditor }), _jsx(Divider, {}), _jsx(FontSize, { selectionFontSize: toolbarState.fontSize.slice(0, -2), editor: activeEditor, disabled: !isEditable }), _jsx(Divider, {}), _jsx("button", { disabled: !isEditable, onClick: () => {
                    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                }, className: buttonClassName + ' ' + (toolbarState.isBold ? activeButtonClassName : ''), title: `Bold (${SHORTCUTS.BOLD})`, type: "button", "aria-label": `Format text as bold. Shortcut: ${SHORTCUTS.BOLD}`, children: _jsx(TypeBold, { size: 24 }) }), _jsx("button", { disabled: !isEditable, onClick: () => {
                    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                }, className: buttonClassName + ' ' + (toolbarState.isItalic ? activeButtonClassName : ''), title: `Italic (${SHORTCUTS.ITALIC})`, type: "button", "aria-label": `Format text as italics. Shortcut: ${SHORTCUTS.ITALIC}`, children: _jsx(TypeItalic, { size: 24 }) }), _jsx("button", { disabled: !isEditable, onClick: () => {
                    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                }, className: buttonClassName + ' ' + (toolbarState.isUnderline ? activeButtonClassName : ''), title: `Underline (${SHORTCUTS.UNDERLINE})`, type: "button", "aria-label": `Format text to underlined. Shortcut: ${SHORTCUTS.UNDERLINE}`, children: _jsx(TypeUnderline, { size: 24 }) }), _jsx("button", { disabled: !isEditable, onClick: () => {
                    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                }, className: buttonClassName + ' ' + (toolbarState.isStrikethrough ? activeButtonClassName : ''), title: `Underline (${SHORTCUTS.STRIKETHROUGH})`, type: "button", "aria-label": `Format text to underlined. Shortcut: ${SHORTCUTS.STRIKETHROUGH}`, children: _jsx(TypeStrikethrough, { size: 24 }) }), _jsx(DropdownColorPicker, { disabled: !isEditable, buttonElement: _jsxs("div", { className: 'p-1', children: [_jsx("div", { className: 'text-xl leading-none', children: "A" }), _jsx("div", { className: "h-1 w-full bg-default-500" })] }), buttonClassName: buttonClassName + ' w-6', color: toolbarState.fontColor, onChange: onFontColorSelect, title: "text color" }), _jsx(DropdownColorPicker, { disabled: !isEditable, buttonElement: _jsx(PaintBucket, { size: 24 }), buttonClassName: buttonClassName, color: toolbarState.bgColor, onChange: onBgColorSelect, title: "bg color" }), _jsx("button", { onClick: () => {
                    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'lowercase');
                }, className: buttonClassName + ' ' + (toolbarState.isLowercase ? activeButtonClassName : ''), title: `Lowercase (${SHORTCUTS.LOWERCASE})`, "aria-label": "Format text to lowercase", type: "button", children: _jsx(Alphabet, { size: 24, className: 'py-0.5 w-6' }) }), _jsx("button", { onClick: () => {
                    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'uppercase');
                }, className: buttonClassName + ' ' + (toolbarState.isUppercase ? activeButtonClassName : ''), title: `Uppercase (${SHORTCUTS.UPPERCASE})`, "aria-label": "Format text to uppercase", type: "button", children: _jsx(AlphabetUppercase, { size: 24, className: 'py-0.5 w-6' }) }), _jsx("button", { onClick: () => {
                    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'capitalize');
                }, className: buttonClassName + ' ' + (toolbarState.isCapitalize ? activeButtonClassName : ''), title: `Capitalize (${SHORTCUTS.CAPITALIZE})`, "aria-label": "Format text to capitalize", type: "button", children: _jsx(Type, { size: 24 }) }), _jsx("button", { onClick: () => {
                    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
                }, className: buttonClassName + ' ' + (toolbarState.isSubscript ? activeButtonClassName : ''), title: `Subscript (${SHORTCUTS.SUBSCRIPT})`, "aria-label": "Format text with a subscript", type: "button", children: _jsx(Subscript, { size: 24 }) }), _jsx("button", { onClick: () => {
                    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
                }, className: buttonClassName + ' ' + (toolbarState.isSuperscript ? activeButtonClassName : ''), title: `Superscript (${SHORTCUTS.SUPERSCRIPT})`, "aria-label": "Format text with a superscript", type: "button", children: _jsx(Superscript, { size: 24 }) }), plugins?.list !== false && _jsxs(_Fragment, { children: [_jsx("button", { className: buttonClassName + ' ' + (toolbarState.blockType === 'bullet' ? activeButtonClassName : ''), onClick: () => formatBulletList(editor, toolbarState.blockType), title: `Bullet List (${SHORTCUTS.BULLET_LIST})`, "aria-label": `Format text as bullet list. Shortcut: ${SHORTCUTS.BULLET_LIST}`, type: "button", children: _jsx(ListTask, { size: 24 }) }), _jsx("button", { className: buttonClassName + ' ' + (toolbarState.blockType === 'number' ? activeButtonClassName : ''), onClick: () => formatNumberedList(editor, toolbarState.blockType), title: `Numbered List (${SHORTCUTS.NUMBERED_LIST})`, "aria-label": `Format text as numbered list. Shortcut: ${SHORTCUTS.NUMBERED_LIST}`, type: "button", children: _jsx(ListOl, { size: 24 }) })] }), _jsx("button", { onClick: () => clearFormatting(activeEditor), className: buttonClassName, title: `Clear text formatting (${SHORTCUTS.CLEAR_FORMATTING})`, "aria-label": "Clear all text formatting", type: "button", children: _jsx(Eraser, { size: 24 }) }), canViewerSeeInsertDropdown && (_jsxs(_Fragment, { children: [_jsx(Divider, {}), _jsxs(DropDown, { disabled: !isEditable, buttonClassName: "toolbar-item spaced", buttonLabel: "Insert", buttonAriaLabel: "Insert specialized editor node", buttonIconClassName: "icon plus", children: [plugins?.horizontalRule !== false && _jsx(DropDownItem, { onClick: () => {
                                    activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
                                }, className: "item", icon: _jsx(FileBreak, { size: 20 }), children: _jsx("span", { className: "text", children: "Horizontal Rule" }) }), plugins?.pageBreak !== false && _jsx(DropDownItem, { onClick: () => {
                                    activeEditor.dispatchCommand(INSERT_PAGE_BREAK, undefined);
                                }, className: "item", icon: _jsx(Scissors, { size: 20 }), children: _jsx("span", { className: "text", children: "Page Break" }) }), plugins?.images !== false && _jsx(DropDownItem, { onClick: () => {
                                    showModal('Insert Image', (onClose) => (_jsx(InsertImageDialog, { activeEditor: activeEditor, onClose: onClose })));
                                }, className: "item", icon: _jsx(Image, { size: 20 }), children: _jsx("span", { className: "text", children: "Image" }) }), plugins?.dynamicContents !== false && _jsx(DropDownItem, { disabled: !hasDynamicContent, onClick: () => {
                                    showModal('Insert Dynamic Content', (onClose) => (_jsx(InsertDynamicContentDialog, { activeEditor: activeEditor, onClose: onClose })));
                                }, className: "item", icon: _jsx("span", { className: 'text-2xl leading-none', children: "\u27B2" }), children: _jsx("span", { className: "text", children: "Dynamic Content" }) })] })] })), _jsx(Divider, {}), _jsx(ElementFormatDropdown, { disabled: !isEditable, value: toolbarState.elementFormat, editor: activeEditor, isRTL: toolbarState.isRTL }), modal] }));
}
