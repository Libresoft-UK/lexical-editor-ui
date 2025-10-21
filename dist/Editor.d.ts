/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { JSX } from 'react';
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
    dynamicContents?: boolean;
};
interface EditorProps {
    classNames?: {
        content?: string;
    };
    plugins?: pluginOptions;
}
export default function Editor({ classNames, plugins }: EditorProps): JSX.Element;
export {};
