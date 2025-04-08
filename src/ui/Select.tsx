/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {JSX} from 'react';

import './Select.css';

import * as React from 'react';

type SelectIntrinsicProps = JSX.IntrinsicElements['select'];
interface SelectProps extends SelectIntrinsicProps {
  label: string;
}

export default function Select({
  children,
  label,
  className,
  ...other
}: SelectProps): JSX.Element {
  return (
    <div className="flex flex-row items-center mb-2 gap-2">
      <label style={{marginTop: '-1em'}} className="text-default-700 flex flex-1">
        {label}
      </label>
      <select {...other} className={ className + " bg-default-200 border border-gray-300 text-default-700 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "}>
        {children}
      </select>
    </div>
  );
}
