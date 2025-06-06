import { JSX } from 'react';
import { LexicalEditor, LexicalCommand } from 'lexical';
import { DynamicContentPayload } from '../../nodes/DynamicContentNode';
export type InsertDynamicContentPayload = Readonly<DynamicContentPayload>;
export declare const INSERT_DYNAMIC_CONTENT_COMMAND: LexicalCommand<InsertDynamicContentPayload>;
export default function DynamicContentsPlugin(): JSX.Element | null;
export declare function InsertDynamicContentDialog({ activeEditor, onClose, }: {
    activeEditor: LexicalEditor;
    onClose: () => void;
}): JSX.Element;
