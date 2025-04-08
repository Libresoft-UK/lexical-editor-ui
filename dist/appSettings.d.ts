/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export declare const isDevPlayground = false;
export declare const DEFAULT_SETTINGS: {
    readonly disableBeforeInput: false;
    readonly emptyEditor: false;
    readonly hasLinkAttributes: false;
    readonly isAutocomplete: false;
    readonly isCharLimit: false;
    readonly isCharLimitUtf8: false;
    readonly isMaxLength: false;
    readonly isRichText: true;
    readonly measureTypingPerf: false;
    readonly selectionAlwaysOnDisplay: false;
    readonly shouldAllowHighlightingWithBrackets: false;
    readonly shouldPreserveNewLinesInMarkdown: false;
    readonly shouldUseLexicalContextMenu: false;
    readonly showNestedEditorTreeView: false;
    readonly showTableOfContents: false;
    readonly showTreeView: true;
    readonly tableCellBackgroundColor: true;
    readonly tableCellMerge: true;
    readonly tableHorizontalScroll: true;
};
export declare const INITIAL_SETTINGS: Record<SettingName, boolean>;
export type SettingName = keyof typeof DEFAULT_SETTINGS;
export type Settings = typeof INITIAL_SETTINGS;
