import { jsx as _jsx } from "react/jsx-runtime";
import './Button.css';
import { cn } from '../utils/joinClasses';
export default function Button({ 'data-test-id': dataTestId, children, className, onClick, disabled, small, title, }) {
    return (_jsx("button", { disabled: disabled, className: cn('bg-primary-500 text-white rounded-md px-2 py-1 hover:bg-primary-600 disabled:opacity-50 disabled:pointer-events-none', disabled && 'Button__disabled', small && 'Button__small', className), onClick: onClick, title: title, "aria-label": title, ...(dataTestId && { 'data-test-id': dataTestId }), children: children }));
}
