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
