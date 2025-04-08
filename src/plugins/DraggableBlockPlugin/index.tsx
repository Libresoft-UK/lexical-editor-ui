/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type {JSX} from 'react';

import './index.css';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {DraggableBlockPlugin_EXPERIMENTAL} from '@lexical/react/LexicalDraggableBlockPlugin';
import {$createParagraphNode, $getNearestNodeFromDOMNode} from 'lexical';
import {useRef, useState} from 'react';
import {Grid3x2GapFill, Plus} from "react-bootstrap-icons";

const DRAGGABLE_BLOCK_MENU_CLASSNAME = 'draggable-block-menu';

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

export default function DraggableBlockPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);
  const [draggableElement, setDraggableElement] = useState<HTMLElement | null>(
    null,
  );

  function insertBlock(e: React.MouseEvent) {
    if (!draggableElement || !editor) {
      return;
    }

    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(draggableElement);
      if (!node) {
        return;
      }

      const pNode = $createParagraphNode();
      if (e.altKey || e.ctrlKey) {
        node.insertBefore(pNode);
      } else {
        node.insertAfter(pNode);
      }
      pNode.select();
    });
  }

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={anchorElem}
      menuRef={menuRef}
      targetLineRef={targetLineRef}
      menuComponent={
        <div ref={menuRef} className="icon draggable-block-menu absolute left-0 top-0 flex gap-0.5 cursor-grab items-center will-change-transform text-default-400">
          <button
            title="Click to add below"
            onClick={insertBlock}
          >
            <Plus size={18} className={'text-gray-400 hover:bg-blue-400 hover:text-white rounded'}/>
          </button>
          <Grid3x2GapFill size={18} className={'text-gray-400 hover:bg-blue-400 hover:text-white rounded p-0.5'}/>
        </div>
      }
      targetLineComponent={
        <div ref={targetLineRef} className="draggable-block-target-line pointer-events-none bg-blue-400 rounded h-1 absolute left-0 top-0 will-change-transform" />
      }
      isOnMenu={isOnMenu}
      onElementChanged={setDraggableElement}
    />
  );
}
