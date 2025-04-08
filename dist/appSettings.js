/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export const isDevPlayground = false;
export const DEFAULT_SETTINGS = {
    disableBeforeInput: false,
    emptyEditor: isDevPlayground,
    hasLinkAttributes: false,
    isAutocomplete: false,
    isCharLimit: false,
    isCharLimitUtf8: false,
    isMaxLength: false,
    isRichText: true,
    measureTypingPerf: false,
    selectionAlwaysOnDisplay: false,
    shouldAllowHighlightingWithBrackets: false,
    shouldPreserveNewLinesInMarkdown: false,
    shouldUseLexicalContextMenu: false,
    showNestedEditorTreeView: false,
    showTableOfContents: false,
    showTreeView: true,
    tableCellBackgroundColor: true,
    tableCellMerge: true,
    tableHorizontalScroll: true,
};
// These are mutated in setupEnv
export const INITIAL_SETTINGS = {
    ...DEFAULT_SETTINGS,
};
