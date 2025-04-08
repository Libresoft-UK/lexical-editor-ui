import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './Modal.css';
import { isDOMNode } from 'lexical';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
function PortalImpl({ onClose, children, title, closeOnClickOutside, }) {
    const modalRef = useRef(null);
    useEffect(() => {
        if (modalRef.current !== null) {
            modalRef.current.focus();
        }
    }, []);
    useEffect(() => {
        let modalOverlayElement = null;
        const handler = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        const clickOutsideHandler = (event) => {
            const target = event.target;
            if (modalRef.current !== null &&
                isDOMNode(target) &&
                !modalRef.current.contains(target) &&
                closeOnClickOutside) {
                onClose();
            }
        };
        const modelElement = modalRef.current;
        if (modelElement !== null) {
            modalOverlayElement = modelElement.parentElement;
            if (modalOverlayElement !== null) {
                modalOverlayElement.addEventListener('click', clickOutsideHandler);
            }
        }
        window.addEventListener('keydown', handler);
        return () => {
            window.removeEventListener('keydown', handler);
            if (modalOverlayElement !== null) {
                modalOverlayElement?.removeEventListener('click', clickOutsideHandler);
            }
        };
    }, [closeOnClickOutside, onClose]);
    return (_jsx("div", { className: "fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]", role: "dialog", children: _jsxs("div", { className: "p-5 min-h-24 min-w-72 bg-default-50 rounded-lg shadow relative flex flex-col", tabIndex: -1, ref: modalRef, children: [_jsx("h2", { className: "text-lg text-default-700", children: title }), _jsx("button", { className: "text-xl absolute top-2 right-2 text-default-500 rounded-full hover:text-default-700 focus:outline-none", "aria-label": "Close modal", type: "button", onClick: onClose, children: "x" }), _jsx("div", { className: "p-1", children: children })] }) }));
}
export default function Modal({ onClose, children, title, closeOnClickOutside = false, }) {
    return createPortal(_jsx(PortalImpl, { onClose: onClose, title: title, closeOnClickOutside: closeOnClickOutside, children: children }), document.body);
}
