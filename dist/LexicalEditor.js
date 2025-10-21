import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useMemo } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { $isTextNode, TextNode } from 'lexical';
import { SharedHistoryContext } from './context/SharedHistoryContext';
import { ToolbarContext } from './context/ToolbarContext';
import Editor from './Editor';
import { parseAllowedFontSize } from './plugins/ToolbarPlugin/fontSize';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import { parseAllowedColor } from './ui/ColorPicker';
import InitialiseValuePlugin from "./plugins/InitialiseValuePlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $generateHtmlFromNodes } from '@lexical/html';
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import { cn } from "./utils/joinClasses";
import { DynamicContentProvider } from "./context/DynamicContentContext";
// Additional nodes imported from lexical packages
import { ListItemNode, ListNode } from '@lexical/list';
import { OverflowNode } from '@lexical/overflow';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
// Custom nodes
import { EmojiNode } from './nodes/EmojiNode';
import { ImageNode } from './nodes/ImageNode';
import { PageBreakNode } from './nodes/PageBreakNode';
import { SpecialTextNode } from './nodes/SpecialTextNode';
import { DynamicContentNode } from "./nodes/DynamicContentNode";
function getExtraStyles(element) {
    // Parse styles from pasted input, but only if they match exactly the
    // sort of styles that would be produced by exportDOM
    let extraStyles = '';
    const fontSize = parseAllowedFontSize(element.style.fontSize);
    const backgroundColor = parseAllowedColor(element.style.backgroundColor);
    const color = parseAllowedColor(element.style.color);
    if (fontSize !== '' && fontSize !== '15px') {
        extraStyles += `font-size: ${fontSize};`;
    }
    if (backgroundColor !== '' && backgroundColor !== 'rgb(255, 255, 255)') {
        extraStyles += `background-color: ${backgroundColor};`;
    }
    if (color !== '' && color !== 'rgb(0, 0, 0)') {
        extraStyles += `color: ${color};`;
    }
    return extraStyles;
}
function buildImportMap() {
    const importMap = {};
    // Wrap all TextNode importers with a function that also imports
    // the custom styles implemented by the playground
    for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
        importMap[tag] = (importNode) => {
            const importer = fn(importNode);
            if (!importer) {
                return null;
            }
            return {
                ...importer,
                conversion: (element) => {
                    const output = importer.conversion(element);
                    if (output === null ||
                        output.forChild === undefined ||
                        output.after !== undefined ||
                        output.node !== null) {
                        return output;
                    }
                    const extraStyles = getExtraStyles(element);
                    if (extraStyles) {
                        const { forChild } = output;
                        return {
                            ...output,
                            forChild: (child, parent) => {
                                const textNode = forChild(child, parent);
                                if ($isTextNode(textNode)) {
                                    textNode.setStyle(textNode.getStyle() + extraStyles);
                                }
                                return textNode;
                            },
                        };
                    }
                    return output;
                },
            };
        };
    }
    return importMap;
}
const nodePluginMap = [
    { node: HeadingNode, key: 'base' },
    { node: ListNode, key: 'list' },
    { node: ListItemNode, key: 'list' },
    { node: QuoteNode, key: 'quotes' },
    { node: OverflowNode, key: 'base' },
    { node: ImageNode, key: 'images' },
    { node: EmojiNode, key: 'emojis' },
    { node: HorizontalRuleNode, key: 'horizontalRule' },
    { node: PageBreakNode, key: 'pageBreak' },
    { node: SpecialTextNode, key: 'specialText' },
    { node: DynamicContentNode, key: 'dynamicContents' },
];
function getEnabledNodes(plugins) {
    if (!plugins)
        return nodePluginMap.map(({ node }) => node);
    return nodePluginMap
        .filter(({ key }) => plugins[key] !== false)
        .map(({ node }) => node);
}
export function LexicalEditor({ src = null, onChange, debug = false, classNames, plugins, dynamicContentOptions = [] }) {
    const enabledNodes = useMemo(() => getEnabledNodes(plugins), [plugins]);
    const initialConfig = {
        editorState: null,
        html: { import: buildImportMap() },
        namespace: 'LexicalEditor',
        nodes: [...enabledNodes],
        onError: (error) => {
            //throw error;
        },
        theme: PlaygroundEditorTheme,
    };
    function handleOnChange(editorState, editor, tags) {
        debug && console.log('onChange', editorState, editor, tags);
        if (tags.has('focus') || tags.has('init')) {
            // prevent onChange from being called when the editor is focused on load
            return;
        }
        // Call toJSON on the EditorState object, which produces a serialization safe string
        const editorStateJSON = editorState.toJSON();
        // export the editor state to HTML
        editor.read(() => {
            const htmlString = $generateHtmlFromNodes(editor, null);
            debug && console.log('HTML String:', htmlString);
            // Call onChange with the JSON string and the HTML string
            onChange && onChange(editorStateJSON, htmlString);
        });
    }
    return (_jsxs(LexicalComposer, { initialConfig: initialConfig, children: [_jsx(SharedHistoryContext, { children: _jsx(DynamicContentProvider, { options: dynamicContentOptions, children: _jsxs(ToolbarContext, { children: [_jsx("div", { className: cn('bg-default-100 text-default-900 flex flex-col h-full rounded-md p-1 overflow-auto shadow', classNames?.wrapper), children: _jsx(Editor, { classNames: { content: classNames?.editor }, plugins: plugins }) }), debug && _jsx(TreeViewPlugin, {})] }) }) }), _jsx(InitialiseValuePlugin, { src: src }), _jsx(OnChangePlugin, { onChange: handleOnChange, ignoreSelectionChange: true })] }));
}
