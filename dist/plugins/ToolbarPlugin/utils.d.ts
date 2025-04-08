import { HeadingTagType } from '@lexical/rich-text';
import { LexicalEditor } from 'lexical';
export declare enum UpdateFontSizeType {
    increment = 1,
    decrement = 2
}
/**
 * Calculates the new font size based on the update type.
 * @param currentFontSize - The current font size
 * @param updateType - The type of change, either increment or decrement
 * @returns the next font size
 */
export declare const calculateNextFontSize: (currentFontSize: number, updateType: UpdateFontSizeType | null) => number;
/**
 * Patches the selection with the updated font size.
 */
export declare const updateFontSizeInSelection: (editor: LexicalEditor, newFontSize: string | null, updateType: UpdateFontSizeType | null) => void;
export declare const updateFontSize: (editor: LexicalEditor, updateType: UpdateFontSizeType, inputValue: string) => void;
export declare const formatParagraph: (editor: LexicalEditor) => void;
export declare const formatHeading: (editor: LexicalEditor, blockType: string, headingSize: HeadingTagType) => void;
export declare const formatBulletList: (editor: LexicalEditor, blockType: string) => void;
export declare const formatCheckList: (editor: LexicalEditor, blockType: string) => void;
export declare const formatNumberedList: (editor: LexicalEditor, blockType: string) => void;
export declare const formatQuote: (editor: LexicalEditor, blockType: string) => void;
export declare const formatCode: (editor: LexicalEditor, blockType: string) => void;
export declare const clearFormatting: (editor: LexicalEditor) => void;
