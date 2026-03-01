import { createClient } from 'contentful';

const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const isContentfulConfigured = Boolean(space && accessToken);

export const contentfulClient = isContentfulConfigured
    ? createClient({
        space: space as string,
        accessToken: accessToken as string,
    })
    : null;

export const fetchEntries = async (contentType: string) => {
    if (!contentfulClient) return [];

    try {
        const entries = await contentfulClient.getEntries({
            content_type: contentType,
        });
        return entries.items;
    } catch (error) {
        console.error(`Error fetching ${contentType} from Contentful:`, error);
        return [];
    }
};

export const fetchEntriesBySlug = async (contentType: string, slug: string) => {
    if (!contentfulClient) return null;

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
