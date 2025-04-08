import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
export default function Switch({ checked, onClick, text, id, }) {
    const buttonId = useMemo(() => 'id_' + Math.floor(Math.random() * 10000), []);
    return (_jsxs("div", { className: "switch", id: id, children: [_jsx("label", { htmlFor: buttonId, children: text }), _jsx("button", { role: "switch", "aria-checked": checked, id: buttonId, onClick: onClick, children: _jsx("span", {}) })] }));
}
