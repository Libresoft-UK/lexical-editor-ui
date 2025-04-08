/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {EditorThemeClasses} from 'lexical';

import './PlaygroundEditorTheme.css';

const theme: EditorThemeClasses = {
  autocomplete: 'PlaygroundEditorTheme__autocomplete',
  blockCursor: 'PlaygroundEditorTheme__blockCursor',
  characterLimit: 'PlaygroundEditorTheme__characterLimit',
  code: 'PlaygroundEditorTheme__code',
  codeHighlight: {
    atrule: 'PlaygroundEditorTheme__tokenAttr',
    attr: 'PlaygroundEditorTheme__tokenAttr',
    boolean: 'PlaygroundEditorTheme__tokenProperty',
    builtin: 'PlaygroundEditorTheme__tokenSelector',
    cdata: 'PlaygroundEditorTheme__tokenComment',
    char: 'PlaygroundEditorTheme__tokenSelector',
    class: 'PlaygroundEditorTheme__tokenFunction',
    'class-name': 'PlaygroundEditorTheme__tokenFunction',
    comment: 'PlaygroundEditorTheme__tokenComment',
    constant: 'PlaygroundEditorTheme__tokenProperty',
    deleted: 'PlaygroundEditorTheme__tokenProperty',
    doctype: 'PlaygroundEditorTheme__tokenComment',
    entity: 'PlaygroundEditorTheme__tokenOperator',
    function: 'PlaygroundEditorTheme__tokenFunction',
    important: 'PlaygroundEditorTheme__tokenVariable',
    inserted: 'PlaygroundEditorTheme__tokenSelector',
    keyword: 'PlaygroundEditorTheme__tokenAttr',
    namespace: 'PlaygroundEditorTheme__tokenVariable',
    number: 'PlaygroundEditorTheme__tokenProperty',
    operator: 'PlaygroundEditorTheme__tokenOperator',
    prolog: 'PlaygroundEditorTheme__tokenComment',
    property: 'PlaygroundEditorTheme__tokenProperty',
    punctuation: 'PlaygroundEditorTheme__tokenPunctuation',
    regex: 'PlaygroundEditorTheme__tokenVariable',
    selector: 'PlaygroundEditorTheme__tokenSelector',
    string: 'PlaygroundEditorTheme__tokenSelector',
    symbol: 'PlaygroundEditorTheme__tokenProperty',
    tag: 'PlaygroundEditorTheme__tokenProperty',
    url: 'PlaygroundEditorTheme__tokenOperator',
    variable: 'PlaygroundEditorTheme__tokenVariable',
  },
  embedBlock: {
    base: 'PlaygroundEditorTheme__embedBlock',
    focus: 'PlaygroundEditorTheme__embedBlockFocus',
  },
  hashtag: 'PlaygroundEditorTheme__hashtag',
  heading: {
    h1: 'text-6xl',
    h2: 'text-5xl',
    h3: 'text-4xl',
    h4: 'text-3xl',
    h5: 'text-2xl',
    h6: 'text-xl',
  },
  hr: 'PlaygroundEditorTheme__hr',
  hrSelected: 'PlaygroundEditorTheme__hrSelected',
  image: 'editor-image relative inline-block',
  indent: 'PlaygroundEditorTheme__indent',
  inlineImage: 'inline-editor-image',
  layoutContainer: 'PlaygroundEditorTheme__layoutContainer',
  layoutItem: 'PlaygroundEditorTheme__layoutItem',
  link: 'PlaygroundEditorTheme__link',
  list: {
    checklist: 'PlaygroundEditorTheme__checklist',
    listitem: ' ml-4',
    listitemChecked: 'PlaygroundEditorTheme__listItemChecked',
    listitemUnchecked: 'PlaygroundEditorTheme__listItemUnchecked',
    nested: {
      listitem: 'list-none',
    },
    olDepth: [
      'list-decimal',
      'list-[upper-alpha]',
      'list-[lower-alpha]',
      'list-[upper-roman]',
      'list-[lower-roman]',
    ],
    ul: 'list-outside list-disc',
    ol: 'list-outside ',
  },
  ltr: 'PlaygroundEditorTheme__ltr',
  mark: 'PlaygroundEditorTheme__mark',
  markOverlap: 'PlaygroundEditorTheme__markOverlap',
  paragraph: '',
  quote: 'p-4 my-4 bg-default-500 bg-opacity-10 border-l-4 border-gray-300',
  rtl: 'PlaygroundEditorTheme__rtl',
  specialText: 'PlaygroundEditorTheme__specialText',
  tab: 'PlaygroundEditorTheme__tabNode',
  text: {
    bold: 'text-bold',
    capitalize: 'capitalize',
    code: 'PlaygroundEditorTheme__textCode',
    highlight: 'PlaygroundEditorTheme__textHighlight',
    italic: 'italic',
    lowercase: 'lowercase',
    strikethrough: 'line-through',
    subscript: 'align-bottom text-xs',
    superscript: 'align-top text-xs',
    underline: 'underline',
    underlineStrikethrough: '[text-decoration:underline_line-through]',
    uppercase: 'uppercase',
  },
};

export default theme;
