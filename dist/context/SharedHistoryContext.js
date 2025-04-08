import { jsx as _jsx } from "react/jsx-runtime";
import { createEmptyHistoryState } from '@lexical/react/LexicalHistoryPlugin';
import { createContext, useContext, useMemo } from 'react';
const Context = createContext({});
export const SharedHistoryContext = ({ children, }) => {
    const historyContext = useMemo(() => ({ historyState: createEmptyHistoryState() }), []);
    return _jsx(Context.Provider, { value: historyContext, children: children });
};
export const useSharedHistoryContext = () => {
    return useContext(Context);
};
