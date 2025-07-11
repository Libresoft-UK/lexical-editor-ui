import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_NORMAL, PASTE_COMMAND } from 'lexical';
import { useEffect, useState } from 'react';
export default function PasteLogPlugin() {
    const [editor] = useLexicalComposerContext();
    const [isActive, setIsActive] = useState(false);
    const [lastClipboardData, setLastClipboardData] = useState(null);
    useEffect(() => {
        if (isActive) {
            return editor.registerCommand(PASTE_COMMAND, (e) => {
                const { clipboardData } = e;
                const allData = [];
                if (clipboardData && clipboardData.types) {
                    clipboardData.types.forEach((type) => {
                        allData.push(type.toUpperCase(), clipboardData.getData(type));
                    });
                }
                setLastClipboardData(allData.join('\n\n'));
                return false;
            }, COMMAND_PRIORITY_NORMAL);
        }
    }, [editor, isActive]);
    return (_jsxs(_Fragment, { children: [_jsx("button", { id: "paste-log-button", className: `editor-dev-button ${isActive ? 'active' : ''}`, onClick: () => {
                    setIsActive(!isActive);
                }, title: isActive ? 'Disable paste log' : 'Enable paste log', type: 'button' }), isActive && lastClipboardData !== null ? (_jsx("pre", { children: lastClipboardData })) : null] }));
}
