/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


import {JSX, useMemo} from 'react';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {
  $isTextNode,
  DOMConversionMap, EditorState,
    LexicalEditor as _LexicalEditor,
  TextNode,
  Klass, LexicalNode
} from 'lexical';

import {SharedHistoryContext} from './context/SharedHistoryContext';
import {ToolbarContext} from './context/ToolbarContext';
import Editor, {pluginOptions} from './Editor';
import {parseAllowedFontSize} from './plugins/ToolbarPlugin/fontSize';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import {parseAllowedColor} from './ui/ColorPicker';
import InitialiseValuePlugin from "./plugins/InitialiseValuePlugin";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";
import * as React from "react";
import { $generateHtmlFromNodes } from '@lexical/html';
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import {cn} from "./utils/joinClasses";
import {DCOption, DynamicContentProvider} from "./context/DynamicContentContext";

// Additional nodes imported from lexical packages
import {ListItemNode, ListNode} from '@lexical/list';
import {OverflowNode} from '@lexical/overflow';
import {HorizontalRuleNode} from '@lexical/react/LexicalHorizontalRuleNode';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';

// Custom nodes
import {EmojiNode} from './nodes/EmojiNode';
import {ImageNode} from './nodes/ImageNode';
import {PageBreakNode} from './nodes/PageBreakNode';
import {SpecialTextNode} from './nodes/SpecialTextNode';
import {DynamicContentNode} from "./nodes/DynamicContentNode";

function getExtraStyles(element: HTMLElement): string {
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

function buildImportMap(): DOMConversionMap {
  const importMap: DOMConversionMap = {};

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
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output;
          }
          const extraStyles = getExtraStyles(element);
          if (extraStyles) {
            const {forChild} = output;
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

const nodePluginMap: {node: Klass<LexicalNode>, key: keyof pluginOptions | 'base'}[] = [
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

function getEnabledNodes(plugins?: pluginOptions) {
  if (!plugins) return nodePluginMap.map(({ node }) => node);
  return nodePluginMap
      .filter(({ key }) => plugins[key as keyof pluginOptions] !== false)
      .map(({ node }) => node);
}

export interface LexicalEditorProps {
  src?: string | null;
  onChange?: (json: any, html: string) => void;
  debug?: boolean;
  classNames?: {
    wrapper?: string;
    editor?: string;
  };
  plugins?: pluginOptions
  dynamicContentOptions?: DCOption[];
}

export function LexicalEditor({src = null, onChange, debug = false, classNames, plugins, dynamicContentOptions = []}:LexicalEditorProps): JSX.Element {

  const enabledNodes = useMemo(() => getEnabledNodes(plugins), [plugins]);

  const initialConfig = {
    editorState: null,
    html: {import: buildImportMap()},
    namespace: 'LexicalEditor',
    nodes: [...enabledNodes],
    onError: (error: Error) => {
      //throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  function handleOnChange(editorState: EditorState, editor: _LexicalEditor, tags: Set<string>) {
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
    })

  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <DynamicContentProvider options={dynamicContentOptions} >
          <ToolbarContext>
            <div className={cn('bg-default-100 text-default-900 flex flex-col h-full rounded-md p-1 overflow-auto shadow', classNames?.wrapper)}>
              <Editor classNames={{content: classNames?.editor}} plugins={plugins}/>
            </div>
            {debug && <TreeViewPlugin/>}
            {/*{isDevPlayground ? <DocsPlugin /> : null}*/}
            {/*{isDevPlayground ? <PasteLogPlugin /> : null}*/}
          </ToolbarContext>
        </DynamicContentProvider>
      </SharedHistoryContext>
      <InitialiseValuePlugin src={src} />
      <OnChangePlugin onChange={handleOnChange} ignoreSelectionChange={true} />
    </LexicalComposer>
  );
}

