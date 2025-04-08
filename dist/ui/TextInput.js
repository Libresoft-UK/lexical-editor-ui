import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './Input.css';
export default function TextInput({ label, value, onChange, placeholder = '', 'data-test-id': dataTestId, type = 'text', }) {
    return (_jsxs("div", { className: "flex flex-row items-center mb-2 gap-2", children: [_jsx("label", { className: "text-default-700 flex flex-1", children: label }), _jsx("input", { type: type, className: "flex-1 bg-default-200 border-0 text-default-700 text-sm rounded-lg block p-2.5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none focus-visible:border-blue-500", placeholder: placeholder, value: value, onChange: (e) => {
                    onChange(e.target.value);
                }, "data-test-id": dataTestId })] }));
}
