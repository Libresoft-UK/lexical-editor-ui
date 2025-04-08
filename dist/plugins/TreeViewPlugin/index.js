import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TreeView } from '@lexical/react/LexicalTreeView';
export default function TreeViewPlugin() {
    const [editor] = useLexicalComposerContext();
    return (_jsxs("div", { className: 'bg-black text-white border-1 border-red-500', children: [_jsx("div", { className: 'bg-red-500', children: "Debug:" }), _jsx("div", { className: 'text-small', children: _jsx(TreeView, { viewClassName: "tree-view-output", treeTypeButtonClassName: "debug-treetype-button", timeTravelPanelClassName: "debug-timetravel-panel", timeTravelButtonClassName: "debug-timetravel-button", timeTravelPanelSliderClassName: "debug-timetravel-panel-slider", timeTravelPanelButtonClassName: "debug-timetravel-panel-button", editor: editor }) })] }));
}
