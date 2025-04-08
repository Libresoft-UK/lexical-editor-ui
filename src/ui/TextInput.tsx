/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {JSX} from 'react';

import './Input.css';

import * as React from 'react';
import {HTMLInputTypeAttribute} from 'react';

type Props = Readonly<{
  'data-test-id'?: string;
  label: string;
  onChange: (val: string) => void;
  placeholder?: string;
  value: string;
  type?: HTMLInputTypeAttribute;
}>;

export default function TextInput({
  label,
  value,
  onChange,
  placeholder = '',
  'data-test-id': dataTestId,
  type = 'text',
}: Props): JSX.Element {
  return (
    <div className="flex flex-row items-center mb-2 gap-2">
      <label className="text-default-700 flex flex-1">{label}</label>
      <input
        type={type}
        className="flex-1 bg-default-200 border-0 text-default-700 text-sm rounded-lg block p-2.5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none focus-visible:border-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        data-test-id={dataTestId}
      />
    </div>
  );
}
