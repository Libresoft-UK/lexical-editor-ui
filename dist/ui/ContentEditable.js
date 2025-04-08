import { jsx as _jsx } from "react/jsx-runtime";
import './ContentEditable.css';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
export default function LexicalContentEditable({ className, placeholder, placeholderClassName, }) {
    return (_jsx(ContentEditable, { className: className ?? 'ContentEditable__root', "aria-placeholder": placeholder, placeholder: _jsx("div", { className: placeholderClassName ?? 'ContentEditable__placeholder', children: placeholder }) }));
}
