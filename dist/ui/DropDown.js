import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { isDOMNode } from 'lexical';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState, } from 'react';
import { createPortal } from 'react-dom';
const DropDownContext = React.createContext(null);
const dropDownPadding = 4;
export function DropDownItem({ children, className, onClick, title, shortcut, icon, disabled = false, }) {
    const ref = useRef(null);
    const dropDownContext = React.useContext(DropDownContext);
    if (dropDownContext === null) {
        throw new Error('DropDownItem must be used within a DropDown');
    }
    const { registerItem } = dropDownContext;
    useEffect(() => {
        if (ref && ref.current) {
            registerItem(ref);
        }
    }, [ref, registerItem]);
    return (_jsxs("button", { className: 'flex justify-between p-0.5 rounded text-default-500 hover:bg-default-500 hover:text-default-50 disabled:opacity-75 disabled:pointer-events-none ' + className, onClick: onClick, ref: ref, title: title, disabled: disabled, type: "button", children: [_jsxs("div", { className: 'flex flex-row gap-2', children: [icon, children] }), shortcut && (_jsx("span", { className: "text-xs text-default-400", children: shortcut }))] }));
}
function DropDownItems({ children, dropDownRef, onClose, }) {
    const [items, setItems] = useState();
    const [highlightedItem, setHighlightedItem] = useState();
    const registerItem = useCallback((itemRef) => {
        setItems((prev) => (prev ? [...prev, itemRef] : [itemRef]));
    }, [setItems]);
    const handleKeyDown = (event) => {
        if (!items) {
            return;
        }
        const key = event.key;
        if (['Escape', 'ArrowUp', 'ArrowDown', 'Tab'].includes(key)) {
            event.preventDefault();
        }
        if (key === 'Escape' || key === 'Tab') {
            onClose();
        }
        else if (key === 'ArrowUp') {
            setHighlightedItem((prev) => {
                if (!prev) {
                    return items[0];
                }
                const index = items.indexOf(prev) - 1;
                return items[index === -1 ? items.length - 1 : index];
            });
        }
        else if (key === 'ArrowDown') {
            setHighlightedItem((prev) => {
                if (!prev) {
                    return items[0];
                }
                return items[items.indexOf(prev) + 1];
            });
        }
    };
    const contextValue = useMemo(() => ({
        registerItem,
    }), [registerItem]);
    useEffect(() => {
        if (items && !highlightedItem) {
            setHighlightedItem(items[0]);
        }
        if (highlightedItem && highlightedItem.current) {
            highlightedItem.current.focus();
        }
    }, [items, highlightedItem]);
    return (_jsx(DropDownContext.Provider, { value: contextValue, children: _jsx("div", { className: "fixed right-0 mt-2 w-56 origin-top-right rounded-md bg-default-100 shadow-md focus:outline-hidden flex flex-col gap-0.5 p-2 z-50", ref: dropDownRef, onKeyDown: handleKeyDown, children: children }) }));
}
export default function DropDown({ disabled = false, buttonLabel, buttonAriaLabel, buttonClassName, buttonIconClassName, buttonElement, children, stopCloseOnClickSelf, }) {
    const dropDownRef = useRef(null);
    const buttonRef = useRef(null);
    const [showDropDown, setShowDropDown] = useState(false);
    const handleClose = () => {
        setShowDropDown(false);
        if (buttonRef && buttonRef.current) {
            buttonRef.current.focus();
        }
    };
    useEffect(() => {
        const button = buttonRef.current;
        const dropDown = dropDownRef.current;
        if (showDropDown && button !== null && dropDown !== null) {
            const { top, left } = button.getBoundingClientRect();
            dropDown.style.top = `${top + button.offsetHeight + dropDownPadding}px`;
            dropDown.style.left = `${Math.min(left, window.innerWidth - dropDown.offsetWidth - 20)}px`;
        }
    }, [dropDownRef, buttonRef, showDropDown]);
    useEffect(() => {
        const button = buttonRef.current;
        if (button !== null && showDropDown) {
            const handle = (event) => {
                const target = event.target;
                if (!isDOMNode(target)) {
                    return;
                }
                if (stopCloseOnClickSelf) {
                    if (dropDownRef.current && dropDownRef.current.contains(target)) {
                        return;
                    }
                }
                if (!button.contains(target)) {
                    setShowDropDown(false);
                }
            };
            document.addEventListener('click', handle);
            return () => {
                document.removeEventListener('click', handle);
            };
        }
    }, [dropDownRef, buttonRef, showDropDown, stopCloseOnClickSelf]);
    useEffect(() => {
        const handleButtonPositionUpdate = () => {
            if (showDropDown) {
                const button = buttonRef.current;
                const dropDown = dropDownRef.current;
                if (button !== null && dropDown !== null) {
                    const { top } = button.getBoundingClientRect();
                    const newPosition = top + button.offsetHeight + dropDownPadding;
                    if (newPosition !== dropDown.getBoundingClientRect().top) {
                        dropDown.style.top = `${newPosition}px`;
                    }
                }
            }
        };
        document.addEventListener('scroll', handleButtonPositionUpdate);
        return () => {
            document.removeEventListener('scroll', handleButtonPositionUpdate);
        };
    }, [buttonRef, dropDownRef, showDropDown]);
    return (_jsxs(_Fragment, { children: [_jsxs("button", { type: "button", disabled: disabled, "aria-label": buttonAriaLabel, className: buttonClassName, onClick: () => setShowDropDown(!showDropDown), ref: buttonRef, children: [buttonIconClassName && _jsx("span", { className: buttonIconClassName }), buttonLabel && (_jsx("span", { className: "text dropdown-button-text text-nowrap", children: buttonLabel })), buttonElement, _jsx("i", { className: "chevron-down" })] }), showDropDown &&
                createPortal(_jsx(DropDownItems, { dropDownRef: dropDownRef, onClose: handleClose, children: children }), document.body)] }));
}
