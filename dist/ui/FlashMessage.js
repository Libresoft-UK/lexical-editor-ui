import { jsx as _jsx } from "react/jsx-runtime";
import './FlashMessage.css';
import { createPortal } from 'react-dom';
export default function FlashMessage({ children, }) {
    return createPortal(_jsx("div", { className: "FlashMessage__overlay", role: "dialog", children: _jsx("p", { className: "FlashMessage__alert", role: "alert", children: children }) }), document.body);
}
