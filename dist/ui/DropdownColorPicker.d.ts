/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import * as React from 'react';
type Props = {
    disabled?: boolean;
    buttonAriaLabel?: string;
    buttonClassName?: string;
    buttonIconClassName?: string;
    buttonLabel?: string;
    buttonElement?: React.ReactNode;
    title?: string;
    stopCloseOnClickSelf?: boolean;
    color: string;
    onChange?: (color: string, skipHistoryStack: boolean) => void;
};
export default function DropdownColorPicker({ disabled, stopCloseOnClickSelf, color, onChange, ...rest }: Props): import("react/jsx-runtime").JSX.Element;
export {};
