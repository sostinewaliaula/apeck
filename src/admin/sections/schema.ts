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
          {
            type: 'repeatable',
            label: 'Buttons',
            name: 'buttons',
            maxItems: 4,
            itemFields: [
              { type: 'text', label: 'Label', name: 'label', placeholder: 'Join APECK' },
              { type: 'text', label: 'Link / URL', name: 'href', placeholder: '/membership' },
              { type: 'text', label: 'Style (primary | secondary | outline | ghost)', name: 'style', placeholder: 'primary' },
              { type: 'text', label: 'Icon (arrow | heart | play)', name: 'icon', placeholder: 'arrow' },
            ],
          },
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
  {
    key: 'who_we_are',
    title: 'Who We Are',
    description: 'Homepage about section content.',
    fields: [
      { type: 'text', label: 'Badge Label', name: 'badgeLabel', placeholder: 'WELCOME TO APECK' },
      { type: 'text', label: 'Highlight Word', name: 'highlightWord', placeholder: 'APECK' },
      { type: 'text', label: 'Title', name: 'title', placeholder: 'Who We Are' },
      {
        type: 'textarea',
        label: 'Intro Paragraph',
        name: 'intro',
        placeholder: 'is the premier association uniting Pentecostal and Evangelical clergy...',
      },
      {
        type: 'textarea',
        label: 'Mission Paragraph',
        name: 'mission',
        placeholder: 'Our mission is to strengthen the body of Christ...',
      },
      { type: 'image', label: 'Primary Image', name: 'image' },
      { type: 'text', label: 'Image Alt Text', name: 'imageAlt', placeholder: 'Clergy gathering' },
      {
        type: 'link',
        label: 'CTA Button',
        name: 'cta',
        fields: [
          { name: 'label', label: 'Button Label' },
          { name: 'href', label: 'Link URL' },
        ],
      },
      {
        type: 'repeatable',
        label: 'Stats',
        name: 'stats',
        maxItems: 4,
        itemFields: [
          { type: 'text', label: 'Value', name: 'value', placeholder: '15+' },
          { type: 'text', label: 'Label', name: 'label', placeholder: 'Years Experience' },
        ],
      },
      { type: 'text', label: 'Floating Badge Title', name: 'floatingBadgeTitle', placeholder: 'Since 2009' },
      { type: 'text', label: 'Floating Badge Subtitle', name: 'floatingBadgeSubtitle', placeholder: 'Serving Kenya' },
    ],
  },
  {
    key: 'impact_stats',
    title: 'Impact Stats',
    description: 'Homepage stats row (members, counties, programs, etc.).',
    fields: [
      {
        type: 'repeatable',
        label: 'Stats',
        name: 'stats',
        minItems: 1,
        maxItems: 6,
        itemFields: [
          { type: 'text', label: 'Value', name: 'value', placeholder: '1,500+' },
          { type: 'text', label: 'Label', name: 'label', placeholder: 'Members' },
          { type: 'text', label: 'Suffix', name: 'suffix', placeholder: '+' },
          { type: 'text', label: 'Icon (users | trend | book | award)', name: 'icon', placeholder: 'users' },
        ],
      },
    ],
  },
  {
    key: 'programs',
    title: 'Programs Section',
    description: 'Homepage programs & initiatives grid.',
    fields: [
      { type: 'text', label: 'Badge Label', name: 'badgeLabel', placeholder: 'OUR SERVICES' },
      { type: 'text', label: 'Title', name: 'title', placeholder: 'Our Programs & Initiatives' },
      {
        type: 'textarea',
        label: 'Description',
        name: 'description',
        placeholder: 'Comprehensive programs designed to empower clergy…',
      },
      {
        type: 'link',
        label: 'CTA Button',
        name: 'cta',
        fields: [
          { name: 'label', label: 'Button Label' },
          { name: 'href', label: 'Link URL' },
        ],
      },
      {
        type: 'repeatable',
        label: 'Program Cards',
        name: 'items',
        minItems: 1,
        maxItems: 6,
        itemFields: [
          { type: 'text', label: 'Title', name: 'title', placeholder: 'Training Programs' },
          { type: 'textarea', label: 'Description', name: 'description', placeholder: 'Comprehensive training for clergy…' },
          { type: 'text', label: 'Icon (book | users | sparkles | heart)', name: 'icon', placeholder: 'book' },
          { type: 'text', label: 'Accent Color (hex)', name: 'accent', placeholder: '#8B2332' },
        ],
      },
    ],
  },
  {
    key: 'testimonials',
    title: 'Testimonials Section',
    description: 'Homepage testimonials carousel content.',
    fields: [
      { type: 'text', label: 'Badge Label', name: 'badgeLabel', placeholder: 'TESTIMONIALS' },
      { type: 'text', label: 'Title', name: 'title', placeholder: 'What Our Members Say' },
      {
        type: 'textarea',
        label: 'Description',
        name: 'description',
        placeholder: 'Real stories from clergy transformed through APECK',
      },
      {
        type: 'repeatable',
        label: 'Testimonials',
        name: 'items',
        minItems: 1,
        itemFields: [
          { type: 'text', label: 'Name', name: 'name', placeholder: 'Rev. Dr. James Mwangi' },
          { type: 'text', label: 'Role / Title', name: 'role', placeholder: 'Senior Pastor, Nairobi' },
          { type: 'textarea', label: 'Quote', name: 'content', placeholder: 'APECK has transformed my ministry...' },
          { type: 'text', label: 'Rating (1-5)', name: 'rating', placeholder: '5' },
        ],
      },
    ],
  },
];

export function getSectionSchema(key: string): SectionSchema | undefined {
  return SECTION_SCHEMAS.find((schema) => schema.key === key);
}

