import { jsx as _jsx } from "react/jsx-runtime";
const defaultContext = {
    options: [
        {
            label: 'Test',
            slug: 'test',
            options: [
                {
                    label: 'Test Option',
                    slug: 'test',
                    options: [
                        {
                            label: 'Nested Test Option',
                            slug: 'nestedTestOption'
                        }
                    ]
                }
            ]
        }
    ],
    getDynamicContentBySlug: (slug) => {
        console.warn('DynamicContentProvider not initialized, returning undefined for slug:', slug);
        return undefined;
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
            for (const option of options) {
                if (option.slug === slugParts[0]) {
                    if (slugParts.length === 1) {
                        return option.label;
                    }
                    if (option.options) {
                        return findOption(option.options, slugParts.slice(1));
                    }
                }
            }
            return undefined;
        };
        const slugParts = slug.split('.');
        const result = findOption(options, slugParts);
        return result ? result : undefined;
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
