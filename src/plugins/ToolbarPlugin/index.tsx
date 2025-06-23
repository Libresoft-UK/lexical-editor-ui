/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {JSX} from 'react';

import {
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from '@lexical/code';
import {$isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {$isListNode, ListNode} from '@lexical/list';
import {INSERT_HORIZONTAL_RULE_COMMAND} from '@lexical/react/LexicalHorizontalRuleNode';
import {$isHeadingNode} from '@lexical/rich-text';
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
} from '@lexical/selection';
import {$isTableNode, $isTableSelection} from '@lexical/table';
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  $isEditorIsNestedEditor,
  IS_APPLE,
  mergeRegister,
} from '@lexical/utils';
import {
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  LexicalEditor,
  NodeKey,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {Dispatch, useCallback, useEffect, useState} from 'react';
import * as React from 'react';

import {
  blockTypeToBlockName,
  useToolbarState,
} from '../../context/ToolbarContext';
import useModal from '../../hooks/useModal';
import DropDown, {DropDownItem} from '../../ui/DropDown';
import DropdownColorPicker from '../../ui/DropdownColorPicker';
import {getSelectedNode} from '../../utils/getSelectedNode';
import {sanitizeUrl} from '../../utils/url';
import {
  INSERT_IMAGE_COMMAND,
  InsertImageDialog,
  InsertImagePayload,
} from '../ImagesPlugin';
import {INSERT_PAGE_BREAK} from '../PageBreakPlugin';
import {SHORTCUTS} from '../ShortcutsPlugin/shortcuts';
import FontSize from './fontSize';
import {
  clearFormatting,
  formatBulletList,
  formatHeading,
  formatNumberedList,
  formatParagraph,
  formatQuote,
} from './utils';
import {
    Alphabet,
    AlphabetUppercase,
    ArrowClockwise,
    ArrowCounterclockwise,
    Eraser, FileBreak, Image,
    Justify,
    ListOl,
    ListTask,
    PaintBucket,
    Quote, Scissors,
    Subscript,
    Superscript, TextCenter, TextIndentLeft, TextIndentRight, TextLeft, TextParagraph, TextRight,
    Type,
    TypeBold,
    TypeH1, TypeH2, TypeH3, TypeH4, TypeH5, TypeH6,
    TypeItalic,
    TypeStrikethrough,
    TypeUnderline
} from "react-bootstrap-icons";
import {InsertDynamicContentDialog} from "../DynamicContentPlugin";
import {useDynamicContent} from "../../context/DynamicContentContext";

const rootTypeToRootName = {
  root: 'Root',
  table: 'Table',
};

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

const FONT_FAMILY_OPTIONS: [string, string][] = [
  ['Arial', 'Arial'],
  ['Courier New', 'Courier New'],
  ['Georgia', 'Georgia'],
  ['Times New Roman', 'Times New Roman'],
  ['Trebuchet MS', 'Trebuchet MS'],
  ['Verdana', 'Verdana'],
];

const FONT_SIZE_OPTIONS: [string, string][] = [
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

const ELEMENT_FORMAT_OPTIONS: {
  [key in Exclude<ElementFormatType, ''>]: {
    icon: React.ReactNode;
    iconRTL: React.ReactNode;
    name: string;
  };
} = {
  center: {
    icon: <TextCenter size={24} /> ,
    iconRTL: <TextCenter size={24} /> ,
    name: 'Center Align',
  },
  justify: {
    icon: <Justify size={24} />,
    iconRTL: <Justify size={24} />,
    name: 'Justify Align',
  },
  left: {
    icon: <TextLeft size={24} /> ,
    iconRTL: <TextLeft size={24} /> ,
    name: 'Left Align',
  },
  right: {
    icon: <TextRight size={24} />,
    iconRTL: <TextRight size={24} />,
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

function dropDownActiveClass(active: boolean) {
  if (active) {
    return 'active dropdown-item-active';
  } else {
    return '';
  }
}

function BlockFormatDropDown({
  editor,
  blockType,
  rootType,
  disabled = false,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof typeof rootTypeToRootName;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  return (
    <DropDown
      disabled={disabled}
      buttonClassName="toolbar-item block-controls"
      buttonIconClassName={'icon block-type ' + blockType}
      buttonLabel={blockTypeToBlockName[blockType]}
      buttonAriaLabel="Formatting options for text style">
      <DropDownItem
        className={
          'item wide ' + dropDownActiveClass(blockType === 'paragraph')
        }
        onClick={() => formatParagraph(editor)}
        shortcut={SHORTCUTS.NORMAL}
        icon={<TextParagraph size={24} />}
      >
        <span className="text">Normal</span>
      </DropDownItem>
      <DropDownItem
        className={'' + dropDownActiveClass(blockType === 'h1')}
        onClick={() => formatHeading(editor, blockType, 'h1')}
        shortcut={SHORTCUTS.HEADING1}
        icon={<TypeH1 size={24} />}
      >
        <span className="">Heading 1</span>
      </DropDownItem>
      <DropDownItem
        className={'item wide ' + dropDownActiveClass(blockType === 'h2')}
        onClick={() => formatHeading(editor, blockType, 'h2')}
        shortcut={SHORTCUTS.HEADING2}
        icon={<TypeH2 size={24} />}
      >
        <span className="text">Heading 2</span>
      </DropDownItem>
      <DropDownItem
        className={'item wide ' + dropDownActiveClass(blockType === 'h3')}
        onClick={() => formatHeading(editor, blockType, 'h3')}
        shortcut={SHORTCUTS.HEADING3}
        icon={<TypeH3 size={24} />}
      >
          <span className="text">Heading 3</span>
      </DropDownItem>
      <DropDownItem
          className={'item wide ' + dropDownActiveClass(blockType === 'h4')}
          onClick={() => formatHeading(editor, blockType, 'h4')}
          shortcut={SHORTCUTS.HEADING4}
          icon={<TypeH4 size={24} />}
      >
        <span className="text">Heading 4</span>
      </DropDownItem>
      <DropDownItem
          className={'item wide ' + dropDownActiveClass(blockType === 'h5')}
          onClick={() => formatHeading(editor, blockType, 'h5')}
          shortcut={SHORTCUTS.HEADING5}
          icon={<TypeH5 size={24} />}
      >
        <span className="text">Heading 5</span>
      </DropDownItem>
      <DropDownItem
          className={'item wide ' + dropDownActiveClass(blockType === 'h6')}
          onClick={() => formatHeading(editor, blockType, 'h6')}
          shortcut={SHORTCUTS.HEADING6}
          icon={<TypeH6 size={24} />}
      >
        <span className="text">Heading 6</span>
      </DropDownItem>
      <DropDownItem
        className={'item wide ' + dropDownActiveClass(blockType === 'bullet')}
        onClick={() => formatBulletList(editor, blockType)}
        shortcut={SHORTCUTS.BULLET_LIST}
        icon={<ListTask size={24} />}
      >
       <span className="text">Bullet List</span>
      </DropDownItem>
      <DropDownItem
        className={'item wide ' + dropDownActiveClass(blockType === 'number')}
        onClick={() => formatNumberedList(editor, blockType)}
        shortcut={SHORTCUTS.NUMBERED_LIST}
        icon={<ListOl size={24} />}
      >
        <span className="text">Numbered List</span>
      </DropDownItem>
      {/*<DropDownItem*/}
      {/*  className={'item wide ' + dropDownActiveClass(blockType === 'check')}*/}
      {/*  onClick={() => formatCheckList(editor, blockType)}*/}
      {/*  shortcut={SHORTCUTS.CHECK_LIST}*/}
      {/*  icon={<ListCheck size={24} />}*/}
      {/*>*/}
      {/*    <span className="text">Check List</span>*/}
      {/*</DropDownItem>*/}
      <DropDownItem
        className={'item wide ' + dropDownActiveClass(blockType === 'quote')}
        onClick={() => formatQuote(editor, blockType)}
        shortcut={SHORTCUTS.QUOTE}
        icon={<Quote size={24} />}
      >
        <span className="text">Quote</span>
      </DropDownItem>
      {/*<DropDownItem*/}
      {/*  className={'item wide ' + dropDownActiveClass(blockType === 'code')}*/}
      {/*  onClick={() => formatCode(editor, blockType)}>*/}
      {/*  <div className="icon-text-container">*/}
      {/*    <i className="icon code" />*/}
      {/*    <span className="text">Code Block</span>*/}
      {/*  </div>*/}
      {/*  <span className="shortcut">{SHORTCUTS.CODE_BLOCK}</span>*/}
      {/*</DropDownItem>*/}
    </DropDown>
  );
}

function Divider(): JSX.Element {
  return <div className="w-0.5 h-full bg-default-200" />;
}

function FontDropDown({
  editor,
  value,
  style,
  disabled = false,
}: {
  editor: LexicalEditor;
  value: string;
  style: string;
  disabled?: boolean;
}): JSX.Element {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, {
            [style]: option,
          });
        }
      });
    },
    [editor, style],
  );

  const buttonAriaLabel =
    style === 'font-family'
      ? 'Formatting options for font family'
      : 'Formatting options for font size';

  return (
    <DropDown
      disabled={disabled}
      buttonClassName={'toolbar-item ' + style}
      buttonLabel={value}
      buttonIconClassName={
        style === 'font-family' ? 'icon block-type font-family' : ''
      }
      buttonAriaLabel={buttonAriaLabel}>
      {(style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(
        ([option, text]) => (
          <DropDownItem
            className={`item ${dropDownActiveClass(value === option)} ${
              style === 'font-size' ? 'fontsize-item' : ''
            }`}
            onClick={() => handleClick(option)}
            key={option}>
            <span className="text">{text}</span>
          </DropDownItem>
        ),
      )}
    </DropDown>
  );
}

function ElementFormatDropdown({
  editor,
  value,
  isRTL,
  disabled = false,
}: {
  editor: LexicalEditor;
  value: ElementFormatType;
  isRTL: boolean;
  disabled: boolean;
}) {
  const formatOption = ELEMENT_FORMAT_OPTIONS[value || 'left'];

  return (
    <DropDown
      disabled={disabled}
      buttonLabel={formatOption.icon}
      buttonIconClassName={`icon`}
      buttonClassName="toolbar-item spaced alignment"
      buttonAriaLabel="Formatting options for text alignment">
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className="item wide"
        icon={<TextLeft size={24} />}
        shortcut={SHORTCUTS.LEFT_ALIGN}
      >
          <span className="text">Left Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className="item wide"
        icon={<TextCenter size={24} />}
        shortcut={SHORTCUTS.CENTER_ALIGN}
      >
          <span className="text">Center Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className="item wide"
        icon={<TextRight size={24} />}
        shortcut={SHORTCUTS.RIGHT_ALIGN}
      >
          <span className="text">Right Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className="item wide"
        icon={<Justify size={24} />}
        shortcut={SHORTCUTS.JUSTIFY_ALIGN}
      >
          <span className="text">Justify Align</span>
      </DropDownItem>
      {/*<DropDownItem*/}
      {/*  onClick={() => {*/}
      {/*    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'start');*/}
      {/*  }}*/}
      {/*  className="item wide">*/}
      {/*  <i*/}
      {/*    className={`icon ${*/}
      {/*      isRTL*/}
      {/*        ? ELEMENT_FORMAT_OPTIONS.start.iconRTL*/}
      {/*        : ELEMENT_FORMAT_OPTIONS.start.icon*/}
      {/*    }`}*/}
      {/*  />*/}
      {/*  <span className="text">Start Align</span>*/}
      {/*</DropDownItem>*/}
      {/*<DropDownItem*/}
      {/*  onClick={() => {*/}
      {/*    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'end');*/}
      {/*  }}*/}
      {/*  className="item wide">*/}
      {/*  <i*/}
      {/*    className={`icon ${*/}
      {/*      isRTL*/}
      {/*        ? ELEMENT_FORMAT_OPTIONS.end.iconRTL*/}
      {/*        : ELEMENT_FORMAT_OPTIONS.end.icon*/}
      {/*    }`}*/}
      {/*  />*/}
      {/*  <span className="text">End Align</span>*/}
      {/*</DropDownItem>*/}
      <Divider />
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        }}
        className="item wide"
        icon={<TextIndentRight size={24} />}
        shortcut={SHORTCUTS.OUTDENT}
      >
          <span className="text">Outdent</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        }}
        className="item wide"
        icon={<TextIndentLeft size={24} />}
        shortcut={SHORTCUTS.INDENT}
      >
          <span className="text">Indent</span>
      </DropDownItem>
    </DropDown>
  );
}

export default function ToolbarPlugin({
  editor,
  activeEditor,
  setActiveEditor,
  setIsLinkEditMode,
}: {
  editor: LexicalEditor;
  activeEditor: LexicalEditor;
  setActiveEditor: Dispatch<LexicalEditor>;
  setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element {
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null,
  );
  const [modal, showModal] = useModal();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const {toolbarState, updateToolbarState} = useToolbarState();

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      if (activeEditor !== editor && $isEditorIsNestedEditor(activeEditor)) {
        const rootElement = activeEditor.getRootElement();
        updateToolbarState(
          'isImageCaption',
          !!rootElement?.parentElement?.classList.contains(
            'image-caption-container',
          ),
        );
      } else {
        updateToolbarState('isImageCaption', false);
      }

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
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
      } else {
        updateToolbarState('rootType', 'root');
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();

          updateToolbarState('blockType', type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            updateToolbarState(
              'blockType',
              type as keyof typeof blockTypeToBlockName,
            );
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            updateToolbarState(
              'codeLanguage',
              language ? CODE_LANGUAGE_MAP[language] || language : '',
            );
            return;
          }
        }
      }
      // Handle buttons
      updateToolbarState(
        'fontColor',
        $getSelectionStyleValueForProperty(selection, 'color', '#000'),
      );
      updateToolbarState(
        'bgColor',
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          '#fff',
        ),
      );
      updateToolbarState(
        'fontFamily',
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'),
      );
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        );
      }

      // If matchingParent is a valid node, pass it's format type
      updateToolbarState(
        'elementFormat',
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType() || 'left',
      );
    }
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      // Update text format
      updateToolbarState('isBold', selection.hasFormat('bold'));
      updateToolbarState('isItalic', selection.hasFormat('italic'));
      updateToolbarState('isUnderline', selection.hasFormat('underline'));
      updateToolbarState(
        'isStrikethrough',
        selection.hasFormat('strikethrough'),
      );
      updateToolbarState('isSubscript', selection.hasFormat('subscript'));
      updateToolbarState('isSuperscript', selection.hasFormat('superscript'));
      updateToolbarState('isHighlight', selection.hasFormat('highlight'));
      updateToolbarState('isCode', selection.hasFormat('code'));
      updateToolbarState(
        'fontSize',
        $getSelectionStyleValueForProperty(selection, 'font-size', '15px'),
      );
      updateToolbarState('isLowercase', selection.hasFormat('lowercase'));
      updateToolbarState('isUppercase', selection.hasFormat('uppercase'));
      updateToolbarState('isCapitalize', selection.hasFormat('capitalize'));
    }
  }, [activeEditor, editor, updateToolbarState]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        $updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar, setActiveEditor]);

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      $updateToolbar();
    });
  }, [activeEditor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          updateToolbarState('canUndo', payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          updateToolbarState('canRedo', payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [$updateToolbar, activeEditor, editor, updateToolbarState]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? {tag: 'historic'} : {},
      );
    },
    [activeEditor],
  );

  const onFontColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({color: value}, skipHistoryStack);
    },
    [applyStyleText],
  );

  const onBgColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({'background-color': value}, skipHistoryStack);
    },
    [applyStyleText],
  );

  const insertLink = useCallback(() => {
    if (!toolbarState.isLink) {
      setIsLinkEditMode(true);
      activeEditor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl('https://'),
      );
    } else {
      setIsLinkEditMode(false);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, setIsLinkEditMode, toolbarState.isLink]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey],
  );
  const insertGifOnClick = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
  };

  const canViewerSeeInsertDropdown = !toolbarState.isImageCaption;
  const canViewerSeeInsertCodeButton = !toolbarState.isImageCaption;

  const buttonClassName = 'cursor-pointer rounded hover:bg-default-900 hover:text-default-50 disabled:opacity-50';
  const activeButtonClassName = 'bg-default-500 text-default-50';

  const {hasDynamicContent} = useDynamicContent();

  return (
      <div className="flex flex-row h-12 gap-2 p-1 overflow-y-auto">
      <button
        disabled={!toolbarState.canUndo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title={`Undo (${SHORTCUTS.UNDO})`}
        type="button"
        className={buttonClassName}
        aria-label="Undo">
        <ArrowCounterclockwise size={24} />
      </button>
      <button
        disabled={!toolbarState.canRedo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title={`Redo (${SHORTCUTS.REDO})`}
        type="button"
        className={buttonClassName}
        aria-label="Redo">
        <ArrowClockwise size={24} />
      </button>
      <Divider />
      {toolbarState.blockType in blockTypeToBlockName &&
        activeEditor === editor && (
          <>
            <BlockFormatDropDown
              disabled={!isEditable}
              blockType={toolbarState.blockType}
              rootType={toolbarState.rootType}
              editor={activeEditor}
            />
            <Divider />
          </>
        )}
          <FontDropDown
            disabled={!isEditable}
            style={'font-family'}
            value={toolbarState.fontFamily}
            editor={activeEditor}
          />
          <Divider />
          <FontSize
            selectionFontSize={toolbarState.fontSize.slice(0, -2)}
            editor={activeEditor}
            disabled={!isEditable}
          />
          <Divider />
          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
            className={
              buttonClassName + ' ' + (toolbarState.isBold ? activeButtonClassName : '')
            }
            title={`Bold (${SHORTCUTS.BOLD})`}
            type="button"
            aria-label={`Format text as bold. Shortcut: ${SHORTCUTS.BOLD}`}>
            <TypeBold size={24} />
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}
            className={
                buttonClassName + ' ' + (toolbarState.isItalic ? activeButtonClassName : '')
            }
            title={`Italic (${SHORTCUTS.ITALIC})`}
            type="button"
            aria-label={`Format text as italics. Shortcut: ${SHORTCUTS.ITALIC}`}>
            <TypeItalic size={24} />
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}
            className={
                buttonClassName + ' ' + (toolbarState.isUnderline ? activeButtonClassName : '')
            }
            title={`Underline (${SHORTCUTS.UNDERLINE})`}
            type="button"
            aria-label={`Format text to underlined. Shortcut: ${SHORTCUTS.UNDERLINE}`}>
            <TypeUnderline size={24} />
          </button>
          <button
              disabled={!isEditable}
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
              }}
              className={
                  buttonClassName + ' ' + (toolbarState.isStrikethrough ? activeButtonClassName : '')
              }
              title={`Underline (${SHORTCUTS.STRIKETHROUGH})`}
              type="button"
              aria-label={`Format text to underlined. Shortcut: ${SHORTCUTS.STRIKETHROUGH}`}>
            <TypeStrikethrough size={24} />
          </button>
          <DropdownColorPicker
            disabled={!isEditable}
            buttonElement={<div className={'p-1'}>
              <div className={'text-xl leading-none'}>A</div>
              <div className="h-1 w-full bg-default-500" />
            </div>}
            buttonClassName={buttonClassName + ' w-6'}
            color={toolbarState.fontColor}
            onChange={onFontColorSelect}
            title="text color"
          />
          <DropdownColorPicker
            disabled={!isEditable}
            buttonElement={<PaintBucket size={24} />}
            buttonClassName={buttonClassName}
            color={toolbarState.bgColor}
            onChange={onBgColorSelect}
            title="bg color"
          />
        <button
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'lowercase');
            }}
            className={
                buttonClassName + ' ' + (toolbarState.isLowercase ? activeButtonClassName : '')
            }
            title={`Lowercase (${SHORTCUTS.LOWERCASE})`}
            aria-label="Format text to lowercase"
            type="button"
        >
          <Alphabet size={24} className={'py-0.5 w-6'} />
        </button>
        <button
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'uppercase');
            }}
            className={
                buttonClassName + ' ' + (toolbarState.isUppercase ? activeButtonClassName : '')
            }
            title={`Uppercase (${SHORTCUTS.UPPERCASE})`}
            aria-label="Format text to uppercase"
            type="button"
        >
          <AlphabetUppercase size={24} className={'py-0.5 w-6'}/>
        </button>
        <button
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'capitalize');
            }}
            className={
                buttonClassName + ' ' + (toolbarState.isCapitalize ? activeButtonClassName : '')
            }
            title={`Capitalize (${SHORTCUTS.CAPITALIZE})`}
            aria-label="Format text to capitalize"
            type="button"
        >
          <Type size={24} />
        </button>
        <button
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
            }}
            className={
                buttonClassName + ' ' + (toolbarState.isSubscript ? activeButtonClassName : '')
            }
            title={`Subscript (${SHORTCUTS.SUBSCRIPT})`}
            aria-label="Format text with a subscript"
            type="button"
        >
          <Subscript size={24} />
        </button>
        <button
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
            }}
            className={
                buttonClassName + ' ' + (toolbarState.isSuperscript ? activeButtonClassName : '')
            }
            title={`Superscript (${SHORTCUTS.SUPERSCRIPT})`}
            aria-label="Format text with a superscript"
            type="button"
        >
          <Superscript size={24} />
        </button>
        {/*<button*/}
        {/*    onClick={() => {*/}
        {/*      activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight');*/}
        {/*    }}*/}
        {/*    className={*/}
        {/*        'item wide ' + dropDownActiveClass(toolbarState.isHighlight)*/}
        {/*    }*/}
        {/*    title="Highlight"*/}
        {/*    aria-label="Format text with a highlight">*/}
        {/*  <Highlighter size={24} />*/}
        {/*</button>*/}
        <button
            className={
                buttonClassName + ' ' + (toolbarState.blockType === 'bullet' ? activeButtonClassName : '')
            }
            onClick={() => formatBulletList(editor, toolbarState.blockType)}
            title={`Bullet List (${SHORTCUTS.BULLET_LIST})`}
            aria-label={`Format text as bullet list. Shortcut: ${SHORTCUTS.BULLET_LIST}`}
            type="button"
        >
          <ListTask size={24} />
        </button>
        <button
            className={
                buttonClassName + ' ' + (toolbarState.blockType === 'number' ? activeButtonClassName : '')
            }
            onClick={() => formatNumberedList(editor, toolbarState.blockType)}
            title={`Numbered List (${SHORTCUTS.NUMBERED_LIST})`}
            aria-label={`Format text as numbered list. Shortcut: ${SHORTCUTS.NUMBERED_LIST}`}
            type="button"
        >
          <ListOl size={24} />
        </button>
        <button
            onClick={() => clearFormatting(activeEditor)}
            className={buttonClassName}
            title={`Clear text formatting (${SHORTCUTS.CLEAR_FORMATTING})`}
            aria-label="Clear all text formatting"
            type="button"
        >
          <Eraser size={24} />
        </button>

          {canViewerSeeInsertDropdown && (
            <>
              <Divider />
              <DropDown
                disabled={!isEditable}
                buttonClassName="toolbar-item spaced"
                buttonLabel="Insert"
                buttonAriaLabel="Insert specialized editor node"
                buttonIconClassName="icon plus">
                <DropDownItem
                  onClick={() => {
                    activeEditor.dispatchCommand(
                      INSERT_HORIZONTAL_RULE_COMMAND,
                      undefined,
                    );
                  }}
                  className="item"
                  icon={<FileBreak size={20} />}
                >
                  <span className="text">Horizontal Rule</span>
                </DropDownItem>
                <DropDownItem
                  onClick={() => {
                    activeEditor.dispatchCommand(INSERT_PAGE_BREAK, undefined);
                  }}
                  className="item"
                  icon={<Scissors size={20} />}
                >
                  <span className="text">Page Break</span>
                </DropDownItem>
                <DropDownItem
                  onClick={() => {
                    showModal('Insert Image', (onClose) => (
                      <InsertImageDialog
                        activeEditor={activeEditor}
                        onClose={onClose}
                      />
                    ));
                  }}
                  className="item"
                  icon={<Image size={20} />}
                >
                  <span className="text">Image</span>
                </DropDownItem>
                  {hasDynamicContent && <DropDownItem
                      onClick={() => {
                          showModal('Insert Dynamic Content', (onClose) => (
                              <InsertDynamicContentDialog
                                  activeEditor={activeEditor}
                                  onClose={onClose}
                              />
                          ));
                      }}
                      className="item"
                      icon={<span className={'text-2xl leading-none'}>➲</span>}
                  >
                      <span className="text">Dynamic Content</span>
                  </DropDownItem>}
              </DropDown>
            </>
          )}

      <Divider />
      <ElementFormatDropdown
        disabled={!isEditable}
        value={toolbarState.elementFormat}
        editor={activeEditor}
        isRTL={toolbarState.isRTL}
      />

      {modal}
    </div>
  );
}
