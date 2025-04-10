import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalTypeaheadMenuPlugin, MenuOption, useBasicTypeaheadTriggerMatch, } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createTextNode, $getSelection, $isRangeSelection, } from 'lexical';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
class EmojiOption extends MenuOption {
    title;
    emoji;
    keywords;
    constructor(title, emoji, options) {
        super(title);
        this.title = title;
        this.emoji = emoji;
        this.keywords = options.keywords || [];
    }
}
function EmojiMenuItem({ index, isSelected, onClick, onMouseEnter, option, }) {
    let className = 'item';
    if (isSelected) {
        className += ' selected';
    }
    return (_jsx("li", { tabIndex: -1, className: className, ref: option.setRefElement, role: "option", "aria-selected": isSelected, id: 'typeahead-item-' + index, onMouseEnter: onMouseEnter, onClick: onClick, children: _jsxs("span", { className: "text", children: [option.emoji, " ", option.title] }) }, option.key));
}
const MAX_EMOJI_SUGGESTION_COUNT = 10;
export default function EmojiPickerPlugin() {
    const [editor] = useLexicalComposerContext();
    const [queryString, setQueryString] = useState(null);
    const [emojis, setEmojis] = useState([]);
    useEffect(() => {
        import('../../utils/emoji-list').then((file) => setEmojis(file.default));
    }, []);
    const emojiOptions = useMemo(() => emojis != null
        ? emojis.map(({ emoji, aliases, tags }) => new EmojiOption(aliases[0], emoji, {
            keywords: [...aliases, ...tags],
        }))
        : [], [emojis]);
    const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(':', {
        minLength: 0,
    });
    const options = useMemo(() => {
        return emojiOptions
            .filter((option) => {
            return queryString != null
                ? new RegExp(queryString, 'gi').exec(option.title) ||
                    option.keywords != null
                    ? option.keywords.some((keyword) => new RegExp(queryString, 'gi').exec(keyword))
                    : false
                : emojiOptions;
        })
            .slice(0, MAX_EMOJI_SUGGESTION_COUNT);
    }, [emojiOptions, queryString]);
    const onSelectOption = useCallback((selectedOption, nodeToRemove, closeMenu) => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || selectedOption == null) {
                return;
            }
            if (nodeToRemove) {
                nodeToRemove.remove();
            }
            selection.insertNodes([$createTextNode(selectedOption.emoji)]);
            closeMenu();
        });
    }, [editor]);
    return (_jsx(LexicalTypeaheadMenuPlugin, { onQueryChange: setQueryString, onSelectOption: onSelectOption, triggerFn: checkForTriggerMatch, options: options, menuRenderFn: (anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => {
            if (anchorElementRef.current == null || options.length === 0) {
                return null;
            }
            return anchorElementRef.current && options.length
                ? ReactDOM.createPortal(_jsx("div", { className: "typeahead-popover emoji-menu absolute p-1 bg-default-100 text-default-900 shadow-md rounded-md", children: _jsx("ul", { children: options.map((option, index) => (_jsx(EmojiMenuItem, { index: index, isSelected: selectedIndex === index, onClick: () => {
                                setHighlightedIndex(index);
                                selectOptionAndCleanUp(option);
                            }, onMouseEnter: () => {
                                setHighlightedIndex(index);
                            }, option: option }, option.key))) }) }), anchorElementRef.current)
                : null;
        } }));
}
