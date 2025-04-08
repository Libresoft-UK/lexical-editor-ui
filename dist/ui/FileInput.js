import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './Input.css';
export default function FileInput({ accept, label, onChange, 'data-test-id': dataTestId, }) {
    return (_jsxs("div", { className: "Input__wrapper", children: [_jsx("label", { className: "Input__label", children: label }), _jsx("input", { type: "file", accept: accept, className: "Input__input", onChange: (e) => onChange(e.target.files), "data-test-id": dataTestId })] }));
}
