import { useEffect, useState, useRef, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  ArrowRightIcon,
  UsersIcon,
  GraduationCapIcon,
  HeartIcon,
  TrendingUpIcon,
  AwardIcon,
  CheckIcon,
  SparklesIcon,
  HomeIcon,
} from 'lucide-react';
import { fetchPageContent } from '../lib/pageContent';
import { resolveMediaUrl } from '../lib/media';

type ProgramsHeroContent = {
  badgeLabel?: string;
  title?: string;
  description?: string;
  backgroundImage?: string;
};

type ProgramsIntroContent = {
  badgeLabel?: string;
  title?: string;
  summary?: string;
  paragraphs?: Array<{ text?: string }>;
  highlights?: Array<{ title?: string; description?: string }>;
  partnerNote?: string;
};

type ProgramsCbrContent = {
  title?: string;
  subtitle?: string;
  image?: string;
  originTitle?: string;
  originDescription?: string;
  expansionTitle?: string;
  expansionDescription?: string;
  metricsTitle?: string;
  metrics?: Array<{ label?: string; value?: string }>;
  partnershipTitle?: string;
  partnershipDescription?: string;
};

type ProgramsAftercareContent = {
  title?: string;
  description?: string;
  pillars?: Array<{
    title?: string;
    summary?: string;
    bullets?: Array<{ text?: string }>;
  }>;
};

type ProgramsInitiativesContent = {
  badgeLabel?: string;
  title?: string;
  description?: string;
  items?: Array<{
    title?: string;
    description?: string;
    icon?: string;
    highlight?: string;
    bullets?: Array<{ text?: string }>;
  }>;
};

type ProgramsFeaturesContent = {
  badgeLabel?: string;
  title?: string;
  description?: string;
  items?: Array<{
    title?: string;
    description?: string;
    icon?: string;
    color?: string;
  }>;
};

type ProgramsCtaContent = {
  badgeLabel?: string;
  title?: string;
  description?: string;
  primary?: { label?: string; href?: string };
  secondary?: { label?: string; href?: string };
};

const ICON_MAP = {
  book: BookOpenIcon,
  users: UsersIcon,
  graduation: GraduationCapIcon,
  heart: HeartIcon,
  trend: TrendingUpIcon,
  award: AwardIcon,
  sparkles: SparklesIcon,
  home: HomeIcon,
};

const defaultProgramsHero: Required<ProgramsHeroContent> = {
  badgeLabel: 'OUR PROGRAMS',
  title: 'Community Transformation Programs',
  description:
    'APECK partners with churches, NACADA, and community leaders to deliver holistic rehabilitation, mediation, youth empowerment, and dignified housing solutions across Kenya.',
  backgroundImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1600&q=75',
};

const defaultProgramsIntro = {
  badgeLabel: 'EXECUTIVE SUMMARY',
  title: "APECK's National Impact",
  summary:
    'Since 2016, APECK has built a faith-led ecosystem that reforms lives, restores families, and strengthens local economies. Our programs merge pastoral care, professional training, and strategic partnerships to create lasting transformation.',
  paragraphs: [
    'The Community-Based Rehabilitation (CBR) model launched in Kiambaa, Kiambu County, and quickly became a template for reform. Clergy-led mentorship helped former gang members, drug users, and parolees rebuild their lives, with many now serving in ministry or community leadership.',
    'In August 2023, APECK signed an MOU with the National Authority for the Campaign Against Alcohol and Drug Abuse (NACADA). This partnership elevated our ability to train Recovery Coaches, scale peer-led counseling, and institutionalize aftercare across Kenya.',
  ],
  highlights: [
    {
      title: 'Holistic Rehabilitation',
      description: 'CBR combines pastoral counseling, peer mentorship, and socio-economic reintegration.',
    },
    {
      title: 'National Reach',
      description: 'By 2023, clergy were implementing CBR-inspired programs in nearly every county.',
    },
    {
      title: 'Strategic Partnerships',
      description: 'Formal collaboration with NACADA, government rehab centers, universities, and employers.',
    },
  ],
  partnerNote:
    'APECK leverages the trust of the church to deliver rehabilitation, economic empowerment, and family cohesion initiatives that keep communities safe and resilient.',
};

const defaultProgramsCbr = {
  title: 'Community-Based Rehabilitation (CBR)',
  subtitle: 'Faith-led reform that scales from Kiambaa to the entire nation.',
  image: '/assets/image2.jpg',
  originTitle: 'Origin & Early Success',
  originDescription:
    'In 2016, clergy in Kiambaa began walking with former Mungiki members, multiple drug abusers, and parolees. Through pastoral counseling, restorative mentorship, and consistent follow up, the majority overcame addiction, rejoined their families, and many are now pastors or active church members.',
  expansionTitle: 'Expansion & Impact Metrics',
  expansionDescription:
    'The Kiambaa template quickly spread across Kiambu and, by 2022, every sub-county had a CBR initiative. The Githunguri case study demonstrates the program’s rigor and transparent tracking.',
  metricsTitle: 'Kiambu - Githunguri (12 months)',
  metrics: [
    { label: 'Total Participants', value: '640' },
    { label: 'Reformed', value: '125' },
    { label: 'Reformation Rate', value: '19.5%' },
  ],
  partnershipTitle: 'NACADA Partnership (Aug 4, 2023)',
  partnershipDescription:
    'The NACADA MOU unlocked formal Recovery Coach training, enabling reformed beneficiaries to serve as professional mentors. Thousands of addicts have since recovered and reintegrated through clergy-NACADA collaboration in nearly every county.',
};

const defaultProgramsAftercare = {
  title: 'Critical Care & Aftercare Pathways',
  description:
    'APECK ensures every beneficiary receives wraparound services—from emergency referrals to economic reintegration.',
  pillars: [
    {
      title: 'Registration & Referral',
      summary: 'Individuals in crisis are assisted to register with Social and Health Assistance (SHA) services.',
      bullets: [
        { text: 'Pastors document each case and coordinate transportation.' },
        { text: 'Urgent cases are referred to government rehab centers such as Ihururu (Nyeri) and Miritini (Mombasa).' },
      ],
    },
    {
      title: 'Specialized Rehabilitation',
      summary: 'Government and partner facilities provide medical, psychological, and spiritual care.',
      bullets: [
        { text: 'APECK chaplains maintain weekly contact for encouragement.' },
        { text: 'Families receive mediation support to prepare for reintegration.' },
      ],
    },
    {
      title: 'Aftercare & Economic Reintegration',
      summary: 'Post-rehab plans focus on education, employment, and entrepreneurship.',
      bullets: [
        { text: 'Talent & skills assessments, plus education return pathways.' },
        { text: 'Job placement through negotiated employer agreements.' },
        { text: 'Seed capital and mentorship for start-ups when formal jobs are limited.' },
      ],
    },
  ],
};

const defaultProgramsInitiatives = {
  badgeLabel: 'EXPANDING IMPACT',
  title: 'Complementary Programs',
  description: 'Beyond rehabilitation, APECK equips clergy, youth, and families with tools for long-term stability.',
  items: [
    {
      title: 'Certified Professional Mediator (CPM) Training',
      description:
        'Clergy are trained as professional mediators to resolve domestic and community conflicts before they escalate.',
      highlight: 'High reconciliation rates and significant drops in domestic violence.',
      icon: 'award',
      bullets: [
        { text: 'Equips pastors with formal mediation credentials.' },
        { text: 'Promotes peaceful dispute resolution across congregations.' },
        { text: 'Documents successful couple reunifications and family healing.' },
      ],
    },
    {
      title: 'Youth Empowerment & Employment',
      description:
        'Training programs help youth identify inherent talents, monetize their skills, and build self-reliance.',
      highlight: 'Constructive engagement replaces dependency on scarce formal jobs.',
      icon: 'sparkles',
      bullets: [
        { text: 'Talent discovery labs, mentorship, and digital skills bootcamps.' },
        { text: 'Entrepreneurship coaching plus access to clergy-led micro grants.' },
        { text: 'Strong focus on innovation, content creation, and agribusiness.' },
      ],
    },
    {
      title: 'Clergy & Youth Economic Empowerment (Housing)',
      description:
        'The APECK Housing Cooperative partners with the Ministry of Lands and the Affordable Housing Program to unlock dignified living.',
      highlight: 'Vision: 60,000 clergy and 100,000 youth homeowners.',
      icon: 'home',
      bullets: [
        { text: 'Collective savings schemes and bulk land acquisition.' },
        { text: 'Access to subsidized mortgages and construction support.' },
        { text: 'Long-term stability that strengthens ministry families.' },
      ],
    },
  ],
};

const defaultProgramsFeatures: Required<ProgramsFeaturesContent> = {
  badgeLabel: 'PROGRAM FEATURES',
  title: 'Program Features',
  description: 'What makes our programs exceptional',
  items: [
    { title: 'Expert Instructors', description: 'Learn from experienced ministry leaders and theologians', icon: 'graduation', color: '#8B2332' },
    { title: 'Practical Training', description: 'Hands-on experience and real-world ministry applications', icon: 'book', color: '#7A7A3F' },
    { title: 'Certification', description: 'Receive recognized certificates upon program completion', icon: 'award', color: '#8B2332' },
    { title: 'Community', description: 'Connect with fellow clergy and build lasting relationships', icon: 'users', color: '#7A7A3F' },
  ]
};

const defaultProgramsCta: Required<ProgramsCtaContent> = {
  badgeLabel: 'GET STARTED',
  title: 'Ready to Grow in Your Ministry?',
  description: 'Enroll in one of our programs and take your ministry to the next level',
  primary: { label: 'Enroll Now', href: '/membership' },
  secondary: { label: 'Contact Us', href: '/contact' }
};

export function Programs() {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [sectionContent, setSectionContent] = useState<Record<string, unknown>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchPageContent('programs')
      .then((page) => {
        if (!isMounted) return;
        // Debug: surface what we received from CMS so issues don't silently fall back to defaults
        try {
          // eslint-disable-next-line no-console
          console.debug('[Programs] fetched page', { slug: page.slug, title: page.title, sections: page.sections?.map(s => s.key) });
        } catch {}
        const map: Record<string, unknown> = {};
        page.sections?.forEach((section) => {
          map[section.key] = section.content;
        });
        setSectionContent(map);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('[Programs] Failed to fetch CMS content for "programs":', err);
        /* fall back to defaults */
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Pattern components (memoized for performance)
  const DottedPattern = memo(({ className = '', size = '24px', opacity = 0.03 }: { className?: string; size?: string; opacity?: number }) => (
    <div className={`absolute inset-0 ${className}`} style={{
      backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
      backgroundSize: `${size} ${size}`,
      opacity: opacity,
      willChange: 'opacity',
    }}></div>
  ));
  DottedPattern.displayName = 'DottedPattern';

  const GeometricPattern = memo(({ className = '', opacity = 0.02 }: { className?: string; opacity?: number }) => {
    const patternId = useMemo(() => `geometric-pattern-${Math.random().toString(36).substr(2, 9)}`, []);
    return (
      <div className={`absolute inset-0 ${className}`} style={{ opacity, willChange: 'opacity' }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={patternId} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <polygon points="30,0 60,30 30,60 0,30" fill="none" stroke="#8B2332" strokeWidth="0.5" opacity="0.3"/>
              <polygon points="15,0 30,15 15,30 0,15" fill="none" stroke="#7A7A3F" strokeWidth="0.3" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>
    );
  });
  GeometricPattern.displayName = 'GeometricPattern';

  const AbstractShape = memo(({ position = 'right', color = '#8B2332' }: { position?: 'left' | 'right' | 'top' | 'bottom'; color?: string }) => {
    const positions = {
      right: 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
      left: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
      top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
      bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2'
    };

    return (
      <div className={`absolute ${positions[position]} w-64 h-64 md:w-96 md:h-96 opacity-5`} style={{ willChange: 'transform' }}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M 100,0 Q 150,50 150,100 Q 150,150 100,150 Q 50,150 50,100 Q 50,50 100,0 Z"
            fill={color}
            transform="rotate(45 100 100)"
          />
        </svg>
      </div>
    );
  });
  AbstractShape.displayName = 'AbstractShape';

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const updates: { [key: string]: boolean } = {};
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-animate-id');
            if (id && !isVisible[id]) {
              updates[id] = true;
              observerRef.current?.unobserve(entry.target);
            }
          }
        });
        
        if (Object.keys(updates).length > 0) {
          setIsVisible((prev) => ({ ...prev, ...updates }));
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('[data-animate-id]');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        elements.forEach((el) => observerRef.current?.unobserve(el));
        observerRef.current.disconnect();
      }
    };
  }, [isVisible]);

  const heroContent = sectionContent['programs_hero'] as ProgramsHeroContent | undefined;
  const heroBackgroundImage =
    heroContent?.backgroundImage?.trim()
      ? resolveMediaUrl(heroContent.backgroundImage.trim())
      : defaultProgramsHero.backgroundImage;
  const heroBadgeLabel = heroContent?.badgeLabel?.trim() || defaultProgramsHero.badgeLabel;
  const heroTitle = heroContent?.title?.trim() || defaultProgramsHero.title;
  const heroDescription = heroContent?.description?.trim() || defaultProgramsHero.description;

  const introContent = sectionContent['programs_intro'] as ProgramsIntroContent | undefined;
  const introBadge = introContent?.badgeLabel?.trim() || defaultProgramsIntro.badgeLabel;
  const introTitle = introContent?.title?.trim() || defaultProgramsIntro.title;
  const introSummary = introContent?.summary?.trim() || defaultProgramsIntro.summary;
  const introParagraphs =
    introContent?.paragraphs
      ?.map((item) => item.text?.trim())
      .filter(Boolean) ?? defaultProgramsIntro.paragraphs;
  const introHighlights =
    introContent?.highlights?.map((item) => ({
      title: item.title?.trim() || '',
      description: item.description?.trim() || '',
    })).filter((item) => item.title && item.description) ?? defaultProgramsIntro.highlights;
  const introPartnerNote = introContent?.partnerNote?.trim() || defaultProgramsIntro.partnerNote;

  const cbrContent = sectionContent['programs_cbr'] as ProgramsCbrContent | undefined;
  const cbr = {
    title: cbrContent?.title?.trim() || defaultProgramsCbr.title,
    subtitle: cbrContent?.subtitle?.trim() || defaultProgramsCbr.subtitle,
    image: cbrContent?.image?.trim()
      ? resolveMediaUrl(cbrContent.image.trim())
      : defaultProgramsCbr.image,
    originTitle: cbrContent?.originTitle?.trim() || defaultProgramsCbr.originTitle,
    originDescription:
      cbrContent?.originDescription?.trim() || defaultProgramsCbr.originDescription,
    expansionTitle: cbrContent?.expansionTitle?.trim() || defaultProgramsCbr.expansionTitle,
    expansionDescription:
      cbrContent?.expansionDescription?.trim() || defaultProgramsCbr.expansionDescription,
    metricsTitle: cbrContent?.metricsTitle?.trim() || defaultProgramsCbr.metricsTitle,
    metrics:
      cbrContent?.metrics?.map((metric) => ({
        label: metric.label?.trim() || '',
        value: metric.value?.trim() || '',
      })).filter((metric) => metric.label && metric.value) ?? defaultProgramsCbr.metrics,
    partnershipTitle:
      cbrContent?.partnershipTitle?.trim() || defaultProgramsCbr.partnershipTitle,
    partnershipDescription:
      cbrContent?.partnershipDescription?.trim() || defaultProgramsCbr.partnershipDescription,
  };

  const aftercareContent = sectionContent['programs_aftercare'] as ProgramsAftercareContent | undefined;
  const aftercarePillarsSource = aftercareContent?.pillars ?? defaultProgramsAftercare.pillars;
  const aftercare = {
    title: aftercareContent?.title?.trim() || defaultProgramsAftercare.title,
    description: aftercareContent?.description?.trim() || defaultProgramsAftercare.description,
    pillars: aftercarePillarsSource
      .map((pillar) => ({
        title: pillar.title?.trim() || '',
        summary: pillar.summary?.trim() || '',
        bullets:
          pillar.bullets
            ?.map((bullet) =>
              typeof bullet === 'string' ? bullet.trim() : bullet.text?.trim(),
            )
            .filter((text): text is string => Boolean(text)) ?? [],
      }))
      .filter((pillar) => pillar.title && pillar.summary),
  };

  const initiativesContent = sectionContent['programs_initiatives'] as ProgramsInitiativesContent | undefined;
  const initiativesItemsSource = initiativesContent?.items ?? defaultProgramsInitiatives.items;
  const initiatives = {
    badgeLabel: initiativesContent?.badgeLabel?.trim() || defaultProgramsInitiatives.badgeLabel,
    title: initiativesContent?.title?.trim() || defaultProgramsInitiatives.title,
    description: initiativesContent?.description?.trim() || defaultProgramsInitiatives.description,
    items: initiativesItemsSource
      .map((item) => ({
        title: item.title?.trim() || '',
        description: item.description?.trim() || '',
        icon: item.icon?.trim()?.toLowerCase() || 'book',
        highlight: item.highlight?.trim() || '',
        bullets:
          item.bullets
            ?.map((bullet) =>
              typeof bullet === 'string' ? bullet.trim() : bullet.text?.trim(),
            )
            .filter((text): text is string => Boolean(text)) ?? [],
      }))
      .filter((item) => item.title && item.description),
  };

  const featuresContent = sectionContent['programs_features'] as ProgramsFeaturesContent | undefined;
  const featuresItemsSource = featuresContent?.items ?? defaultProgramsFeatures.items;
  const features = {
    badgeLabel: featuresContent?.badgeLabel?.trim() || defaultProgramsFeatures.badgeLabel,
    title: featuresContent?.title?.trim() || defaultProgramsFeatures.title,
    description: featuresContent?.description?.trim() || defaultProgramsFeatures.description,
    items: featuresItemsSource
      .map((item) => ({
        title: item.title?.trim() || '',
        description: item.description?.trim() || '',
        icon: (item.icon?.trim()?.toLowerCase() || 'book') as keyof typeof ICON_MAP,
        color: item.color?.trim() || '#8B2332',
      }))
      .filter((i) => i.title && i.description),
  };

  const ctaContent = sectionContent['programs_cta'] as ProgramsCtaContent | undefined;
  const cta = {
    badgeLabel: ctaContent?.badgeLabel?.trim() || defaultProgramsCta.badgeLabel,
    title: ctaContent?.title?.trim() || defaultProgramsCta.title,
    description: ctaContent?.description?.trim() || defaultProgramsCta.description,
    primary: {
      label: ctaContent?.primary?.label?.trim() || defaultProgramsCta.primary.label,
      href: ctaContent?.primary?.href?.trim() || defaultProgramsCta.primary.href,
    },
    secondary: {
      label: ctaContent?.secondary?.label?.trim() || defaultProgramsCta.secondary.label,
      href: ctaContent?.secondary?.href?.trim() || defaultProgramsCta.secondary.href,
    },
  };

  return (
    <div className="w-full bg-white dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] pt-20 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackgroundImage})`, willChange: 'background-image' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B2332]/85 via-[#8B2332]/80 to-[#6B1A28]/85"></div>
        <DottedPattern opacity={0.08} size="32px" />
        <DottedPattern opacity={0.05} size="48px" />
        <GeometricPattern opacity={0.04} />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <AbstractShape position="top" color="#ffffff" />
        <AbstractShape position="bottom" color="#ffffff" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="transform transition-all duration-700" data-animate-id="programs-hero">
            <div className={`${isVisible['programs-hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-lg border border-white/20">
                  {heroBadgeLabel}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                {heroTitle}
              </h1>
              <p className="text-sm md:text-base text-white/95 max-w-3xl leading-relaxed">
                {heroDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Introduction */}
      <section className="relative py-16 md:py-24 bg-white dark:bg-gray-950 overflow-hidden transition-colors duration-300">
        {/* Background textures for visual depth */}
        <DottedPattern opacity={0.05} size="40px" />
        <DottedPattern opacity={0.03} size="80px" className="mix-blend-multiply" />
        <GeometricPattern opacity={0.02} />
        {/* Soft radial accents */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#8B2332]/5 dark:bg-[#8B2332]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#7A7A3F]/5 dark:bg-[#7A7A3F]/10 rounded-full blur-3xl"></div>
        {/* Abstract corner ornaments */}
        <AbstractShape position="top" color="#8B2332" />
        <AbstractShape position="bottom" color="#7A7A3F" />
        {/* Subtle vector shapes for “National Impact” */}
        <div className="absolute -top-8 left-8 w-40 h-40 opacity-5 hidden lg:block">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <circle cx="60" cy="60" r="48" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.18" />
            <circle cx="60" cy="60" r="34" fill="none" stroke="#7A7A3F" strokeWidth="0.9" opacity="0.14" />
          </svg>
        </div>
        <div className="absolute -bottom-10 right-10 w-32 h-32 opacity-5 hidden lg:block">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <polygon points="60,5 115,60 60,115 5,60" fill="#8B2332" opacity="0.08" />
            <polygon points="60,20 100,60 60,100 20,60" fill="#7A7A3F" opacity="0.06" />
          </svg>
        </div>
        {/* Additional floating accents */}
        <div className="absolute top-10 left-1/3 w-20 h-20 opacity-5 hidden xl:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 65,25 50,50 35,25" fill="#8B2332" opacity="0.10" />
          </svg>
        </div>
        <div className="absolute bottom-6 left-1/5 w-24 h-24 opacity-5 hidden md:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="22" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.12" />
            <circle cx="50" cy="50" r="14" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.10" />
          </svg>
        </div>
        <div className="absolute top-1/4 right-1/4 w-28 h-28 opacity-5 hidden lg:block">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <rect x="20" y="20" width="80" height="80" rx="14" fill="#7A7A3F" opacity="0.07" />
            <rect x="32" y="32" width="56" height="56" rx="10" fill="#8B2332" opacity="0.06" />
          </svg>
        </div>
        {/* Diagonal glow band with dark-mode variant */}
        <div className="pointer-events-none absolute inset-x-0 -top-6 h-24 bg-gradient-to-b from-white/40 to-transparent dark:from-[#0f0f10]/40 dark:to-transparent"></div>
        {/* Tiny scattered dots */}
        <span className="absolute top-14 left-16 w-2 h-2 rounded-full bg-[#8B2332]/20 dark:bg-[#B85C6D]/25"></span>
        <span className="absolute top-24 right-20 w-1.5 h-1.5 rounded-full bg-[#7A7A3F]/25"></span>
        <span className="absolute bottom-24 left-8 w-1.5 h-1.5 rounded-full bg-[#8B2332]/25"></span>
        <span className="absolute bottom-10 right-1/3 w-2 h-2 rounded-full bg-[#7A7A3F]/25"></span>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="transform transition-all duration-700" data-animate-id="programs-intro">
            <div className={`${isVisible['programs-intro'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-4">
                <span className="inline-block px-4 py-2 bg-[#8B2332]/10 text-[#8B2332] dark:text-[#FAD2D9] rounded-full text-xs font-bold tracking-wide">
                  {introBadge}
                </span>
        </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                {introTitle}
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
                {introSummary}
              </p>
        </div>
        </div>
          <div className="mt-12 grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              {introParagraphs.map((paragraph, index) => (
                <div
                  key={`intro-paragraph-${index}`}
                  className="flex items-start space-x-4 p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-[#8B2332]/10 flex items-center justify-center flex-shrink-0">
                    <CheckIcon size={20} className="text-[#8B2332]" />
        </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{paragraph}</p>
        </div>
              ))}
        </div>
            <div className="space-y-6">
              {introHighlights.map((highlight, index) => (
                <div
                  key={`intro-highlight-${index}`}
                  className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl"
                >
                  <p className="text-xs font-semibold text-[#7A7A3F] uppercase tracking-widest mb-2">
                    #{String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-lg font-bold text-[#8B2332] dark:text-[#FAD2D9] mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {highlight.description}
                  </p>
        </div>
              ))}
        </div>
        </div>
          {introPartnerNote && (
            <div className="mt-12 p-6 md:p-8 bg-gradient-to-r from-[#8B2332]/10 to-[#7A7A3F]/10 dark:from-[#8B2332]/20 dark:to-[#7A7A3F]/20 border border-[#8B2332]/15 dark:border-[#7A7A3F]/30 rounded-3xl shadow-lg">
              <p className="text-base md:text-lg font-semibold text-[#8B2332] dark:text-[#FAD2D9] italic leading-relaxed">
                {introPartnerNote}
              </p>
        </div>
          )}
        </div>
      </section>

      {/* Community-Based Rehabilitation */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#FDF4F4] via-[#F8ECE4] to-[#F4E6DC] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] overflow-hidden transition-colors duration-300">
        <DottedPattern opacity={0.05} size="48px" />
        <GeometricPattern opacity={0.02} />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white/40 to-transparent dark:from-[#0f0f10]/40 pointer-events-none"></div>
        {/* Decorative graphics & animations for CBR */}
        <div
          className={`absolute top-1/5 left-1/6 w-56 h-56 opacity-4 hidden lg:block animate-float transition-all duration-700 ${
            isVisible['cbr-poly-left'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="cbr-poly-left"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.15"/>
            <polygon points="50,15 85,50 50,85 15,50" fill="#7A7A3F" opacity="0.12"/>
          </svg>
        </div>
        <div
          className={`absolute top-1/3 right-1/5 w-48 h-48 opacity-4 hidden xl:block transition-all duration-700 ${
            isVisible['cbr-diamond-right'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="cbr-diamond-right"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,5 95,50 50,95 5,50" fill="#8B2332" opacity="0.1"/>
          </svg>
        </div>
        <div
          className={`absolute bottom-1/4 left-1/4 w-36 h-36 opacity-4 hidden lg:block animate-pulse-slow transition-all duration-700 ${
            isVisible['cbr-circles-left'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="cbr-circles-left"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="32" fill="none" stroke="#8B2332" strokeWidth="1.2" opacity="0.15"/>
            <circle cx="50" cy="50" r="22" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.12"/>
          </svg>
        </div>
        <div
          className={`absolute top-0 right-0 w-96 h-96 bg-[#8B2332]/3 rounded-full blur-3xl transition-all duration-700 ${
            isVisible['cbr-blob-right'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="cbr-blob-right"
        ></div>
        <div
          className={`absolute bottom-0 left-0 w-80 h-80 bg-[#7A7A3F]/3 rounded-full blur-3xl transition-all duration-700 ${
            isVisible['cbr-blob-left'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="cbr-blob-left"
        ></div>
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.015] hidden xl:block pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #8B2332 1px, transparent 1px), linear-gradient(to bottom, #7A7A3F 1px, transparent 1px)`,
            backgroundSize: '70px 70px'
          }}
        ></div>
        {/* Accent lines */}
        <div className="absolute top-1/2 left-0 w-px h-64 bg-gradient-to-b from-transparent via-[#8B2332]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/2 right-0 w-px h-64 bg-gradient-to-b from-transparent via-[#7A7A3F]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-px bg-gradient-to-r from-transparent via-[#8B2332]/8 to-transparent hidden lg:block"></div>
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-40 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/8 to-transparent hidden lg:block"></div>
        {/* Additional decorative shapes */}
        <div
          className={`absolute top-1/6 right-1/4 w-20 h-20 opacity-4 hidden xl:block transition-all duration-700 ${
            isVisible['cbr-star-right'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="cbr-star-right"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,10 L55,40 L85,40 L60,60 L70,90 L50,72 L30,90 L40,60 L15,40 L45,40 Z" fill="#8B2332" opacity="0.08"/>
          </svg>
        </div>
        <div
          className={`absolute bottom-1/6 left-1/5 w-24 h-24 opacity-4 hidden xl:block transition-all duration-700 ${
            isVisible['cbr-hex-center'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="cbr-hex-center"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="none" stroke="#7A7A3F" strokeWidth="1.2" opacity="0.12"/>
          </svg>
        </div>
        <div
          className={`absolute top-4 left-1/3 w-28 h-12 opacity-4 hidden lg:block transition-all duration-700 ${
            isVisible['cbr-wave-top'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="cbr-wave-top"
        >
          <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,60 Q40,40 80,60 T160,60 T200,60" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.1"/>
          </svg>
              </div>
        {/* Floating dots */}
        <div className="absolute top-16 left-12 w-2 h-2 bg-[#8B2332]/20 rounded-full hidden lg:block"></div>
        <div className="absolute top-24 right-12 w-2 h-2 bg-[#7A7A3F]/20 rounded-full hidden lg:block"></div>
        <div className="absolute bottom-20 left-10 w-2 h-2 bg-[#8B2332]/20 rounded-full hidden lg:block"></div>
        <div className="absolute bottom-28 right-14 w-2 h-2 bg-[#7A7A3F]/20 rounded-full hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="transform transition-all duration-700" data-animate-id="programs-cbr-text">
                <div className={`${isVisible['programs-cbr-text'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <span className="inline-flex px-4 py-2 rounded-full bg-white/80 dark:bg-gray-900/60 border border-white/60 dark:border-gray-700 text-xs font-semibold tracking-widest text-[#8B2332] mb-4">
                    COMMUNITY-BASED REHABILITATION
                  </span>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
                    {cbr.title}
              </h2>
                  <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6">
                    {cbr.subtitle}
              </p>
            </div>
          </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl">
                  <p className="text-xs font-semibold text-[#7A7A3F] uppercase tracking-widest mb-2">
                    {cbr.originTitle}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {cbr.originDescription}
                  </p>
                      </div>
                <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl">
                  <p className="text-xs font-semibold text-[#8B2332] uppercase tracking-widest mb-2">
                    {cbr.expansionTitle}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {cbr.expansionDescription}
                  </p>
                    </div>
                  </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {cbr.metrics.map((metric, index) => (
                  <div
                    key={`cbr-metric-${metric.label}-${index}`}
                    className="p-4 rounded-2xl bg-[#8B2332]/10 dark:bg-[#8B2332]/20 border border-[#8B2332]/15 dark:border-[#8B2332]/30 text-center"
                  >
                    <p className="text-2xl md:text-3xl font-extrabold text-[#8B2332] dark:text-[#FAD2D9]">{metric.value}</p>
                    <p className="text-xs uppercase tracking-widest text-[#7A7A3F] dark:text-[#D7D2B4]">{metric.label}</p>
                  </div>
                ))}
                      </div>
              <div className="p-6 rounded-3xl bg-white/90 dark:bg-gray-900/70 border border-[#8B2332]/15 dark:border-[#8B2332]/30 shadow-lg">
                <p className="text-xs font-semibold text-[#8B2332] uppercase tracking-widest mb-2">
                  {cbr.partnershipTitle}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {cbr.partnershipDescription}
                </p>
                    </div>
                  </div>
            <div
              className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/60 dark:border-gray-800/60"
              data-animate-id="programs-cbr-visual"
            >
              <div className={`${isVisible['programs-cbr-visual'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <img
                  src={cbr.image}
                  alt={cbr.title}
                  className="w-full h-[520px] object-cover"
                      loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-3xl bg-white/90 dark:bg-gray-900/90 border border-white/60 dark:border-gray-800/70 shadow-xl">
                  <p className="text-sm font-semibold text-[#8B2332] dark:text-[#FAD2D9]">
                    Faith-led reform in action
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Documented outcomes from clergy & community partnerships
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* Critical Care & Aftercare */}
      <section className="relative py-16 md:py-24 bg-white dark:bg-gray-950 overflow-hidden transition-colors duration-300">
        <DottedPattern opacity={0.035} size="36px" />
        <GeometricPattern opacity={0.015} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#8B2332]/5 dark:bg-[#8B2332]/10 rounded-full blur-3xl pointer-events-none"></div>
        {/* Extra decorative graphics */}
        <div className="absolute -top-10 -left-10 w-40 h-40 opacity-5 hidden md:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,5 95,50 50,95 5,50" fill="#8B2332" opacity="0.12"/>
            <polygon points="50,20 80,50 50,80 20,50" fill="#7A7A3F" opacity="0.1"/>
          </svg>
        </div>
        <div className="absolute bottom-10 -right-10 w-48 h-48 opacity-5 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#7A7A3F" strokeWidth="1.5" opacity="0.12"/>
            <circle cx="50" cy="50" r="28" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.1"/>
          </svg>
        </div>
        <div className="absolute top-1/2 right-1/4 w-24 h-px bg-gradient-to-r from-transparent via-[#8B2332]/15 to-transparent transform rotate-45 hidden xl:block"></div>
        <div className="absolute bottom-1/3 left-1/5 w-24 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/15 to-transparent transform -rotate-45 hidden xl:block"></div>
        {/* Additional accents & depth */}
        <div
          className={`absolute top-1/4 left-1/6 w-56 h-56 opacity-4 hidden lg:block animate-float transition-all duration-700 ${
            isVisible['ac-poly-left'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="ac-poly-left"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.15"/>
            <polygon points="50,15 85,50 50,85 15,50" fill="#7A7A3F" opacity="0.12"/>
          </svg>
        </div>
        <div
          className={`absolute top-0 right-1/5 w-44 h-44 opacity-4 hidden xl:block transition-all duration-700 ${
            isVisible['ac-diamond-right'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="ac-diamond-right"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,5 95,50 50,95 5,50" fill="#7A7A3F" opacity="0.1"/>
          </svg>
        </div>
        <div
          className={`absolute bottom-1/5 left-1/4 w-36 h-36 opacity-4 hidden lg:block animate-pulse-slow transition-all duration-700 ${
            isVisible['ac-circles-left'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="ac-circles-left"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="35" fill="none" stroke="#8B2332" strokeWidth="1.2" opacity="0.15"/>
            <circle cx="50" cy="50" r="22" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.12"/>
          </svg>
        </div>
        {/* Grid overlay for subtle texture */}
        <div
          className="absolute inset-0 opacity-[0.015] hidden xl:block pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #8B2332 1px, transparent 1px), linear-gradient(to bottom, #7A7A3F 1px, transparent 1px)`,
            backgroundSize: '70px 70px'
          }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 md:mb-20 transform transition-all duration-700" data-animate-id="programs-aftercare">
            <div className={`${isVisible['programs-aftercare'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-block px-5 py-2 bg-[#8B2332]/10 text-[#8B2332] dark:text-[#FAD2D9] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-sm">
                Care Continuum
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mt-4 mb-4">
                {aftercare.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-3xl mx-auto">
                {aftercare.description}
              </p>
        </div>
        </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {aftercare.pillars.map((pillar, index) => {
              const animateId = `programs-aftercare-pillar-${index}`;
              return (
                <div
                  key={pillar.title}
                  className="transform transition-all duration-700"
                  data-animate-id={animateId}
                >
                  <div
                    className={`h-full p-6 md:p-8 rounded-3xl bg-gray-50 dark:bg-gray-900/70 border border-gray-100 dark:border-gray-800 shadow-xl ${
                      isVisible[animateId] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#8B2332]/10 text-[#8B2332] flex items-center justify-center font-bold">
                        {String(index + 1).padStart(2, '0')}
        </div>
                      <h3 className="text-lg md:text-xl font-semibold text-[#8B2332] dark:text-[#FAD2D9]">
                        {pillar.title}
                      </h3>
        </div>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      {pillar.summary}
                    </p>
                    {pillar.bullets.length > 0 && (
                      <ul className="mt-5 space-y-3">
                        {pillar.bullets.map((bullet, bulletIdx) => (
                          <li key={`${pillar.title}-bullet-${bulletIdx}`} className="flex items-start space-x-3 text-sm text-gray-600 dark:text-gray-300">
                            <CheckIcon size={16} className="mt-0.5 text-[#7A7A3F]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
        </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Complementary Initiatives */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#FEF6F6] via-[#FDF0F3] to-[#F7E5EC] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] overflow-hidden transition-colors duration-300">
        <DottedPattern opacity={0.04} size="32px" />
        <GeometricPattern opacity={0.02} />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/70 to-transparent dark:from-[#0f0f10]/70 dark:to-transparent pointer-events-none"></div>
        <div
          className={`absolute -bottom-10 right-0 w-72 h-72 bg-[#8B2332]/10 rounded-full blur-3xl transition-all duration-700 ${
            isVisible['pi-bg-blob-right'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="pi-bg-blob-right"
        ></div>
        {/* Additional subtle graphics */}
        <div
          className={`absolute top-8 left-10 w-24 h-24 opacity-5 hidden lg:block animate-float transition-all duration-700 ${
            isVisible['pi-bg-rect'] ? 'opacity-50 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="pi-bg-rect"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="25" y="25" width="50" height="50" rx="8" fill="#8B2332" opacity="0.08" />
          </svg>
        </div>
        <div
          className={`absolute bottom-8 left-1/4 w-20 h-20 opacity-5 hidden lg:block animate-pulse-slow transition-all duration-700 ${
            isVisible['pi-bg-wave'] ? 'opacity-50 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="pi-bg-wave"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M0,50 Q25,35 50,50 T100,50" fill="none" stroke="#7A7A3F" strokeWidth="1.2" opacity="0.12"/>
          </svg>
        </div>
        {/* Graphics parity with Program Features */}
        <div
          className={`absolute top-1/4 left-1/5 w-56 h-56 opacity-4 hidden lg:block animate-float transition-all duration-700 ${
            isVisible['pi-bg-poly-left'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="pi-bg-poly-left"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.15"/>
            <polygon points="50,15 85,50 50,85 15,50" fill="#7A7A3F" opacity="0.12"/>
          </svg>
        </div>
        <div
          className={`absolute bottom-1/4 right-1/5 w-52 h-52 opacity-4 hidden lg:block animate-pulse-slow transition-all duration-700 ${
            isVisible['pi-bg-organic-right'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="pi-bg-organic-right"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M 50,0 Q 80,25 80,60 Q 80,95 50,85 Q 20,95 20,60 Q 20,25 50,0 Z" fill="#7A7A3F" opacity="0.15" />
          </svg>
        </div>
        <div
          className={`absolute top-1/3 right-1/4 w-44 h-44 opacity-3 hidden xl:block transition-all duration-700 ${
            isVisible['pi-bg-diamond-right'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="pi-bg-diamond-right"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,5 95,50 50,95 5,50" fill="#8B2332" opacity="0.1"/>
          </svg>
        </div>
        <div
          className={`absolute bottom-1/3 left-1/4 w-40 h-40 opacity-3 hidden xl:block transition-all duration-700 ${
            isVisible['pi-bg-hex-left'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="pi-bg-hex-left"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M 50,0 L 100,86.6 L 50,100 L 0,86.6 Z" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.12"/>
          </svg>
        </div>
        {/* More accents */}
        <div
          className={`absolute top-10 right-1/5 w-28 h-28 opacity-4 hidden lg:block animate-float transition-all duration-700 ${
            isVisible['pi-bg-kite-right'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="pi-bg-kite-right"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,5 95,50 50,95 5,50" fill="#8B2332" opacity="0.12"/>
            <polygon points="50,20 80,50 50,80 20,50" fill="#7A7A3F" opacity="0.1"/>
          </svg>
              </div>
        <div
          className={`absolute bottom-10 left-1/5 w-32 h-32 opacity-4 hidden lg:block animate-pulse-slow transition-all duration-700 ${
            isVisible['pi-bg-circles-left'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          data-animate-id="pi-bg-circles-left"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#8B2332" strokeWidth="1.2" opacity="0.15"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.12"/>
          </svg>
                  </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] hidden xl:block" style={{
          backgroundImage: `linear-gradient(to right, #8B2332 1px, transparent 1px), linear-gradient(to bottom, #7A7A3F 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}></div>
        {/* Blur effects for depth */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#8B2332]/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#7A7A3F]/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B2332]/2 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-[#7A7A3F]/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-[#8B2332]/2 rounded-full blur-3xl"></div>
        {/* Decorative lines */}
        <div className="absolute top-1/2 left-0 w-px h-64 bg-gradient-to-b from-transparent via-[#8B2332]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/2 right-0 w-px h-64 bg-gradient-to-b from-transparent via-[#7A7A3F]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-px bg-gradient-to-r from-transparent via-[#8B2332]/8 to-transparent hidden lg:block"></div>
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-40 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/8 to-transparent hidden lg:block"></div>
        {/* Diagonal accent lines */}
        <div className="absolute top-1/2 right-1/4 w-32 h-px bg-gradient-to-r from-transparent via-[#8B2332]/15 to-transparent transform rotate-45 hidden xl:block"></div>
        <div className="absolute bottom-1/3 left-1/4 w-32 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/15 to-transparent transform -rotate-45 hidden xl:block"></div>
        <div className="absolute top-1/3 left-1/3 w-24 h-px bg-gradient-to-r from-transparent via-[#8B2332]/12 to-transparent transform rotate-12 hidden xl:block"></div>
        <div className="absolute bottom-1/2 right-1/3 w-24 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/12 to-transparent transform -rotate-12 hidden xl:block"></div>
        {/* Floating decorative dots */}
        <div className="absolute top-16 left-10 w-2.5 h-2.5 bg-[#8B2332]/25 rounded-full hidden md:block"></div>
        <div className="absolute top-24 right-12 w-2 h-2 bg-[#7A7A3F]/25 rounded-full hidden md:block"></div>
        <div className="absolute bottom-20 left-12 w-2 h-2 bg-[#8B2332]/25 rounded-full hidden md:block"></div>
        <div className="absolute bottom-28 right-10 w-2.5 h-2.5 bg-[#7A7A3F]/25 rounded-full hidden md:block"></div>
        <div className="absolute top-1/2 left-1/6 -translate-y-1/2 w-1.5 h-1.5 bg-[#8B2332]/20 rounded-full hidden xl:block"></div>
        <div className="absolute bottom-1/2 right-1/6 translate-y-1/2 w-1.5 h-1.5 bg-[#7A7A3F]/20 rounded-full hidden xl:block"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#8B2332]/20 rounded-full hidden lg:block"></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-[#7A7A3F]/20 rounded-full hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 md:mb-20 transform transition-all duration-700" data-animate-id="programs-initiatives">
            <div className={`${isVisible['programs-initiatives'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-block px-5 py-2 bg-white/80 dark:bg-gray-900/60 text-[#8B2332] dark:text-[#FAD2D9] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-sm border border-white/60 dark:border-gray-700">
                {initiatives.badgeLabel}
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#8B2332] dark:text-[#FAD2D9] mt-4 mb-4">
                {initiatives.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-200 text-base md:text-lg max-w-3xl mx-auto">
                {initiatives.description}
                  </p>
                </div>
            </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {initiatives.items.map((item, index) => {
              const animateId = `programs-initiative-${index}`;
              const iconKey = ((item.icon as keyof typeof ICON_MAP) || 'book') as keyof typeof ICON_MAP;
              const Icon = ICON_MAP[iconKey] ?? BookOpenIcon;
              return (
                <div 
                  key={`${item.title}-${index}`}
                  className="transform transition-all duration-700"
                  data-animate-id={animateId}
                >
                  <div
                    className={`h-full p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl ${
                      isVisible[animateId] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#8B2332]/10 dark:bg-[#8B2332]/20 flex items-center justify-center border border-[#8B2332]/20 dark:border-[#8B2332]/30">
                        <Icon size={28} className="text-[#8B2332] dark:text-[#FAD2D9]" strokeWidth={2.5} />
                      </div>
                      {item.highlight && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#7A7A3F]/10 text-[#7A7A3F] dark:text-[#D7D2B4]">
                          {item.highlight}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {item.title}
                      </h3>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                    {item.bullets.length > 0 && (
                      <ul className="mt-6 space-y-2">
                        {item.bullets.map((bullet, bulletIdx) => (
                          <li key={`${item.title}-bullet-${bulletIdx}`} className="flex items-start space-x-3 text-sm text-gray-600 dark:text-gray-300">
                            <CheckIcon size={16} className="mt-0.5 text-[#8B2332]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#FEFAF4] via-[#F6F0E8]/70 to-[#F1E5D9] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="currentColor" className="text-white dark:text-gray-800"/>
          </svg>
        </div>
      </div>

      {/* Program Features */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#FEFAF4] via-[#F6F0E8]/70 to-[#F1E5D9] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] overflow-hidden transition-colors duration-300">
        {/* Enhanced background graphics - multiple layers */}
        <DottedPattern opacity={0.04} size="32px" />
        <DottedPattern opacity={0.02} size="48px" className="mix-blend-multiply" />
        <DottedPattern opacity={0.015} size="64px" className="opacity-30" />
        <GeometricPattern opacity={0.025} />
        <GeometricPattern opacity={0.015} className="rotate-45" />
        <GeometricPattern opacity={0.01} className="rotate-90" />
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#8B2332" />
        <AbstractShape position="bottom" color="#7A7A3F" />
        <AbstractShape position="left" color="#8B2332" />
        <AbstractShape position="right" color="#7A7A3F" />
        
        {/* Additional decorative geometric shapes */}
        <div className="absolute top-1/4 left-1/5 w-56 h-56 opacity-4 hidden lg:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.15"/>
            <polygon points="50,15 85,50 50,85 15,50" fill="#7A7A3F" opacity="0.12"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 right-1/5 w-52 h-52 opacity-4 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,0 Q 80,25 80,60 Q 80,95 50,85 Q 20,95 20,60 Q 20,25 50,0 Z"
              fill="#7A7A3F"
              opacity="0.15"
            />
          </svg>
        </div>
        
        <div className="absolute top-1/3 right-1/4 w-44 h-44 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,5 95,50 50,95 5,50" fill="#8B2332" opacity="0.1"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/3 left-1/4 w-40 h-40 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,0 L 100,86.6 L 50,100 L 0,86.6 Z"
              fill="none"
              stroke="#7A7A3F"
              strokeWidth="1"
              opacity="0.12"
            />
          </svg>
        </div>
        
        {/* More floating shapes */}
        <div className="absolute top-1/5 left-1/3 w-36 h-36 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,8 92,50 50,92 8,50" fill="#8B2332" opacity="0.08"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/5 right-1/3 w-32 h-32 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#7A7A3F" strokeWidth="1.5" opacity="0.1"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.08"/>
          </svg>
        </div>
        
        {/* Blur effects for depth */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#8B2332]/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#7A7A3F]/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B2332]/2 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-[#7A7A3F]/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-[#8B2332]/2 rounded-full blur-3xl"></div>
        
        {/* Decorative lines */}
        <div className="absolute top-1/2 left-0 w-px h-64 bg-gradient-to-b from-transparent via-[#8B2332]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/2 right-0 w-px h-64 bg-gradient-to-b from-transparent via-[#7A7A3F]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-px bg-gradient-to-r from-transparent via-[#8B2332]/8 to-transparent hidden lg:block"></div>
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-40 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/8 to-transparent hidden lg:block"></div>
        
        {/* Diagonal accent lines */}
        <div className="absolute top-1/2 right-1/4 w-32 h-px bg-gradient-to-r from-transparent via-[#8B2332]/15 to-transparent transform rotate-45 hidden xl:block"></div>
        <div className="absolute bottom-1/3 left-1/4 w-32 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/15 to-transparent transform -rotate-45 hidden xl:block"></div>
        <div className="absolute top-1/3 left-1/3 w-24 h-px bg-gradient-to-r from-transparent via-[#8B2332]/12 to-transparent transform rotate-12 hidden xl:block"></div>
        <div className="absolute bottom-1/2 right-1/3 w-24 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/12 to-transparent transform -rotate-12 hidden xl:block"></div>
        
        {/* Floating decorative dots */}
        <div className="absolute top-16 left-10 w-2.5 h-2.5 bg-[#8B2332]/25 rounded-full hidden md:block"></div>
        <div className="absolute top-24 right-12 w-2 h-2 bg-[#7A7A3F]/25 rounded-full hidden md:block"></div>
        <div className="absolute bottom-20 left-12 w-2 h-2 bg-[#8B2332]/25 rounded-full hidden md:block"></div>
        <div className="absolute bottom-28 right-10 w-2.5 h-2.5 bg-[#7A7A3F]/25 rounded-full hidden md:block"></div>
        <div className="absolute top-1/2 left-1/6 -translate-y-1/2 w-1.5 h-1.5 bg-[#8B2332]/20 rounded-full hidden xl:block"></div>
        <div className="absolute bottom-1/2 right-1/6 translate-y-1/2 w-1.5 h-1.5 bg-[#7A7A3F]/20 rounded-full hidden xl:block"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#8B2332]/20 rounded-full hidden lg:block"></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-[#7A7A3F]/20 rounded-full hidden lg:block"></div>
        
        {/* Circle patterns */}
        <div className="absolute top-1/4 left-0 w-64 h-64 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.25"/>
            <circle cx="100" cy="100" r="65" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.18"/>
            <circle cx="100" cy="100" r="45" fill="none" stroke="#8B2332" strokeWidth="0.6" opacity="0.15"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 right-0 w-60 h-60 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.22"/>
            <circle cx="100" cy="100" r="60" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.18"/>
            <circle cx="100" cy="100" r="40" fill="none" stroke="#7A7A3F" strokeWidth="0.6" opacity="0.15"/>
          </svg>
        </div>
        
        {/* Additional scattered shapes */}
        <div className="absolute top-1/5 right-1/5 w-28 h-28 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="25" y="25" width="50" height="50" rx="5" fill="#8B2332" opacity="0.08" transform="rotate(45 50 50)"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/5 left-1/5 w-24 h-24 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,10 90,50 50,90 10,50" fill="#7A7A3F" opacity="0.08"/>
          </svg>
        </div>
        
        {/* Star-like shapes */}
        <div className="absolute top-1/6 right-1/3 w-20 h-20 opacity-4 hidden lg:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,5 L55,35 L85,40 L60,55 L70,85 L50,65 L30,85 L40,55 L15,40 L45,35 Z" fill="#8B2332" opacity="0.1"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/6 left-1/3 w-18 h-18 opacity-4 hidden lg:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,8 L53,33 L78,38 L58,50 L68,75 L50,60 L32,75 L42,50 L22,38 L47,33 Z" fill="#7A7A3F" opacity="0.1"/>
          </svg>
        </div>
        
        {/* Hexagonal patterns */}
        <div className="absolute top-1/3 left-1/6 w-32 h-32 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.12"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/3 right-1/6 w-30 h-30 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,8 88,30 88,70 50,92 12,70 12,30" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.12"/>
          </svg>
        </div>
        
        {/* Wave patterns */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-32 opacity-5 hidden lg:block">
          <svg viewBox="0 0 800 100" className="w-full h-full">
            <path d="M0,50 Q100,30 200,50 T400,50 T600,50 T800,50" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.15"/>
          </svg>
        </div>
        
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-32 opacity-5 hidden lg:block">
          <svg viewBox="0 0 800 100" className="w-full h-full">
            <path d="M0,50 Q100,70 200,50 T400,50 T600,50 T800,50" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.15"/>
          </svg>
        </div>
        
        {/* Grid pattern accents */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `
            linear-gradient(to right, #8B2332 1px, transparent 1px),
            linear-gradient(to bottom, #8B2332 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
        
        {/* Spiral-like decorative elements */}
        <div className="absolute top-1/4 right-1/6 w-36 h-36 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,50 Q70,30 90,50 Q70,70 50,50" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.1"/>
            <path d="M50,50 Q60,40 70,50 Q60,60 50,50" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.08"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 left-1/6 w-34 h-34 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,50 Q30,70 50,90 Q70,70 50,50" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.1"/>
            <path d="M50,50 Q40,60 50,70 Q60,60 50,50" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.08"/>
          </svg>
        </div>
        
        {/* Organic shapes */}
        <div className="absolute top-1/2 right-1/5 w-40 h-40 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <ellipse cx="50" cy="50" rx="35" ry="25" fill="#8B2332" opacity="0.06" transform="rotate(45 50 50)"/>
            <ellipse cx="50" cy="50" rx="25" ry="18" fill="#7A7A3F" opacity="0.05" transform="rotate(-30 50 50)"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/2 left-1/5 w-38 h-38 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <ellipse cx="50" cy="50" rx="32" ry="22" fill="#7A7A3F" opacity="0.06" transform="rotate(-45 50 50)"/>
            <ellipse cx="50" cy="50" rx="22" ry="16" fill="#8B2332" opacity="0.05" transform="rotate(30 50 50)"/>
          </svg>
        </div>
        
        {/* Corner decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-3 hidden lg:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M0,0 L40,0 L0,40 Z" fill="#8B2332" opacity="0.08"/>
            <path d="M0,0 L30,0 L0,30 Z" fill="#7A7A3F" opacity="0.06"/>
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-3 hidden lg:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M100,100 L60,100 L100,60 Z" fill="#7A7A3F" opacity="0.08"/>
            <path d="M100,100 L70,100 L100,70 Z" fill="#8B2332" opacity="0.06"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="text-center mb-16 md:mb-20 transform transition-all duration-700"
            data-animate-id="features-header"
          >
            <div className={`${isVisible['features-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 dark:from-[#B85C6D]/15 dark:via-[#B85C6D]/20 dark:to-[#B85C6D]/15 text-[#8B2332] dark:text-[#B85C6D] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20 dark:border-[#B85C6D]/20">
                  {features.badgeLabel}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#8B2332] dark:text-[#B85C6D] mb-4 leading-tight">
                {features.title}
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                {features.description}
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {features.items.map((feature, index) => {
              const Icon = ICON_MAP[feature.icon] ?? BookOpenIcon;
              const isMaroon = (feature.color || '#8B2332') === '#8B2332';
              return (
                <div 
                  key={`${feature.title}-${index}`}
                  className="transform transition-all duration-700"
                  data-animate-id={`feature-${index}`}
                >
                  <div className={`text-center bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] border border-gray-100 dark:border-gray-700 group h-full ${
                    isVisible[`feature-${index}`] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
                  }`}>
                    {/* Dotted pattern overlay */}
                    <div className="absolute inset-0 rounded-3xl opacity-[0.02]" style={{
                      backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}></div>
                    
                    <div className="relative z-10">
                      <div className={`w-20 h-20 bg-gradient-to-br ${isMaroon ? 'from-[#8B2332]/20 to-[#8B2332]/10 dark:from-[#B85C6D]/20 dark:to-[#B85C6D]/10 border-[#8B2332]/20 dark:border-[#B85C6D]/20' : 'from-[#7A7A3F]/20 to-[#7A7A3F]/10 dark:from-[#9B9B5F]/20 dark:to-[#9B9B5F]/10 border-[#7A7A3F]/20 dark:border-[#9B9B5F]/20'} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 border`}>
                        <Icon size={36} className={isMaroon ? "text-[#8B2332] dark:text-[#B85C6D]" : "text-[#7A7A3F] dark:text-[#9B9B5F]"} strokeWidth={2.5} />
                      </div>
                      <h3 className={`text-lg md:text-xl font-bold mb-3 transition-colors ${isMaroon ? 'text-[#8B2332] dark:text-[#B85C6D] group-hover:text-[#6B1A28] dark:group-hover:text-[#C96D7E]' : 'text-[#8B2332] dark:text-[#B85C6D]'}`}>
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    
                    {/* Decorative corner */}
                    <div className={`absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{
                      borderColor: `${feature.color || '#8B2332'}33`
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-white dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="currentColor" className="text-gray-50 dark:text-gray-800"/>
          </svg>
        </div>
      </div>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#F7F3EC] via-[#F2EBE1] to-[#EADFD2] dark:from-gray-800 dark:via-gray-900/50 dark:to-gray-800 overflow-hidden transition-colors duration-300">
        {/* Enhanced background graphics */}
        <DottedPattern opacity={0.03} size="32px" />
        <DottedPattern opacity={0.02} size="48px" className="mix-blend-multiply" />
        <GeometricPattern opacity={0.02} />
        <GeometricPattern opacity={0.015} className="rotate-45" />
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#8B2332" />
        <AbstractShape position="bottom" color="#7A7A3F" />
        <AbstractShape position="left" color="#8B2332" />
        <AbstractShape position="right" color="#7A7A3F" />
        
        {/* Additional decorative geometric shapes */}
        <div className="absolute top-1/4 left-1/5 w-52 h-52 opacity-4 hidden lg:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.12"/>
            <polygon points="50,15 85,50 50,85 15,50" fill="#7A7A3F" opacity="0.1"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 right-1/5 w-48 h-48 opacity-4 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,0 Q 80,25 80,60 Q 80,95 50,85 Q 20,95 20,60 Q 20,25 50,0 Z"
              fill="#7A7A3F"
              opacity="0.12"
            />
          </svg>
        </div>
        
        {/* Blur effects for depth */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#8B2332]/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#7A7A3F]/2 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8B2332]/1.5 rounded-full blur-3xl"></div>
        
        {/* Decorative lines */}
        <div className="absolute top-1/2 left-0 w-px h-56 bg-gradient-to-b from-transparent via-[#8B2332]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/2 right-0 w-px h-56 bg-gradient-to-b from-transparent via-[#7A7A3F]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-px bg-gradient-to-r from-transparent via-[#8B2332]/8 to-transparent hidden lg:block"></div>
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-36 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/8 to-transparent hidden lg:block"></div>
        
        {/* Floating decorative dots */}
        <div className="absolute top-16 left-10 w-2.5 h-2.5 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute top-24 right-12 w-2 h-2 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-20 left-12 w-2 h-2 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-28 right-10 w-2.5 h-2.5 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        
        {/* Circle patterns */}
        <div className="absolute top-1/4 left-0 w-56 h-56 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.25"/>
            <circle cx="100" cy="100" r="60" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.18"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 right-0 w-52 h-52 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="75" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.22"/>
            <circle cx="100" cy="100" r="55" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.18"/>
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div 
            className="transform transition-all duration-700"
            data-animate-id="cta-section"
          >
            <div className={`${isVisible['cta-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 dark:from-[#B85C6D]/15 dark:via-[#B85C6D]/20 dark:to-[#B85C6D]/15 text-[#8B2332] dark:text-[#B85C6D] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20 dark:border-[#B85C6D]/20">
                  {cta.badgeLabel}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6 leading-tight text-[#8B2332] dark:text-[#B85C6D]">
                {cta.title}
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                {cta.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  to={cta.primary.href}
                  className="group/btn px-6 py-3 bg-[#8B2332] text-white rounded-full font-semibold hover:bg-[#6B1A28] transition-all inline-flex items-center space-x-2 hover:scale-105 shadow-xl hover:shadow-2xl text-xs md:text-sm"
                >
                  <span>{cta.primary.label}</span>
                  <ArrowRightIcon size={18} className="transform group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to={cta.secondary.href}
                  className="px-6 py-3 border-2 border-[#8B2332] dark:border-[#B85C6D] text-[#8B2332] dark:text-[#B85C6D] rounded-full font-semibold hover:bg-[#8B2332] dark:hover:bg-[#B85C6D] hover:text-white transition-all inline-flex items-center space-x-2 hover:scale-105 shadow-lg hover:shadow-xl text-xs md:text-sm"
                >
                  <span>{cta.secondary.label}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}