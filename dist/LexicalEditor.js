import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useState } from 'react';
import { $createLinkNode } from '@lexical/link';
import { $createListItemNode, $createListNode } from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createParagraphNode, $createTextNode, $getRoot, $isTextNode, TextNode, } from 'lexical';
import { SharedHistoryContext } from './context/SharedHistoryContext';
import { ToolbarContext } from './context/ToolbarContext';
import Editor from './Editor';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import { parseAllowedFontSize } from './plugins/ToolbarPlugin/fontSize';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import { parseAllowedColor } from './ui/ColorPicker';
import InitialiseValuePlugin from "./plugins/InitialiseValuePlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $generateHtmlFromNodes } from '@lexical/html';
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import { cn } from "./utils/joinClasses";
import { DynamicContentProvider } from "./context/DynamicContentContext";
function $prepopulatedRichText() {
    const root = $getRoot();
    if (root.getFirstChild() === null) {
        const heading = $createHeadingNode('h1');
        heading.append($createTextNode('Welcome to the playground'));
        root.append(heading);
        const quote = $createQuoteNode();
        quote.append($createTextNode(`In case you were wondering what the black box at the bottom is – it's the debug view, showing the current state of the editor. ` +
            `You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.`));
        root.append(quote);
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode('The playground is a demo environment built with '), $createTextNode('@lexical/react').toggleFormat('code'), $createTextNode('.'), $createTextNode(' Try typing in '), $createTextNode('some text').toggleFormat('bold'), $createTextNode(' with '), $createTextNode('different').toggleFormat('italic'), $createTextNode(' formats.'));
        root.append(paragraph);
        const paragraph2 = $createParagraphNode();
        paragraph2.append($createTextNode('Make sure to check out the various plugins in the toolbar. You can also use #hashtags or @-mentions too!'));
        root.append(paragraph2);
        const paragraph3 = $createParagraphNode();
        paragraph3.append($createTextNode(`If you'd like to find out more about Lexical, you can:`));
        root.append(paragraph3);
        const list = $createListNode('bullet');
        list.append($createListItemNode().append($createTextNode(`Visit the `), $createLinkNode('https://lexical.dev/').append($createTextNode('Lexical website')), $createTextNode(` for documentation and more information.`)), $createListItemNode().append($createTextNode(`Check out the code on our `), $createLinkNode('https://github.com/facebook/lexical').append($createTextNode('GitHub repository')), $createTextNode(`.`)), $createListItemNode().append($createTextNode(`Playground code can be found `), $createLinkNode('https://github.com/facebook/lexical/tree/main/packages/lexical-playground').append($createTextNode('here')), $createTextNode(`.`)), $createListItemNode().append($createTextNode(`Join our `), $createLinkNode('https://discord.com/invite/KmG4wQnnD9').append($createTextNode('Discord Server')), $createTextNode(` and chat with the team.`)));
        root.append(list);
        const paragraph4 = $createParagraphNode();
        paragraph4.append($createTextNode(`Lastly, we're constantly adding cool new features to this playground. So make sure you check back here when you next get a chance :).`));
        root.append(paragraph4);
    }
}
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
export function LexicalEditor({ src = null, onChange, debug = false, classNames, dynamicContentOptions = [] }) {
    const [editorState, setEditorState] = useState(src);
    const initialConfig = {
        editorState: null,
        html: { import: buildImportMap() },
        namespace: 'Playground',
        nodes: [...PlaygroundNodes],
        onError: (error) => {
            throw error;
        },
        theme: PlaygroundEditorTheme,
    };
    function handleOnChange(editorState, editor, tags) {
        debug && console.log('onChange', editorState, editor, tags);
        if (tags.has('focus')) {
            // prevent onChange from being called when the editor is focused on load
            return;
        }
        // Call toJSON on the EditorState object, which produces a serialization safe string
        const editorStateJSON = editorState.toJSON();
        // Stringify the JSON object to a string
        const jsonString = JSON.stringify(editorStateJSON);
        // export the editor state to HTML
        editor.read(() => {
            const htmlString = $generateHtmlFromNodes(editor, null);
            debug && console.log('HTML String:', htmlString);
            // Call onChange with the JSON string and the HTML string
            onChange && onChange(jsonString, htmlString);
        });
        // Set the editor state to the JSON string
        setEditorState(jsonString);
    }
    return (_jsxs(LexicalComposer, { initialConfig: initialConfig, children: [_jsx(SharedHistoryContext, { children: _jsx(DynamicContentProvider, { options: dynamicContentOptions, children: _jsxs(ToolbarContext, { children: [_jsx("div", { className: cn('bg-default-100 text-default-900 flex flex-col h-full rounded-md p-1 overflow-auto shadow', classNames?.wrapper), children: _jsx(Editor, { classNames: { content: classNames?.editor } }) }), debug && _jsx(TreeViewPlugin, {})] }) }) }), _jsx(InitialiseValuePlugin, { src: src }), _jsx(OnChangePlugin, { onChange: handleOnChange, ignoreSelectionChange: true })] }));
}
