import { EntryFieldTypes } from 'contentful';

export interface ContentfulHero {
    title: EntryFieldTypes.Text;
    subtitle: EntryFieldTypes.Text;
    backgroundImage: EntryFieldTypes.AssetLink;
    ctaText: EntryFieldTypes.Text;
    ctaLink: EntryFieldTypes.Text;
}

export interface ContentfulCategory {
    name: EntryFieldTypes.Text;
    image: EntryFieldTypes.AssetLink;
    slug: EntryFieldTypes.Text;
    subtitle?: EntryFieldTypes.Text;
    description?: EntryFieldTypes.Text;
    ctaText?: EntryFieldTypes.Text;
    badge?: EntryFieldTypes.Text;
}

export interface ContentfulProduct {
    title: EntryFieldTypes.Text;
    price: EntryFieldTypes.Number;
    category: EntryFieldTypes.Text;
    description: EntryFieldTypes.RichText;
    images: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
    stoneType: EntryFieldTypes.Text;
    isFeatured: EntryFieldTypes.Boolean;
    ratings: EntryFieldTypes.Number;
    compareAtPrice?: EntryFieldTypes.Number;
    originalPrice?: EntryFieldTypes.Number;
    metal?: EntryFieldTypes.Text;
    certification?: EntryFieldTypes.Text;
    deliveryDays?: EntryFieldTypes.Text;
    isNew?: EntryFieldTypes.Boolean;
    soldCount?: EntryFieldTypes.Number;
    sales?: EntryFieldTypes.Number;
    tagline?: EntryFieldTypes.Text;
    emiMonthly?: EntryFieldTypes.Number;
    metalType?: EntryFieldTypes.Text;
}
export interface ContentfulPage {
    title: string;
    slug: string;
    subtitle?: string;
    content: any; // Rich Text
    image?: {
        fields: {
            file: {
                url: string;
            }
        }
    };
}
    