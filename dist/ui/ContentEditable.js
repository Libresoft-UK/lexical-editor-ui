import { jsx as _jsx } from "react/jsx-runtime";
import './ContentEditable.css';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { cn } from "../utils/joinClasses";
export default function LexicalContentEditable({ className, placeholder, placeholderClassName, }) {
    return (_jsx(ContentEditable, { className: cn('border-0 text-base block relative outline-0 p-2 pb-12 lg:px-12 min-h-48', className), "aria-placeholder": placeholder, placeholder: _jsx("div", { className: placeholderClassName ?? 'ContentEditable__placeholder', children: placeholder }) }));
}
