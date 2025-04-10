/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { JSX } from 'react';
interface LexicalEditorProps {
    src?: string | null;
    onChange?: (json: any, html: string) => void;
    debug?: boolean;
    classNames?: {
        wrapper?: string;
        editor?: string;
    };
}
export declare function LexicalEditor({ src, onChange, debug, classNames }: LexicalEditorProps): JSX.Element;
export {};
