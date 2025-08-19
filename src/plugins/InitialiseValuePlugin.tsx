import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$getRoot, $insertNodes} from "lexical";
import {$generateNodesFromDOM} from '@lexical/html';
import {useEffect, useState} from "react";


interface InitialiseValuePluginProps {
    src: string | null;
}

export default function InitialiseValuePlugin({src = null}: InitialiseValuePluginProps) {

    const [editor] = useLexicalComposerContext();

    const [firstRender, setFirstRender] = useState(true);

    useEffect(() => {
        if (firstRender) {
           setFirstRender(false);
           
           if (src) {
               // check if src is a valid JSON editorState, otherwise create a new one using the src value
               try {
                   const editorState = editor.parseEditorState(src);
                   editor.setEditorState(editorState, {tag: 'init'});
               } catch (e) {
                   // create a new editorState using the src value
                   editor.update(() => {

                       //wrap new lines in a paragraph node
                      const lines = src.split('\n');
                      const paragraphs = lines.map(line =>{
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

                       //parse src as text
                       // const root = $getRoot();
                       // // check if the root is empty
                       // if (root.getFirstChild() === null) {
                       //     const paragraph = $createParagraphNode();
                       //     paragraph.append(
                       //         $createTextNode(src),
                       //     );
                       //     root.append(paragraph);
                       // }
                   }, {tag: 'init'});
               }
           }
        }
    }, [editor, firstRender, src]);

    return null;
}