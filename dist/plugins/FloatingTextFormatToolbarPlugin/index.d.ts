/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { JSX } from 'react';
import './index.css';
import { Dispatch } from 'react';
export default function FloatingTextFormatToolbarPlugin({ anchorElem, setIsLinkEditMode, }: {
    anchorElem?: HTMLElement;
    setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element | null;
