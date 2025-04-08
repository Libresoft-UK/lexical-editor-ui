import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$createParagraphNode, $createTextNode, $getRoot} from "lexical";
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
                   editor.setEditorState(editorState);
               } catch (e) {
                   // create a new editorState using the src value
                   editor.update(() => {
                       const root = $getRoot();
                       // check if the root is empty
                       if (root.getFirstChild() === null) {
                           const paragraph = $createParagraphNode();
                           paragraph.append(
                               $createTextNode(src),
                           );
                           root.append(paragraph);
                       }
                   });
               }
           }
        }
    }, [editor, firstRender, src]);

    return null;
}