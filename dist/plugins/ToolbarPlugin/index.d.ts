/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { JSX } from 'react';
import { LexicalEditor } from 'lexical';
import { Dispatch } from 'react';
import { pluginOptions } from "../../Editor";
export default function ToolbarPlugin({ editor, activeEditor, setActiveEditor, setIsLinkEditMode, plugins, }: {
    editor: LexicalEditor;
    activeEditor: LexicalEditor;
    setActiveEditor: Dispatch<LexicalEditor>;
    setIsLinkEditMode: Dispatch<boolean>;
    plugins?: pluginOptions;
}): JSX.Element;
