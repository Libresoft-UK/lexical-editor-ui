/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {JSX, useMemo} from 'react';

import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {ClearEditorPlugin} from '@lexical/react/LexicalClearEditorPlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {HorizontalRulePlugin} from '@lexical/react/LexicalHorizontalRulePlugin';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {SelectionAlwaysOnDisplay} from '@lexical/react/LexicalSelectionAlwaysOnDisplay';
import {TabIndentationPlugin} from '@lexical/react/LexicalTabIndentationPlugin';
import {useLexicalEditable} from '@lexical/react/useLexicalEditable';
import {CAN_USE_DOM} from '@lexical/utils';
import * as React from 'react';
import {useEffect, useState} from 'react';

import {useSharedHistoryContext} from './context/SharedHistoryContext';
import DragDropPaste from './plugins/DragDropPastePlugin';
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';
import EmojiPickerPlugin from './plugins/EmojiPickerPlugin';
import EmojisPlugin from './plugins/EmojisPlugin';
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin';
import ImagesPlugin from './plugins/ImagesPlugin';
import PageBreakPlugin from './plugins/PageBreakPlugin';
import ShortcutsPlugin from './plugins/ShortcutsPlugin';
import SpecialTextPlugin from './plugins/SpecialTextPlugin';
import TabFocusPlugin from './plugins/TabFocusPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import ContentEditable from './ui/ContentEditable';
import {cn} from "./utils/joinClasses";
import DynamicContentsPlugin from "./plugins/DynamicContentPlugin";

export type pluginOptions = {
  dragDropPaste?: boolean;
  autoFocus?: boolean;
  emojiPicker?: boolean;
  emojis?: boolean;
  history?: boolean;
  list?: boolean;
  quotes?: boolean;
  images?: boolean;
  horizontalRule?: boolean;
  pageBreak?: boolean;
  draggableBlock?: boolean;
  floatingTextFormatToolbar?: boolean;
  specialText?: boolean;
  /* default: false */
  dynamicContents?: boolean;
}

interface EditorProps {
  classNames?: {
    content?: string;
  },
  plugins?: pluginOptions;
}

export default function Editor({classNames, plugins}:EditorProps): JSX.Element {
  const {historyState} = useSharedHistoryContext();

  const isEditable = useLexicalEditable();
  const placeholder = 'Enter some rich text...';
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener('resize', updateViewPortWidth);

    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  return (
  <>
      <ToolbarPlugin
          editor={editor}
          activeEditor={activeEditor}
          setActiveEditor={setActiveEditor}
          setIsLinkEditMode={setIsLinkEditMode}
          plugins={plugins}
        />

      <ShortcutsPlugin
          editor={activeEditor}
          setIsLinkEditMode={setIsLinkEditMode}
      />

      <div className={`editor-container`}>
        <SelectionAlwaysOnDisplay />
        <TabFocusPlugin />
        <TabIndentationPlugin maxIndent={7} />
        <RichTextPlugin
            contentEditable={
              <div className={cn("editor-scroller overflow-auto", classNames?.content)}>
                <div className="editor relative" ref={onRef}>
                  <ContentEditable placeholder={placeholder} />
                </div>
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
        />
        {plugins?.dragDropPaste !== false && <DragDropPaste />}
        {plugins?.autoFocus !== false && <AutoFocusPlugin />}
        {plugins?.emojiPicker !== false && <EmojiPickerPlugin />}
        {plugins?.emojis !== false && <EmojisPlugin />}
        {plugins?.history !== false && <HistoryPlugin externalHistoryState={historyState} />}

        {plugins?.list !== false && <ListPlugin />}
        {plugins?.images !== false && <ImagesPlugin />}
        {plugins?.horizontalRule !== false && <HorizontalRulePlugin />}

        {plugins?.pageBreak !== false && <PageBreakPlugin />}
        {plugins?.floatingTextFormatToolbar !== false && floatingAnchorElem && !isSmallWidthViewport && (<>
          <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
          <FloatingTextFormatToolbarPlugin
            anchorElem={floatingAnchorElem}
            setIsLinkEditMode={setIsLinkEditMode}
          />
        </>)}
        {plugins?.specialText !== false && <SpecialTextPlugin />}
        {/*{plugins?.keywords !== false && <KeywordsPlugin />}*/}
        {plugins?.dynamicContents !== false && <DynamicContentsPlugin />}
      </div>
    </>
  );
}
