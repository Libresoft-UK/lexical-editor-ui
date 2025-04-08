import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './index.css';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DraggableBlockPlugin_EXPERIMENTAL } from '@lexical/react/LexicalDraggableBlockPlugin';
import { $createParagraphNode, $getNearestNodeFromDOMNode } from 'lexical';
import { useRef, useState } from 'react';
import { Grid3x2GapFill, Plus } from "react-bootstrap-icons";
const DRAGGABLE_BLOCK_MENU_CLASSNAME = 'draggable-block-menu';
function isOnMenu(element) {
    return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}
export default function DraggableBlockPlugin({ anchorElem = document.body, }) {
    const [editor] = useLexicalComposerContext();
    const menuRef = useRef(null);
    const targetLineRef = useRef(null);
    const [draggableElement, setDraggableElement] = useState(null);
    function insertBlock(e) {
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
            }
            else {
                node.insertAfter(pNode);
            }
            pNode.select();
        });
    }
    return (_jsx(DraggableBlockPlugin_EXPERIMENTAL, { anchorElem: anchorElem, menuRef: menuRef, targetLineRef: targetLineRef, menuComponent: _jsxs("div", { ref: menuRef, className: "icon draggable-block-menu absolute left-0 top-0 flex gap-0.5 cursor-grab items-center will-change-transform text-default-400", children: [_jsx("button", { title: "Click to add below", onClick: insertBlock, children: _jsx(Plus, { size: 18, className: 'text-gray-400 hover:bg-blue-400 hover:text-white rounded' }) }), _jsx(Grid3x2GapFill, { size: 18, className: 'text-gray-400 hover:bg-blue-400 hover:text-white rounded p-0.5' })] }), targetLineComponent: _jsx("div", { ref: targetLineRef, className: "draggable-block-target-line pointer-events-none bg-blue-400 rounded h-1 absolute left-0 top-0 will-change-transform" }), isOnMenu: isOnMenu, onElementChanged: setDraggableElement }));
}
