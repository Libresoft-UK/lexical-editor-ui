/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { JSX } from 'react';
import { MenuOption } from '@lexical/react/LexicalContextMenuPlugin';
import { type LexicalNode } from 'lexical';
export declare class ContextMenuOption extends MenuOption {
    title: string;
    onSelect: (targetNode: LexicalNode | null) => void;
    constructor(title: string, options: {
        onSelect: (targetNode: LexicalNode | null) => void;
    });
}
export default function ContextMenuPlugin(): JSX.Element;
