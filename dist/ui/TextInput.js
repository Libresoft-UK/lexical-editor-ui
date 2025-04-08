import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './Input.css';
export default function TextInput({ label, value, onChange, placeholder = '', 'data-test-id': dataTestId, type = 'text', }) {
    return (_jsxs("div", { className: "Input__wrapper", children: [_jsx("label", { className: "Input__label", children: label }), _jsx("input", { type: type, className: "Input__input", placeholder: placeholder, value: value, onChange: (e) => {
                    onChange(e.target.value);
                }, "data-test-id": dataTestId })] }));
}
