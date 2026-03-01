import { createClient } from 'contentful';

export const contentfulClient = createClient({
    space: process.env.CONTENTFUL_SPACE_ID || '',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

export const fetchEntries = async (contentType: string) => {
    try {
        const entries = await contentfulClient.getEntries({
            content_type: contentType,
        });
        return entries.items;
    } catch (error) {
        console.error(`Error fetching ${contentType} from Contentful:`, error);
        return [];
    }
}; export const fetchEntriesBySlug = async (contentType: string, slug: string) => {
    try {
        const entries = await contentfulClient.getEntries({
            content_type: contentType,
            'fields.slug': slug,
            limit: 1
        });
        return entries.items[0];
    } catch (error) {
        console.error(`Error fetching ${contentType} with slug ${slug}:`, error);
        return null;
    }
};
