import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './Select.css';
export default function Select({ children, label, className, ...other }) {
    return (_jsxs("div", { className: "flex flex-row items-center mb-2 gap-2", children: [_jsx("label", { style: { marginTop: '-1em' }, className: "text-default-700 flex flex-1", children: label }), _jsx("select", { ...other, className: className + " bg-default-200 border border-gray-300 text-default-700 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ", children: children })] }));
}
