import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './Input.css';
export default function FileInput({ accept, label, onChange, 'data-test-id': dataTestId, }) {
    return (_jsxs("div", { className: "flex flex-row items-center mb-2 gap-2", children: [_jsx("label", { className: "text-default-700 flex flex-1", children: label }), _jsx("input", { type: "file", accept: accept, className: "bg-default-200 text-default-700 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-2.5 ", onChange: (e) => onChange(e.target.files), "data-test-id": dataTestId })] }));
}
