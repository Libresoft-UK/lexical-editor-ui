import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useState, } from 'react';
import { DEFAULT_SETTINGS, INITIAL_SETTINGS } from '../appSettings';
const Context = createContext({
    setOption: (name, value) => {
        return;
    },
    settings: INITIAL_SETTINGS,
});
export const SettingsContext = ({ children, }) => {
    const [settings, setSettings] = useState(INITIAL_SETTINGS);
    const setOption = useCallback((setting, value) => {
        setSettings((options) => ({
            ...options,
            [setting]: value,
        }));
        setURLParam(setting, value);
    }, []);
    const contextValue = useMemo(() => {
        return { setOption, settings };
    }, [setOption, settings]);
    return _jsx(Context.Provider, { value: contextValue, children: children });
};
export const useSettings = () => {
    return useContext(Context);
};
function setURLParam(param, value) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    if (value !== DEFAULT_SETTINGS[param]) {
        params.set(param, String(value));
    }
    else {
        params.delete(param);
    }
    url.search = params.toString();
    window.history.pushState(null, '', url.toString());
}
