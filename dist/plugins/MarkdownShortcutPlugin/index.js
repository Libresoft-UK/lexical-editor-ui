import { jsx as _jsx } from "react/jsx-runtime";
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { PLAYGROUND_TRANSFORMERS } from '../MarkdownTransformers';
export default function MarkdownPlugin() {
    return _jsx(MarkdownShortcutPlugin, { transformers: PLAYGROUND_TRANSFORMERS });
}
