import { jsx as _jsx } from "react/jsx-runtime";
import ColorPicker from './ColorPicker';
import DropDown from './DropDown';
export default function DropdownColorPicker({ disabled = false, stopCloseOnClickSelf = true, color, onChange, ...rest }) {
    return (_jsx(DropDown, { ...rest, disabled: disabled, stopCloseOnClickSelf: stopCloseOnClickSelf, children: _jsx(ColorPicker, { color: color, onChange: onChange }) }));
}
