// React context provider for dynamic content

export type DCOption = {
    /**
     * The name of the dynamic content, e.g. "First Name"
     */
    label: string;
    /**
     * The value of the dynamic content, e.g. "firstName"
     */
    slug: string;
    /**
     * Nested options for the dynamic content, if applicable
     */
    options?: DCOption[];
}

export type DCContextType = {
    /**
     * An array of dynamic content options
     */
    options: DCOption[];
    /**
     * Function to get dynamic content by slug
     */
    getDynamicContentBySlug: (slug: string) => string;
}

const defaultContext: DCContextType = {
    options: [],
    getDynamicContentBySlug: (slug: string) => {
        console.warn('DynamicContentProvider not initialized, returning undefined for slug:', slug);
        return '';
    }
}


import React, { createContext, useContext } from 'react';

const DynamicContentContext = createContext<DCContextType>(defaultContext);

export const DynamicContentProvider: React.FC<{ children: React.ReactNode; options?: DCOption[] }> = ({ children, options = [] }) => {

    function getDynamicContentBySlug(slug: string): string  {

        // remove any curly braces from the slug, e.g. "{{visit.visitor.firstName}}" becomes "visit.visitor.firstName"
        slug = slug.replace(/{{|}}/g, '').trim();

        // find the dynamic content option by slug, eg "visit.visitor.firstName" should return "Visit Visitor First Name" based on each option's label
        const findOption = (options: DCOption[], slugParts: string[]): string | undefined => {
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

    const contextValue: DCContextType = {
        options,
        getDynamicContentBySlug
    };

    return (
        <DynamicContentContext.Provider value={contextValue}>
            {children}
        </DynamicContentContext.Provider>
    );
};

export const useDynamicContent = () => {
    const context = useContext(DynamicContentContext);
    if (!context) {
        throw new Error('useDynamicContent must be used within a DynamicContentProvider');
    }
    return context;
};
