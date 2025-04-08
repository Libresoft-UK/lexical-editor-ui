import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './Select.css';
export default function Select({ children, label, className, ...other }) {
    return (_jsxs("div", { className: "Input__wrapper", children: [_jsx("label", { style: { marginTop: '-1em' }, className: "Input__label", children: label }), _jsx("select", { ...other, className: className || 'select', children: children })] }));
}
