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
type DCContextType = {
    /**
     * An array of dynamic content options
     */
    options: DCOption[];
    /**
     * Function to get dynamic content by slug
     */
    getDynamicContentBySlug: (slug: string) => string | undefined;
};
import React from 'react';
export declare const DynamicContentProvider: React.FC<{
    children: React.ReactNode;
    options?: DCOption[];
}>;
export declare const useDynamicContent: () => DCContextType;
export {};
