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
};
export type DCContextType = {
    /**
     * Boolean indicating if the dynamic content has any options
     */
    hasDynamicContent: boolean;
    /**
     * An array of dynamic content options
     */
    options: DCOption[];
    /**
     * Function to get dynamic content by slug
     */
    getDynamicContentBySlug: (slug: string) => string;
};
import React from 'react';
export declare const DynamicContentProvider: React.FC<{
    children: React.ReactNode;
    options?: DCOption[];
}>;
export declare const useDynamicContent: () => DCContextType;
