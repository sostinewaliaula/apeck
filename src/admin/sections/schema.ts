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
    key: 'programs_hero',
    title: 'Programs Hero',
    description: 'Top hero banner for the programs page.',
    fields: [
      { type: 'text', label: 'Badge Label', name: 'badgeLabel', placeholder: 'OUR PROGRAMS' },
      { type: 'text', label: 'Title', name: 'title', placeholder: 'Community Transformation Programs' },
      {
        type: 'textarea',
        label: 'Description',
        name: 'description',
        placeholder: 'APECK partners with ...',
      },
      { type: 'image', label: 'Background Image', name: 'backgroundImage', helperText: 'Hero background visual' },
    ],
  },
  {
    key: 'programs_intro',
    title: 'Programs Introduction',
    description: 'Executive summary and highlight bullets for the programs page.',
    fields: [
      { type: 'text', label: 'Badge Label', name: 'badgeLabel', placeholder: 'INTRODUCTION' },
      { type: 'text', label: 'Title', name: 'title', placeholder: 'Executive Summary' },
      {
        type: 'textarea',
        label: 'Summary',
        name: 'summary',
        placeholder: 'High level synopsis of the programs',
      },
      {
        type: 'repeatable',
        label: 'Paragraphs',
        name: 'paragraphs',
        minItems: 1,
        itemFields: [{ type: 'textarea', label: 'Paragraph Text', name: 'text' }],
      },
      {
        type: 'repeatable',
        label: 'Highlights',
        name: 'highlights',
        itemFields: [
          { type: 'text', label: 'Title', name: 'title', placeholder: 'Holistic Rehabilitation' },
          {
            type: 'textarea',
            label: 'Description',
            name: 'description',
            placeholder: 'Short supporting text',
          },
        ],
      },
      {
        type: 'textarea',
        label: 'Partner Note / Pull Quote',
        name: 'partnerNote',
        placeholder: 'APECK leverages the trust of the church...',
      },
    ],
  },
  {
    key: 'programs_cbr',
    title: 'Community-Based Rehabilitation',
    description: 'CBR spotlight section content.',
    fields: [
      { type: 'text', label: 'Title', name: 'title', placeholder: 'Community-Based Rehabilitation (CBR)' },
      {
        type: 'text',
        label: 'Subtitle',
        name: 'subtitle',
        placeholder: 'Faith-led reform...',
      },
      { type: 'image', label: 'Feature Image', name: 'image' },
      { type: 'text', label: 'Origin Title', name: 'originTitle', placeholder: 'Origin & Early Success' },
      {
        type: 'textarea',
        label: 'Origin Description',
        name: 'originDescription',
        placeholder: 'Narrative about Kiambaa launch...',
      },
      { type: 'text', label: 'Expansion Title', name: 'expansionTitle', placeholder: 'Expansion & Impact Metrics' },
      {
        type: 'textarea',
        label: 'Expansion Description',
        name: 'expansionDescription',
        placeholder: 'How the program scaled across Kenya',
      },
      { type: 'text', label: 'Metrics Title', name: 'metricsTitle', placeholder: 'Kiambu - Githunguri (12 months)' },
      {
        type: 'repeatable',
        label: 'Metrics',
        name: 'metrics',
        maxItems: 4,
        itemFields: [
          { type: 'text', label: 'Label', name: 'label', placeholder: 'Total Participants' },
          { type: 'text', label: 'Value', name: 'value', placeholder: '640' },
        ],
      },
      { type: 'text', label: 'Partnership Title', name: 'partnershipTitle', placeholder: 'NACADA Partnership' },
      {
        type: 'textarea',
        label: 'Partnership Description',
        name: 'partnershipDescription',
        placeholder: 'Details about the NACADA MOU...',
      },
    ],
  },
  {
    key: 'programs_aftercare',
    title: 'Critical Care & Aftercare',
    description: 'Registration, rehabilitation, and aftercare pillars.',
    fields: [
      { type: 'text', label: 'Title', name: 'title', placeholder: 'Critical Care & Aftercare Pathways' },
      {
        type: 'textarea',
        label: 'Description',
        name: 'description',
        placeholder: 'Short overview of aftercare strategy',
      },
      {
        type: 'repeatable',
        label: 'Pillars',
        name: 'pillars',
        minItems: 1,
        itemFields: [
          { type: 'text', label: 'Title', name: 'title', placeholder: 'Registration & Referral' },
          { type: 'textarea', label: 'Summary', name: 'summary', placeholder: 'How this pillar works' },
          {
            type: 'repeatable',
            label: 'Bullets',
            name: 'bullets',
            itemFields: [{ type: 'text', label: 'Bullet Text', name: 'text' }],
          },
        ],
      },
    ],
  },
  {
    key: 'programs_initiatives',
    title: 'Complementary Initiatives',
    description: 'Additional program cards such as CPM training, youth empowerment, housing, etc.',
    fields: [
      { type: 'text', label: 'Badge Label', name: 'badgeLabel', placeholder: 'EXPANDING IMPACT' },
      { type: 'text', label: 'Title', name: 'title', placeholder: 'Complementary Programs' },
      {
        type: 'textarea',
        label: 'Description',
        name: 'description',
        placeholder: 'Beyond rehabilitation, APECK equips...',
      },
      {
        type: 'repeatable',
        label: 'Initiative Cards',
        name: 'items',
        minItems: 1,
        itemFields: [
          { type: 'text', label: 'Title', name: 'title', placeholder: 'Certified Professional Mediator Training' },
          { type: 'textarea', label: 'Description', name: 'description', placeholder: 'Overview of the initiative' },
          { type: 'text', label: 'Icon (award|sparkles|trend|home)', name: 'icon', placeholder: 'award' },
          { type: 'text', label: 'Highlight', name: 'highlight', placeholder: 'Key outcome or stat' },
          {
            type: 'repeatable',
            label: 'Bullets',
            name: 'bullets',
            itemFields: [{ type: 'text', label: 'Bullet Text', name: 'text' }],
          },
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
  {
    key: 'news_updates',
    title: 'News & Updates Section',
    description: 'Homepage recent updates carousel.',
    fields: [
      { type: 'text', label: 'Badge Label', name: 'badgeLabel', placeholder: 'NEWS & UPDATES' },
      { type: 'text', label: 'Title', name: 'title', placeholder: 'Recent Updates' },
      {
        type: 'textarea',
        label: 'Description',
        name: 'description',
        placeholder: 'Stay informed about our latest activities and events',
      },
      {
        type: 'repeatable',
        label: 'News Cards',
        name: 'items',
        minItems: 1,
        itemFields: [
          { type: 'text', label: 'Title', name: 'title', placeholder: 'Women in Ministry Conference' },
          { type: 'textarea', label: 'Description', name: 'description', placeholder: 'Celebrating and empowering women leaders...' },
          { type: 'text', label: 'Date Label', name: 'date', placeholder: 'NOVEMBER 10, 2024' },
          { type: 'text', label: 'Image URL', name: 'image', placeholder: 'https://...' },
          { type: 'text', label: 'Read More Link', name: 'href', placeholder: '/news/women-in-ministry' },
        ],
      },
    ],
  },
  {
    key: 'about_hero',
    title: 'About Hero',
    description: 'Top hero banner for the About page.',
    fields: [
      { type: 'text', label: 'Badge Label', name: 'badgeLabel', placeholder: 'ABOUT US' },
      { type: 'text', label: 'Title', name: 'title', placeholder: 'About APECK' },
      {
        type: 'textarea',
        label: 'Description',
        name: 'description',
        placeholder: 'Building a unified community...',
      },
      { type: 'image', label: 'Background Image', name: 'backgroundImage' },
    ],
  },
  {
    key: 'about_story',
    title: 'About Story',
    description: 'History section content for the About page.',
    fields: [
      { type: 'text', label: 'Badge Label', name: 'badgeLabel', placeholder: 'OUR STORY' },
      { type: 'text', label: 'Title', name: 'title', placeholder: 'Our Story' },
      { type: 'image', label: 'Primary Image', name: 'image' },
      {
        type: 'repeatable',
        label: 'Paragraphs',
        name: 'paragraphs',
        minItems: 1,
        itemFields: [{ type: 'textarea', label: 'Paragraph Text', name: 'text' }],
      },
    ],
  },
  {
    key: 'about_mission_vision',
    title: 'Mission & Vision',
    description: 'Mission and vision cards for the About page.',
    fields: [
      { type: 'text', label: 'Mission Title', name: 'missionTitle', placeholder: 'Our Mission' },
      {
        type: 'textarea',
        label: 'Mission Description',
        name: 'missionDescription',
        placeholder: 'To empower, equip...',
      },
      { type: 'text', label: 'Mission Icon (target|eye|heart|award)', name: 'missionIcon', placeholder: 'target' },
      { type: 'text', label: 'Vision Title', name: 'visionTitle', placeholder: 'Our Vision' },
      {
        type: 'textarea',
        label: 'Vision Description',
        name: 'visionDescription',
        placeholder: 'A Kenya where...',
      },
      { type: 'text', label: 'Vision Icon (target|eye|heart|award)', name: 'visionIcon', placeholder: 'eye' },
    ],
  },
  {
    key: 'about_values',
    title: 'Core Values',
    description: 'Values grid on the About page.',
    fields: [
      { type: 'text', label: 'Badge Label', name: 'badgeLabel', placeholder: 'OUR VALUES' },
      { type: 'text', label: 'Title', name: 'title', placeholder: 'Core Values' },
      {
        type: 'textarea',
        label: 'Intro Description',
        name: 'description',
        placeholder: 'The principles that guide everything we do',
      },
      {
        type: 'repeatable',
        label: 'Values',
        name: 'items',
        minItems: 1,
        itemFields: [
          { type: 'text', label: 'Title', name: 'title', placeholder: 'Integrity' },
          { type: 'textarea', label: 'Description', name: 'description', placeholder: 'Maintaining the highest ethical standards...' },
          { type: 'text', label: 'Icon (target|eye|heart|award)', name: 'icon', placeholder: 'heart' },
          { type: 'text', label: 'Accent Color (#hex)', name: 'color', placeholder: '#8B2332' },
        ],
      },
    ],
  },
  {
    key: 'about_leadership',
    title: 'Leadership Section',
    description: 'Leadership cards for the About page.',
    fields: [
      { type: 'text', label: 'Badge Label', name: 'badgeLabel', placeholder: 'LEADERSHIP' },
      { type: 'text', label: 'Title', name: 'title', placeholder: 'Our Leadership' },
      {
        type: 'textarea',
        label: 'Intro Description',
        name: 'description',
        placeholder: 'Experienced leaders committed...',
      },
      {
        type: 'repeatable',
        label: 'Leaders',
        name: 'leaders',
        minItems: 1,
        itemFields: [
          { type: 'text', label: 'Name', name: 'name', placeholder: 'Bishop David Kimani' },
          { type: 'text', label: 'Role', name: 'role', placeholder: 'National Chairman' },
          { type: 'textarea', label: 'Description', name: 'description', placeholder: 'Leading APECK with vision...' },
          { type: 'image', label: 'Photo', name: 'image' },
        ],
      },
    ],
  },
];

export function getSectionSchema(key: string): SectionSchema | undefined {
  return SECTION_SCHEMAS.find((schema) => schema.key === key);
}

