import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import './ImageNode.css';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import { $getNodeByKey, $getSelection, $isNodeSelection, $isRangeSelection, $setSelection, CLICK_COMMAND, COMMAND_PRIORITY_LOW, createCommand, DRAGSTART_COMMAND, KEY_ENTER_COMMAND, KEY_ESCAPE_COMMAND, SELECTION_CHANGE_COMMAND, } from 'lexical';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSharedHistoryContext } from '../context/SharedHistoryContext';
import brokenImage from '../images/image-broken.svg';
import ImageResizer from '../ui/ImageResizer';
import { $isImageNode } from './ImageNode';
const imageCache = new Set();
export const RIGHT_CLICK_IMAGE_COMMAND = createCommand('RIGHT_CLICK_IMAGE_COMMAND');
function useSuspenseImage(src) {
    if (!imageCache.has(src)) {
        throw new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                imageCache.add(src);
                resolve(null);
            };
            img.onerror = () => {
                imageCache.add(src);
            };
        });
    }
}
function isSVG(src) {
    return src.toLowerCase().endsWith('.svg');
}
function LazyImage({ altText, className, imageRef, src, width, height, maxWidth, onError, }) {
    useSuspenseImage(src);
    const [dimensions, setDimensions] = useState(null);
    const isSVGImage = isSVG(src);
    // Set initial dimensions for SVG images
    useEffect(() => {
        if (imageRef.current && isSVGImage) {
            const { naturalWidth, naturalHeight } = imageRef.current;
            setDimensions({
                height: naturalHeight,
                width: naturalWidth,
            });
        }
    }, [imageRef, isSVGImage]);
    // Calculate final dimensions with proper scaling
    const calculateDimensions = () => {
        if (!isSVGImage) {
            return {
                height,
                maxWidth,
                width,
            };
        }
        // Use natural dimensions if available, otherwise fallback to defaults
        const naturalWidth = dimensions?.width || 200;
        const naturalHeight = dimensions?.height || 200;
        let finalWidth = naturalWidth;
        let finalHeight = naturalHeight;
        // Scale down if width exceeds maxWidth while maintaining aspect ratio
        if (finalWidth > maxWidth) {
            const scale = maxWidth / finalWidth;
            finalWidth = maxWidth;
            finalHeight = Math.round(finalHeight * scale);
        }
        // Scale down if height exceeds maxHeight while maintaining aspect ratio
        const maxHeight = 500;
        if (finalHeight > maxHeight) {
            const scale = maxHeight / finalHeight;
            finalHeight = maxHeight;
            finalWidth = Math.round(finalWidth * scale);
        }
        return {
            height: finalHeight,
            maxWidth,
            width: finalWidth,
        };
    };
    const imageStyle = calculateDimensions();
    return (_jsx("img", { className: className || undefined, src: src, alt: altText, ref: imageRef, style: imageStyle, onError: onError, draggable: "false", onLoad: (e) => {
            if (isSVGImage) {
                const img = e.currentTarget;
                setDimensions({
                    height: img.naturalHeight,
                    width: img.naturalWidth,
                });
            }
        } }));
}
function BrokenImage() {
    return (_jsx("img", { src: brokenImage, style: {
            height: 200,
            opacity: 0.2,
            width: 200,
        }, draggable: "false" }));
}
export default function ImageComponent({ src, altText, nodeKey, width, height, maxWidth, resizable, showCaption, caption, captionsEnabled, }) {
    const imageRef = useRef(null);
    const buttonRef = useRef(null);
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
    const [isResizing, setIsResizing] = useState(false);
    const [editor] = useLexicalComposerContext();
    const [selection, setSelection] = useState(null);
    const activeEditorRef = useRef(null);
    const [isLoadError, setIsLoadError] = useState(false);
    const isEditable = useLexicalEditable();
    const $onEnter = useCallback((event) => {
        const latestSelection = $getSelection();
        const buttonElem = buttonRef.current;
        if (isSelected &&
            $isNodeSelection(latestSelection) &&
            latestSelection.getNodes().length === 1) {
            if (showCaption) {
                // Move focus into nested editor
                $setSelection(null);
                event.preventDefault();
                caption.focus();
                return true;
            }
            else if (buttonElem !== null &&
                buttonElem !== document.activeElement) {
                event.preventDefault();
                buttonElem.focus();
                return true;
            }
        }
        return false;
    }, [caption, isSelected, showCaption]);
    const $onEscape = useCallback((event) => {
        if (activeEditorRef.current === caption ||
            buttonRef.current === event.target) {
            $setSelection(null);
            editor.update(() => {
                setSelected(true);
                const parentRootElement = editor.getRootElement();
                if (parentRootElement !== null) {
                    parentRootElement.focus();
                }
            });
            return true;
        }
        return false;
    }, [caption, editor, setSelected]);
    const onClick = useCallback((payload) => {
        const event = payload;
        if (isResizing) {
            return true;
        }
        if (event.target === imageRef.current) {
            if (event.shiftKey) {
                setSelected(!isSelected);
            }
            else {
                clearSelection();
                setSelected(true);
            }
            return true;
        }
        return false;
    }, [isResizing, isSelected, setSelected, clearSelection]);
    const onRightClick = useCallback((event) => {
        editor.getEditorState().read(() => {
            const latestSelection = $getSelection();
            const domElement = event.target;
            if (domElement.tagName === 'IMG' &&
                $isRangeSelection(latestSelection) &&
                latestSelection.getNodes().length === 1) {
                editor.dispatchCommand(RIGHT_CLICK_IMAGE_COMMAND, event);
            }
        });
    }, [editor]);
    useEffect(() => {
        const rootElement = editor.getRootElement();
        const unregister = mergeRegister(editor.registerUpdateListener(({ editorState }) => {
            const updatedSelection = editorState.read(() => $getSelection());
            if ($isNodeSelection(updatedSelection)) {
                setSelection(updatedSelection);
            }
            else {
                setSelection(null);
            }
        }), editor.registerCommand(SELECTION_CHANGE_COMMAND, (_, activeEditor) => {
            activeEditorRef.current = activeEditor;
            return false;
        }, COMMAND_PRIORITY_LOW), editor.registerCommand(CLICK_COMMAND, onClick, COMMAND_PRIORITY_LOW), editor.registerCommand(RIGHT_CLICK_IMAGE_COMMAND, onClick, COMMAND_PRIORITY_LOW), editor.registerCommand(DRAGSTART_COMMAND, (event) => {
            if (event.target === imageRef.current) {
                // TODO This is just a temporary workaround for FF to behave like other browsers.
                // Ideally, this handles drag & drop too (and all browsers).
                event.preventDefault();
                return true;
            }
            return false;
        }, COMMAND_PRIORITY_LOW), editor.registerCommand(KEY_ENTER_COMMAND, $onEnter, COMMAND_PRIORITY_LOW), editor.registerCommand(KEY_ESCAPE_COMMAND, $onEscape, COMMAND_PRIORITY_LOW));
        rootElement?.addEventListener('contextmenu', onRightClick);
        return () => {
            unregister();
            rootElement?.removeEventListener('contextmenu', onRightClick);
        };
    }, [
        clearSelection,
        editor,
        isResizing,
        isSelected,
        nodeKey,
        $onEnter,
        $onEscape,
        onClick,
        onRightClick,
        setSelected,
    ]);
    const setShowCaption = () => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isImageNode(node)) {
                node.setShowCaption(true);
            }
        });
    };
    const onResizeEnd = (nextWidth, nextHeight) => {
        // Delay hiding the resize bars for click case
        setTimeout(() => {
            setIsResizing(false);
        }, 200);
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isImageNode(node)) {
                node.setWidthAndHeight(nextWidth, nextHeight);
            }
        });
    };
    const onResizeStart = () => {
        setIsResizing(true);
    };
    const { historyState } = useSharedHistoryContext();
    const draggable = isSelected && $isNodeSelection(selection) && !isResizing;
    const isFocused = (isSelected || isResizing) && isEditable;
    return (_jsx(Suspense, { fallback: null, children: _jsxs(_Fragment, { children: [_jsx("div", { draggable: draggable, children: isLoadError ? (_jsx(BrokenImage, {})) : (_jsx(LazyImage, { className: isFocused
                            ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}`
                            : null, src: src, altText: altText, imageRef: imageRef, width: width, height: height, maxWidth: maxWidth, onError: () => setIsLoadError(true) })) }), resizable && $isNodeSelection(selection) && isFocused && (_jsx(ImageResizer, { showCaption: showCaption, setShowCaption: setShowCaption, editor: editor, buttonRef: buttonRef, imageRef: imageRef, maxWidth: maxWidth, onResizeStart: onResizeStart, onResizeEnd: onResizeEnd, captionsEnabled: !isLoadError && captionsEnabled }))] }) }));
}
