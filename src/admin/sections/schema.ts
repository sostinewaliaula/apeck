export type FieldType = 'text' | 'textarea' | 'image' | 'repeatable' | 'link';

export type SectionField =
  | {
      type: 'text' | 'textarea';
      label: string;
      name: string;
      placeholder?: string;
    }
  | {
      type: 'image';
      label: string;
      name: string;
      helperText?: string;
    }
  | {
      type: 'link';
      label: string;
      fields: Array<{ name: string; label: string }>;
      name: string;
    }
  | {
      type: 'repeatable';
      label: string;
      name: string;
      minItems?: number;
      maxItems?: number;
      itemFields: SectionField[];
    };

export type SectionSchema = {
  key: string;
  title: string;
  description?: string;
  fields: SectionField[];
};

export const SECTION_SCHEMAS: SectionSchema[] = [
  {
    key: 'hero_slides',
    title: 'Hero Slides',
    description: 'Slides used on the homepage hero carousel.',
    fields: [
      {
        type: 'repeatable',
        label: 'Slides',
        name: 'slides',
        minItems: 1,
        maxItems: 5,
        itemFields: [
          { type: 'text', label: 'Title', name: 'title', placeholder: 'Empowering the Clergy' },
          { type: 'text', label: 'Subtitle', name: 'subtitle', placeholder: 'for Kingdom Impact' },
          { type: 'textarea', label: 'Description', name: 'description', placeholder: 'Short paragraph for slide.' },
          { type: 'image', label: 'Desktop Image', name: 'image' },
          { type: 'image', label: 'Mobile Image', name: 'imageMobile' },
        ],
      },
    ],
  },
  {
    key: 'cta',
    title: 'Final Call To Action',
    description: 'Bottom CTA block content.',
    fields: [
      { type: 'text', label: 'Title', name: 'title', placeholder: 'Ready to Make an Impact?' },
      {
        type: 'textarea',
        label: 'Description',
        name: 'description',
        placeholder: 'Join a community of passionate clergy committed to transforming Kenya...',
      },
      {
        type: 'link',
        label: 'Primary CTA',
        name: 'primaryCta',
        fields: [
          { name: 'label', label: 'Button Label' },
          { name: 'href', label: 'Link URL' },
        ],
      },
      {
        type: 'link',
        label: 'Secondary CTA',
        name: 'secondaryCta',
        fields: [
          { name: 'label', label: 'Button Label' },
          { name: 'href', label: 'Link URL' },
        ],
      },
    ],
  },
];

export function getSectionSchema(key: string): SectionSchema | undefined {
  return SECTION_SCHEMAS.find((schema) => schema.key === key);
}

