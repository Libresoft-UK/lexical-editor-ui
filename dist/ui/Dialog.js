import { jsx as _jsx } from "react/jsx-runtime";
import './Dialog.css';
export function DialogButtonsList({ children }) {
    return _jsx("div", { className: "DialogButtonsList", children: children });
}
export function DialogActions({ 'data-test-id': dataTestId, children, }) {
    return (_jsx("div", { className: "DialogActions", "data-test-id": dataTestId, children: children }));
}
