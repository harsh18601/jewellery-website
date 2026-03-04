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

const readContentfulText = (value: any): string => {
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (value && typeof value === 'object') {
        const localizedValue = Object.values(value).find((item) => typeof item === 'string');
        if (typeof localizedValue === 'string') return localizedValue.trim();
    }
    return '';
};

const normalizeHref = (rawSlugOrHref: any) => {
    const source = readContentfulText(rawSlugOrHref);
    if (!source) return '#';

    // Handle external links
    if (source.startsWith('http://') || source.startsWith('https://')) return source;

    // Handle internal links: ensure leading slash and no trailing/multiple slashes
    const cleaned = source.replace(/^\/+/, '').replace(/\/+$/, '').toLowerCase();
    return cleaned ? `/${cleaned}` : '/';
};

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
    if (!contentfulClient || !slug) return null;

    // Normalize slug for querying: ensure no leading slash
    const cleanSlug = typeof slug === 'string' ? slug.replace(/^\/+/, '').replace(/\/+$/, '') : '';
    if (!cleanSlug && slug !== '/') return null;

    // We try variations to be resilient to how content managers enter slugs
    const variants = [slug, cleanSlug, `/${cleanSlug}`];
    const uniqueVariants = Array.from(new Set(variants)).filter(Boolean);

    try {
        for (const variant of uniqueVariants) {
            const entries = await contentfulClient.getEntries({
                content_type: contentType,
                'fields.slug': variant,
                include: 2,
                limit: 1
            });
            if (entries.items.length > 0) return entries.items[0];
        }
        return null;
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

export type FooterLink = {
    label: string;
    href: string;
};

export type FooterTrustBadge = {
    title: string;
    iconUrl?: string;
};

export type FooterData = {
    brandName: string;
    brandDescription: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    followLabel: string;
    instagramUrl: string;
    facebookUrl: string;
    twitterUrl: string;
    exploreTitle: string;
    exploreLinks: FooterLink[];
    helpTitle: string;
    helpLinks: FooterLink[];
    trustTitle: string;
    trustItems: string[];
    trustBadges: FooterTrustBadge[];
    showNewsletter: boolean;
    contactTitle: string;
    locationText: string;
    phone: string;
    email: string;
    whatsappLabel: string;
    whatsappUrl: string;
    newsletterTitle: string;
    newsletterDescription: string;
    newsletterPlaceholder: string;
    newsletterCtaButton: string;
    paymentTitle: string;
    paymentMethods: string[];
    copyrightText: string;
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
                href: normalizeHref(item?.fields?.slug ?? item?.fields?.url ?? item?.fields?.href ?? ''),
                hasIcon: Boolean(item?.fields?.hasIcon),
                children: subLinks
                    .map((child: any) => ({
                        name: child?.fields?.name ?? '',
                        href: normalizeHref(child?.fields?.slug ?? child?.fields?.url ?? child?.fields?.href ?? ''),
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

export const fetchFooterData = async (): Promise<FooterData | null> => {
    if (!contentfulClient) return null;

    const readText = (value: any) => {
        return readContentfulText(value);
    };

    const toLinks = (value: any): FooterLink[] => {
        if (!value) return [];

        if (Array.isArray(value)) {
            return value.map((item) => {
                // Reference entry shape
                const fields = item?.fields || {};
                const refLabel = readText(fields.label || fields.name || fields.title || item?.label || item?.name || item?.title);
                const refHref = readText(
                    fields.slug ||
                    fields.Slug ||
                    fields.path ||
                    fields.url ||
                    fields.href ||
                    fields.link ||
                    item?.slug ||
                    item?.path ||
                    item?.url
                );

                if (refLabel || refHref) {
                    return {
                        label: refLabel || refHref || '',
                        href: normalizeHref(refHref || '#'),
                    };
                }

                // Plain string in list
                const plain = readText(item);
                return {
                    label: plain,
                    href: '#',
                };
            }).filter((item) => item.label);
        }

        return [];
    };

    const toTrustBadges = (value: any): FooterTrustBadge[] => {
        if (!Array.isArray(value)) return [];
        return value.map((item) => {
            const fields = item?.fields || {};
            const title = readText(fields.title || fields.name || fields.label);
            const iconUrl = fields?.icon?.fields?.file?.url ? `https:${fields.icon.fields.file.url}` : '';
            return {
                title,
                iconUrl: iconUrl || undefined,
            };
        }).filter((item) => item.title);
    };

    const toTextList = (value: any): string[] => {
        if (!Array.isArray(value)) return [];
        return value.map((item) => readText(item?.fields?.label || item?.fields?.name || item)).filter(Boolean);
    };

    const getNewsletterReferenceList = (fields: any) => {
        if (Array.isArray(fields?.newsletter) && fields.newsletter.length > 0) return fields.newsletter;
        if (Array.isArray(fields?.newsLetter) && fields.newsLetter.length > 0) return fields.newsLetter;
        if (fields?.newsletterContent) return [fields.newsletterContent];
        return [];
    };

    const getNewsletterFields = (fields: any) => {
        const refs = getNewsletterReferenceList(fields);
        const ref = refs[0]?.fields || null;

        return {
            title: readText(ref?.title || fields?.newsletterTitle),
            subtitle: readText(ref?.subtitle || fields?.newsletterDescription),
            placeholder: readText(ref?.placeholder || fields?.newsletterPlaceholder),
            ctaButton: readText(ref?.ctaButton || fields?.newsletterCtaButton),
            hasReference: refs.length > 0,
        };
    };

    try {
        const response = await contentfulClient.getEntries({
            content_type: 'footer',
            limit: 1,
            include: 2,
        });
        const fields = (response.items?.[0] as any)?.fields || {};
        if (!fields || Object.keys(fields).length === 0) return null;
        const newsletter = getNewsletterFields(fields);

        return {
            brandName: readText(fields.brandName || fields.title),
            brandDescription: readText(fields.brandDescription || fields.description),
            primaryCtaText: readText(fields.primaryCtaText || fields.ctaText),
            primaryCtaLink: readText(fields.primaryCtaLink || fields.ctaLink),
            followLabel: readText(fields.followLabel),
            instagramUrl: readText(fields.instagramUrl),
            facebookUrl: readText(fields.facebookUrl),
            twitterUrl: readText(fields.twitterUrl),
            exploreTitle: readText(fields.exploreTitle),
            exploreLinks: toLinks(fields.exploreLinks),
            helpTitle: readText(fields.helpTitle),
            helpLinks: toLinks(fields.helpLinks),
            trustTitle: readText(fields.trustTitle),
            trustItems: toTextList(fields.trustItems),
            trustBadges: toTrustBadges(fields.trustBadges),
            showNewsletter: fields.showNewsLetter !== undefined
                ? Boolean(fields.showNewsLetter)
                : (fields.showNewsletter !== undefined ? Boolean(fields.showNewsletter) : newsletter.hasReference),
            contactTitle: readText(fields.contactTitle),
            locationText: readText(fields.locationText || fields.address),
            phone: readText(fields.phone),
            email: readText(fields.email),
            whatsappLabel: readText(fields.whatsappLabel || fields.whatsappText),
            whatsappUrl: readText(fields.whatsappUrl),
            newsletterTitle: newsletter.title,
            newsletterDescription: newsletter.subtitle,
            newsletterPlaceholder: newsletter.placeholder,
            newsletterCtaButton: newsletter.ctaButton,
            paymentTitle: readText(fields.paymentTitle),
            paymentMethods: toTextList(fields.paymentMethods),
            copyrightText: readText(fields.copyrightText),
        };
    } catch (error) {
        console.error('Error fetching footer data from Contentful:', error);
        return null;
    }
};
