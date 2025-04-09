import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { SelectionAlwaysOnDisplay } from '@lexical/react/LexicalSelectionAlwaysOnDisplay';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { CAN_USE_DOM } from '@lexical/utils';
import { useEffect, useState } from 'react';
import { useSharedHistoryContext } from './context/SharedHistoryContext';
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
export default function Editor() {
    const { historyState } = useSharedHistoryContext();
    const isEditable = useLexicalEditable();
    const placeholder = 'Enter some rich text...';
    const [floatingAnchorElem, setFloatingAnchorElem] = useState(null);
    const [isSmallWidthViewport, setIsSmallWidthViewport] = useState(false);
    const [editor] = useLexicalComposerContext();
    const [activeEditor, setActiveEditor] = useState(editor);
    const [isLinkEditMode, setIsLinkEditMode] = useState(false);
    const onRef = (_floatingAnchorElem) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };
    useEffect(() => {
        const updateViewPortWidth = () => {
            const isNextSmallWidthViewport = CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;
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
    return (_jsxs(_Fragment, { children: [_jsx(ToolbarPlugin, { editor: editor, activeEditor: activeEditor, setActiveEditor: setActiveEditor, setIsLinkEditMode: setIsLinkEditMode }), _jsx(ShortcutsPlugin, { editor: activeEditor, setIsLinkEditMode: setIsLinkEditMode }), _jsxs("div", { className: `editor-container tree-view`, children: [_jsx(DragDropPaste, {}), _jsx(AutoFocusPlugin, {}), _jsx(SelectionAlwaysOnDisplay, {}), _jsx(ClearEditorPlugin, {}), _jsx(EmojiPickerPlugin, {}), _jsx(EmojisPlugin, {}), _jsx(HistoryPlugin, { externalHistoryState: historyState }), _jsx(RichTextPlugin, { contentEditable: _jsx("div", { className: "editor-scroller", children: _jsx("div", { className: "editor relative", ref: onRef, children: _jsx(ContentEditable, { placeholder: placeholder }) }) }), ErrorBoundary: LexicalErrorBoundary }), _jsx(ListPlugin, {}), _jsx(ImagesPlugin, {}), _jsx(HorizontalRulePlugin, {}), _jsx(TabFocusPlugin, {}), _jsx(TabIndentationPlugin, { maxIndent: 7 }), _jsx(PageBreakPlugin, {}), floatingAnchorElem && !isSmallWidthViewport && (_jsxs(_Fragment, { children: [_jsx(DraggableBlockPlugin, { anchorElem: floatingAnchorElem }), _jsx(FloatingTextFormatToolbarPlugin, { anchorElem: floatingAnchorElem, setIsLinkEditMode: setIsLinkEditMode })] })), _jsx(SpecialTextPlugin, {})] })] }));
}
