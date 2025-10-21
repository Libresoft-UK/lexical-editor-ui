import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$getRoot, $insertNodes, LexicalEditor} from "lexical";
import {$generateNodesFromDOM} from '@lexical/html';
import {useEffect, useState} from "react";


interface InitialiseValuePluginProps {
    src: string | object | null;
    debug?: boolean;
}

function filterValidNodes(serializedNode: any, registeredNodes: Map<string, any>): any | null {
    const type = serializedNode.type;
    if (!registeredNodes.has(type)) {
        // Skip nodes with unregistered types
        console.warn(`Skipping unregistered node type: ${type}`);
        return null;
    }
    const filteredNode: any = { ...serializedNode };
    if (Array.isArray(serializedNode.children)) {
        filteredNode.children = serializedNode.children
            .map((child: any) => filterValidNodes(child, registeredNodes))
            .filter((child: any) => child !== null);
    }
    return filteredNode;
}

function filterEditorState(serializedEditorState: any, editor: LexicalEditor): any {
    const registeredNodes = editor._nodes;
    const filteredRoot = filterValidNodes(serializedEditorState.root, registeredNodes);
    return { ...serializedEditorState, root: filteredRoot };
}

export default function InitialiseValuePlugin({src = null, debug = false}: InitialiseValuePluginProps) {

    const [editor] = useLexicalComposerContext();

    const [firstRender, setFirstRender] = useState(true);

    useEffect(() => {
        if (firstRender) {
           setFirstRender(false);
           
           if (src) {
               editor.update(() => {
                   // check if src is a valid JSON editorState, otherwise create a new one using the src value
                   switch (typeof src) {
                       case 'object':
                            debug && console.log('Initialising editor with src object', src);
                            editor.setEditorState(editor.parseEditorState(filterEditorState(src, editor)), {tag: 'init'});
                           return;
                       case 'string':
                           debug && console.log('Initialising editor with src string', src);
                           try {
                               const editorState = JSON.parse(src);
                               editor.setEditorState(editor.parseEditorState(filterEditorState(editorState, editor)), {tag: 'init'});
                           } catch (e) {
                               debug && console.log('Failed to parse src as editorState, initialising new editorState', e);

                               debug && console.log('Initialising editor with src value', src);
                               //wrap new lines in a paragraph node
                               const lines = src.split('\n');
                               const paragraphs = lines.map(line => {
                                   const trimmed = line.trim();
                                   // check if this line is not already html
                                   if (trimmed.trim().startsWith('<') && trimmed.endsWith('>')) {
                                       return line;
                                   }
                                   return `<p>${line}</p>`;
                               })
                               const flattened = paragraphs.join('');

                               // parse src as HTML
                               const parser = new DOMParser();
                               const dom = parser.parseFromString(flattened, 'text/html');

                               // Once you have the DOM instance it's easy to generate LexicalNodes.
                               const nodes = $generateNodesFromDOM(editor, dom);

                               // Select the root
                               const root = $getRoot();

                               // Insert them at a selection.
                               if (root.getFirstChild() === null) {
                                   $insertNodes(nodes);
                               }

                           }
                           break;
                   }
                }, {tag: 'init'} );
           }
        }
    }, [editor, firstRender, src]);

    return null;
}