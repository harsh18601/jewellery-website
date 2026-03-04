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

export type NavbarChildLink = {
    name: string;
    href: string;
};

export type NavbarLink = {
    name: string;
    href: string;
    hasIcon?: boolean;
    children?: NavbarChildLink[];
};

export const fetchNavbarLinks = async () => {
    if (!contentfulClient) return [];

    try {
        const response = await contentfulClient.getEntries({
            content_type: 'navbarLink',
            order: ['fields.order', 'sys.createdAt'],
            include: 2,
        });
        const allItems = response.items as any[];

        // Identify entries that are used as children to avoid rendering them as top-level links.
        const childEntryIds = new Set<string>();
        for (const item of allItems) {
            const subLinks = item?.fields?.subLinks || item?.fields?.children || [];
            for (const child of subLinks) {
                const childId = child?.sys?.id;
                if (childId) childEntryIds.add(childId);
            }
        }

        const topLevelItems = allItems.filter((item) => !childEntryIds.has(item?.sys?.id));

        const links: NavbarLink[] = topLevelItems.map((item) => {
            const subLinks = item?.fields?.subLinks || item?.fields?.children || [];
            return {
                name: item?.fields?.name ?? '',
                href: item?.fields?.url ?? item?.fields?.href ?? '#',
                hasIcon: Boolean(item?.fields?.hasIcon),
                children: subLinks
                    .map((child: any) => ({
                        name: child?.fields?.name ?? '',
                        href: child?.fields?.url ?? child?.fields?.href ?? '#',
                        order: child?.fields?.order ?? Number.MAX_SAFE_INTEGER,
                    }))
                    .filter((child: any) => child.name && child.href)
                    .sort((a: any, b: any) => a.order - b.order)
                    .map(({ name, href }: any) => ({ name, href })),
            };
        });

        return links.filter((link) => link.name && link.href);
    } catch (error) {
        console.error('Error fetching navbar links from Contentful:', error);
        return [];
    }
};
