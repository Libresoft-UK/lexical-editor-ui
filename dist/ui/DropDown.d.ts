/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { JSX } from 'react';
import * as React from 'react';
import { ReactNode } from 'react';
export declare function DropDownItem({ children, className, onClick, title, shortcut, icon, }: {
    children: React.ReactNode;
    className: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    title?: string;
    shortcut?: string;
    icon?: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export default function DropDown({ disabled, buttonLabel, buttonAriaLabel, buttonClassName, buttonIconClassName, buttonElement, children, stopCloseOnClickSelf, }: {
    disabled?: boolean;
    buttonAriaLabel?: string;
    buttonClassName?: string;
    buttonIconClassName?: string;
    buttonLabel?: React.ReactNode;
    buttonElement?: React.ReactNode;
    children: ReactNode;
    stopCloseOnClickSelf?: boolean;
}): JSX.Element;
