import { jsx as _jsx } from "react/jsx-runtime";
const defaultContext = {
    options: [],
    getDynamicContentBySlug: (slug) => {
        console.warn('DynamicContentProvider not initialized, returning undefined for slug:', slug);
        return '';
    }
};
import { createContext, useContext } from 'react';
const DynamicContentContext = createContext(defaultContext);
export const DynamicContentProvider = ({ children, options = [] }) => {
    function getDynamicContentBySlug(slug) {
        // remove any curly braces from the slug, e.g. "{{visit.visitor.firstName}}" becomes "visit.visitor.firstName"
        slug = slug.replace(/{{|}}/g, '').trim();
        // find the dynamic content option by slug, eg "visit.visitor.firstName" should return "Visit Visitor First Name" based on each option's label
        const findOption = (options, slugParts) => {
            let label = '';
            for (const option of options) {
                if (option.slug === slugParts[0]) {
                    label = option.label;
                    if (slugParts.length === 1) {
                        return label;
                    }
                    if (option.options) {
                        const nestedLabel = findOption(option.options, slugParts.slice(1));
                        return nestedLabel ? `${label} ${nestedLabel}` : label;
                    }
                }
            }
        };
        const slugParts = slug.split('.');
        const result = findOption(options, slugParts);
        return result ? result : 'Invalid Dynamic Content';
    }
    const contextValue = {
        options,
        getDynamicContentBySlug
    };
    return (_jsx(DynamicContentContext.Provider, { value: contextValue, children: children }));
};
export const useDynamicContent = () => {
    const context = useContext(DynamicContentContext);
    if (!context) {
        throw new Error('useDynamicContent must be used within a DynamicContentProvider');
    }
    return context;
};
