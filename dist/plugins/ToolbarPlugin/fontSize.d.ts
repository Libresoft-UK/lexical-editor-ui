/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import './fontSize.css';
import { LexicalEditor } from 'lexical';
export declare function parseAllowedFontSize(input: string): string;
export default function FontSize({ selectionFontSize, disabled, editor, }: {
    selectionFontSize: string;
    disabled: boolean;
    editor: LexicalEditor;
}): import("react/jsx-runtime").JSX.Element;
