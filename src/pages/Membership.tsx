import { useEffect, useState, useRef, memo, useMemo } from 'react';
import { CheckIcon, UsersIcon, AwardIcon, HeartIcon, BookOpenIcon, ShieldIcon, StarIcon, ArrowRightIcon, XIcon } from 'lucide-react';
import { EnrollForm } from '../components/EnrollForm';
import { fetchPageContent } from '../lib/pageContent';
import { resolveMediaUrl } from '../lib/media';

type IndividualFormState = {
  fullName: string;
  phone: string;
  idNumber: string;
  email: string;
  county: string;
  subCounty: string;
  ward: string;
  diasporaCountry: string;
  mpesaCode: string;
};

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

const PAYSTACK_PUBLIC_KEY =
  ((import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined) ?? '').trim();
const APPLICATION_EMAIL = 'membership@apeck.org'; // TODO: Replace with official intake email
const INDIVIDUAL_REG_FEE = 1050;
const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScI8o9LqnLQDI3TxtEL8BRuhvsfQn-dp2rTZ7cWkoxlQ9nNpQ/viewform';
const initialIndividualForm: IndividualFormState = {
  fullName: '',
  phone: '',
  idNumber: '',
  email: '',
  county: '',
  subCounty: '',
  ward: '',
  diasporaCountry: '',
  mpesaCode: '',
};

export function Membership() {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [isEnrollFormOpen, setIsEnrollFormOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showIndividualModal, setShowIndividualModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [individualForm, setIndividualForm] = useState<IndividualFormState>(initialIndividualForm);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [sectionContent, setSectionContent] = useState<Record<string, unknown>>({});

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
            opacity="0.08"
          />
          <path
            d="M 80,20 Q 130,70 130,120 Q 130,170 80,130 Q 30,130 30,80 Q 30,30 80,20 Z"
            fill={color === '#8B2332' ? '#7A7A3F' : '#8B2332'}
            opacity="0.06"
          />
        </svg>
      </div>
    );
  });
  AbstractShape.displayName = 'AbstractShape';

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const newVisible: { [key: string]: boolean } = {};
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-animate-id');
            if (id) newVisible[id] = true;
            observerRef.current?.unobserve(entry.target);
          }
        });
        setIsVisible((prev) => ({ ...prev, ...newVisible }));
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('[data-animate-id]');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Load Paystack inline script
  useEffect(() => {
    const scriptId = 'paystack-inline';
    if (document.getElementById(scriptId)) return;
    const script = document.createElement('script');
    script.id = scriptId;

    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const resetIndividualForm = () => {
    setIndividualForm(initialIndividualForm);
    setPaymentReference(null);
    setPaymentMessage(null);
    setIsPaying(false);
    setIsSubmittingApplication(false);
  };

  const handleIndividualInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setIndividualForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaystackPayment = () => {
    if (!individualForm.email || !individualForm.phone || !individualForm.fullName) {
      setPaymentMessage('Please fill in your name, phone, and email before initiating payment.');
      return;
    }
    if (!PAYSTACK_PUBLIC_KEY) {
      setPaymentMessage('Payment gateway is not configured. Please contact support.');
      return;
    }
    if (!window.PaystackPop) {
      setPaymentMessage('Payment gateway is loading. Please try again in a moment.');
      return;
    }

    setIsPaying(true);
    setPaymentMessage(null);

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: individualForm.email,
      amount: INDIVIDUAL_REG_FEE * 100, // Paystack accepts amount in base currency minor units
      currency: 'KES',
      reference: `APECK-IND-${Date.now()}`,
      label: individualForm.fullName,
      metadata: {
        custom_fields: [
          { display_name: 'Phone Number', variable_name: 'phone_number', value: individualForm.phone },
        ],
      },
      callback: (response: { reference: string }) => {
        setIsPaying(false);
        setPaymentReference(response.reference);
        setPaymentMessage('Payment verified! Reference: ' + response.reference);
      },
      onClose: () => {
        setIsPaying(false);
        if (!paymentReference) {
          setPaymentMessage('Payment window closed before completion.');
        }
      },
    });

    handler.openIframe();
  };

  const closeIndividualModal = () => {
    setShowIndividualModal(false);
    setSelectedTier(null);
    resetIndividualForm();
  };

  const handleIndividualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentReference) {
      setPaymentMessage('Please complete payment before submitting the application.');
      return;
    }

    setIsSubmittingApplication(true);
    const bodyLines = [
      'New Individual Membership Application',
      '',
      `Payment Reference: ${paymentReference}`,
      `Selected Tier: ${selectedTier ?? 'Individual Member'}`,
      `Full Name: ${individualForm.fullName}`,
      `Phone Number: ${individualForm.phone}`,
      `ID Number: ${individualForm.idNumber}`,
      `Email Address: ${individualForm.email}`,
      `County: ${individualForm.county}`,
      `Sub-County: ${individualForm.subCounty}`,
      `Ward: ${individualForm.ward}`,
      `Diaspora / Country: ${individualForm.diasporaCountry}`,
      `Manual M-Pesa Code (if applicable): ${individualForm.mpesaCode}`,
    ];

    const mailtoLink = `mailto:${APPLICATION_EMAIL}?subject=${encodeURIComponent(
      'APECK Individual Membership Application'
    )}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

    window.location.href = mailtoLink;
    setIsSubmittingApplication(false);
    closeIndividualModal();
  };

  const triggerIndividualApplication = () => {
    resetIndividualForm();
    setSelectedTier('Individual Member');
    setShowIndividualModal(true);
  };

  // --- CMS-backed content placeholders (fallbacks) ---
  // These provide data for the JSX below and prevent reference errors while CMS is being wired.
  const ICONS = {
    award: AwardIcon,
    users: UsersIcon,
    heart: HeartIcon,
    book: BookOpenIcon,
    shield: ShieldIcon,
    star: StarIcon,
  } as const;

  const defaultHero = {
    badgeLabel: 'JOIN APECK',
    title: 'Membership',
    description:
      'Join a community of passionate clergy committed to excellence in ministry and Kingdom impact',
    backgroundImage:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1600&q=75',
    primary: { label: 'Start Your Application', href: '' },
  };
  const hero = useMemo(() => {
    const raw = sectionContent['membership_hero'] as
      | {
          badgeLabel?: string;
          title?: string;
          description?: string;
          backgroundImage?: string;
          primary?: { label?: string; href?: string };
        }
      | undefined;
    return {
      badgeLabel: raw?.badgeLabel?.trim() || defaultHero.badgeLabel,
      title: raw?.title?.trim() || defaultHero.title,
      description: raw?.description?.trim() || defaultHero.description,
      backgroundImage: raw?.backgroundImage
        ? resolveMediaUrl(String(raw.backgroundImage).trim())
        : defaultHero.backgroundImage,
      primary: {
        label: raw?.primary?.label?.trim() || defaultHero.primary.label,
        href: raw?.primary?.href?.trim() || defaultHero.primary.href,
      },
    };
  }, [sectionContent]);

  const defaultBenefits = {
    badgeLabel: 'MEMBERSHIP BENEFITS',
    title: 'Membership Benefits',
    description: 'Why join APECK?',
    items: [
      {
        icon: 'award',
        title: 'Professional Development',
        description:
          'Access to comprehensive training programs, workshops, and seminars for continuous growth',
        color: '#8B2332',
      },
      {
        icon: 'users',
        title: 'Networking Opportunities',
        description:
          'Connect with fellow clergy across Kenya and build meaningful ministry partnerships',
        color: '#7A7A3F',
      },
      {
        icon: 'heart',
        title: 'Pastoral Care',
        description:
          'Receive support, counseling, and mentorship from experienced ministry leaders',
        color: '#8B2332',
      },
      {
        icon: 'shield',
        title: 'Certification',
        description:
          'Official recognition and certification as a member of APECK',
        color: '#7A7A3F',
      },
      {
        icon: 'book',
        title: 'Resource Library',
        description:
          'Access to extensive library of books, materials, and digital resources',
        color: '#8B2332',
      },
      {
        icon: 'star',
        title: 'Annual Conference',
        description:
          'Exclusive access to our annual leadership conference and special events',
        color: '#7A7A3F',
      },
    ] as Array<{ icon: keyof typeof ICONS; title: string; description: string; color: string }>,
  };

  const benefits = useMemo(() => {
    const raw = sectionContent['membership_benefits'] as
      | {
          badgeLabel?: string;
          title?: string;
          description?: string;
          items?: Array<{ title?: string; description?: string; icon?: string; color?: string }>;
        }
      | undefined;

    const items: Array<{ icon: keyof typeof ICONS; title: string; description: string; color: string }> =
      (raw?.items ?? defaultBenefits.items).map((item) => {
        const title = (item?.title ?? '').trim();
        const description = (item?.description ?? '').trim();
        const iconKey = (item?.icon ?? '').toLowerCase().trim();
        const icon = (ICONS[iconKey as keyof typeof ICONS] ? (iconKey as keyof typeof ICONS) : ('award' as keyof typeof ICONS));
        const color = (item?.color ?? '').trim() || '#8B2332';
        return { icon, title, description, color };
      }).filter((i) => i.title && i.description);

    return {
      badgeLabel: raw?.badgeLabel?.trim() || defaultBenefits.badgeLabel,
      title: raw?.title?.trim() || defaultBenefits.title,
      description: raw?.description?.trim() || defaultBenefits.description,
      items: items.length ? items : defaultBenefits.items,
    };
  }, [sectionContent]);

  const defaultTiers = {
    badgeLabel: 'MEMBERSHIP CATEGORIES',
    title: 'Membership Categories',
    description: 'Choose the membership level that fits your ministry',
    items: [
      {
        name: 'Individual Member',
        priceLabel: 'KSh 1,050',
        subtitle: 'For clergy seeking personal support',
        featured: false,
        bullets: [
          'Access to core training programs & webinars',
          'Quarterly ministry insights newsletter',
          'Digital resource library & templates',
          'Access to national clergy networking forum',
        ],
        applyLabel: 'Apply Now',
      },
      {
        name: 'Corporate Membership',
        priceLabel: 'KSh 10,000',
        subtitle: 'For churches & ministry organizations',
        featured: true,
        bullets: [
          'Covers up to 5 designated clergy leaders',
          'Priority booking for onsite training & audits',
          'Custom leadership retreats & mentorship tracks',
          'Discounted exhibition & conference booths',
          'Voting rights & policy participation',
        ],
        applyLabel: 'Apply Now',
      },
      {
        name: 'Housing Corporations',
        priceLabel: 'KSh 5,050',
        subtitle: 'Strategic partners for clergy housing',
        featured: false,
        bullets: [
          'Co-branding on APECK housing initiatives',
          'Direct access to clergy housing cooperative',
          'Pipeline of pre-qualified ministry clients',
          'Invitation to investment forums & expos',
          'Dedicated partnership & compliance support',
        ],
        applyLabel: 'Apply Now',
      },
    ] as Array<{
      name: string;
      priceLabel: string;
      subtitle?: string;
      featured?: boolean;
      bullets: string[];
      applyLabel?: string;
    }>,
  };

  const tiers = useMemo(() => {
    const raw = sectionContent['membership_tiers'] as
      | {
          badgeLabel?: string;
          title?: string;
          description?: string;
          items?: Array<{
            name?: string;
            priceLabel?: string;
            subtitle?: string;
            featured?: boolean;
            bullets?: Array<string | { text?: string }>;
            applyLabel?: string;
          }>;
        }
      | undefined;

    const items =
      (raw?.items ?? defaultTiers.items).map((t) => ({
        name: (t.name ?? '').trim(),
        priceLabel: (t.priceLabel ?? '').trim(),
        subtitle: (t.subtitle ?? '').trim(),
        featured: Boolean(t.featured),
        bullets:
          (t.bullets ?? [])
            .map((b) => (typeof b === 'string' ? b.trim() : (b.text ?? '').trim()))
            .filter(Boolean) || [],
        applyLabel: (t.applyLabel ?? 'Apply Now').trim(),
      })).filter((t) => t.name && t.priceLabel);

    return {
      badgeLabel: raw?.badgeLabel?.trim() || defaultTiers.badgeLabel,
      title: raw?.title?.trim() || defaultTiers.title,
      description: raw?.description?.trim() || defaultTiers.description,
      items: items.length ? items : defaultTiers.items,
    };
  }, [sectionContent]);

  const defaultRequirements = {
    badgeLabel: 'MEMBERSHIP REQUIREMENTS',
    title: 'Membership Requirements',
    description: 'What you need to become a member',
    items: [
      {
        icon: 'heart',
        title: 'Calling to Ministry',
        description: 'Clear evidence of a calling to full-time Christian ministry',
      },
      {
        icon: 'book',
        title: "Doctrinal Statement",
        description: "Agreement with APECK's statement of faith and core beliefs",
      },
      {
        icon: 'award',
        title: 'Ministry Experience',
        description:
          'Active involvement in ministry (requirements vary by membership level)',
      },
      {
        icon: 'users',
        title: 'References',
        description: 'Two pastoral references from recognized ministry leaders',
      },
      {
        icon: 'shield',
        title: 'Application Fee',
        description: 'One-time non-refundable application fee of KSh 1,000',
      },
    ] as Array<{ icon: keyof typeof ICONS; title: string; description: string }>,
  };

  const requirements = useMemo(() => {
    const raw = sectionContent['membership_requirements'] as
      | {
          badgeLabel?: string;
          title?: string;
          description?: string;
          items?: Array<{ title?: string; description?: string; icon?: string }>;
        }
      | undefined;

    const items: Array<{ icon: keyof typeof ICONS; title: string; description: string }> =
      (raw?.items ?? defaultRequirements.items).map((it) => {
        const title = (it?.title ?? '').trim();
        const description = (it?.description ?? '').trim();
        const iconKey = (it?.icon ?? '').toLowerCase().trim();
        const icon = (ICONS[iconKey as keyof typeof ICONS] ? (iconKey as keyof typeof ICONS) : ('heart' as keyof typeof ICONS));
        return { icon, title, description };
      }).filter((r) => r.title && r.description);

    return {
      badgeLabel: raw?.badgeLabel?.trim() || defaultRequirements.badgeLabel,
      title: raw?.title?.trim() || defaultRequirements.title,
      description: raw?.description?.trim() || defaultRequirements.description,
      items: items.length ? items : defaultRequirements.items,
    };
  }, [sectionContent]);

  const defaultCta = {
    badgeLabel: 'GET STARTED',
    title: 'Ready to Join APECK?',
    description:
      'Take the next step in your ministry journey and become part of our community',
    primaryLabel: 'Start Your Application',
  };

  const cta = useMemo(() => {
    const raw = sectionContent['membership_cta'] as
      | {
          badgeLabel?: string;
          title?: string;
          description?: string;
          primaryLabel?: string;
          primary?: { label?: string; href?: string };
        }
      | undefined;

    const primaryLabel =
      raw?.primaryLabel?.trim() ||
      raw?.primary?.label?.trim() ||
      defaultCta.primaryLabel;

    return {
      badgeLabel: raw?.badgeLabel?.trim() || defaultCta.badgeLabel,
      title: raw?.title?.trim() || defaultCta.title,
      description: raw?.description?.trim() || defaultCta.description,
      primaryLabel,
    };
  }, [sectionContent]);
  // --- end placeholders ---

  // Fetch CMS content for membership page
  useEffect(() => {
    let mounted = true;
    fetchPageContent('membership')
      .then((page) => {
        if (!mounted) return;
        const map: Record<string, unknown> = {};
        page.sections?.forEach((s) => {
          map[s.key] = s.content;
        });
        setSectionContent(map);
      })
      .catch(() => {
        // fall back to defaults silently
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="relative w-full bg-gradient-to-b from-[#FBF7F2] via-[#F5F1EB] to-[#EFE7DE] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] pt-20 overflow-hidden transition-colors duration-300">
      <div
        className="absolute inset-0 opacity-[0.08] dark:hidden pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(139,35,50,0.25) 0, transparent 45%), radial-gradient(circle at 80% 0%, rgba(122,122,63,0.15) 0, transparent 40%), radial-gradient(circle at 50% 80%, rgba(139,35,50,0.12) 0, transparent 50%)',
        }}
      ></div>

      <div className="relative z-10">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${hero.backgroundImage})`,
            willChange: 'background-image'
          }}
        ></div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B2332]/85 via-[#8B2332]/80 to-[#6B1A28]/85"></div>
        
        {/* Enhanced background graphics */}
        <DottedPattern opacity={0.08} size="32px" />
        <DottedPattern opacity={0.05} size="48px" />
        <GeometricPattern opacity={0.04} />
        <GeometricPattern opacity={0.025} className="rotate-45" />
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#ffffff" />
        <AbstractShape position="bottom" color="#ffffff" />
        
        {/* Additional floating shapes */}
        <div className="absolute top-1/4 right-1/6 w-48 h-48 opacity-4 hidden lg:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#ffffff" opacity="0.15"/>
            <polygon points="50,18 82,50 50,82 18,50" fill="#ffffff" opacity="0.12"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 left-1/6 w-44 h-44 opacity-4 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.12"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.1"/>
          </svg>
        </div>
        
        {/* Blur effects */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="transform transition-all duration-700"
            data-animate-id="membership-hero"
          >
            <div className={`${isVisible['membership-hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-lg border border-white/20">
                  {hero.badgeLabel}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                {hero.title}
              </h1>
              <p className="text-sm md:text-base text-white/95 max-w-3xl leading-relaxed mb-8">
                {hero.description}
              </p>
              <button
                onClick={triggerIndividualApplication}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-[#8B2332] rounded-full font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <span>{hero.primary.label}</span>
                <ArrowRightIcon size={20} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#FEFAF4] via-[#F6F0E8]/70 to-[#F1E5D9] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="currentColor" className="text-gray-50 dark:text-gray-800"/>
          </svg>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#FEFAF4] via-[#F6F0E8]/70 to-[#F1E5D9] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] overflow-hidden transition-colors duration-300">
        {/* Enhanced background graphics - multiple layers */}
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
        <div className="absolute top-1/4 right-1/5 w-52 h-52 opacity-4 hidden lg:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.12"/>
            <polygon points="50,15 85,50 50,85 15,50" fill="#7A7A3F" opacity="0.1"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 left-1/5 w-48 h-48 opacity-4 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,0 Q 80,25 80,60 Q 80,95 50,85 Q 20,95 20,60 Q 20,25 50,0 Z"
              fill="#7A7A3F"
              opacity="0.12"
            />
          </svg>
        </div>
        
        {/* More floating shapes */}
        <div className="absolute top-1/3 right-1/6 w-36 h-36 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,8 92,50 50,92 8,50" fill="#8B2332" opacity="0.08"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/3 left-1/6 w-32 h-32 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,0 L 100,86.6 L 50,100 L 0,86.6 Z"
              fill="none"
              stroke="#7A7A3F"
              strokeWidth="1.5"
              opacity="0.1"
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
        <div className="absolute top-1/2 left-8 -translate-y-1/2 w-1.5 h-1.5 bg-[#8B2332]/15 rounded-full hidden lg:block"></div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 w-2 h-2 bg-[#7A7A3F]/15 rounded-full hidden lg:block"></div>
        
        {/* Organic shapes */}
        <div className="absolute top-0 left-1/3 -translate-x-1/2 w-72 h-72 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M 100,25 Q 140,45 155,100 Q 140,155 100,135 Q 60,155 45,100 Q 60,45 100,25 Z"
              fill="#8B2332"
              opacity="0.05"
            />
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-1/3 translate-x-1/2 w-68 h-68 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M 55,55 Q 95,20 135,55 Q 180,95 135,135 Q 95,180 55,135 Q 20,95 55,55 Z"
              fill="#7A7A3F"
              opacity="0.06"
            />
          </svg>
        </div>
        
        {/* Corner decorative elements */}
        <div className="absolute top-0 left-0 w-28 h-28 opacity-3 hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="0,0 100,0 50,50" fill="#8B2332" opacity="0.07"/>
            <polygon points="0,0 50,50 0,100" fill="#7A7A3F" opacity="0.05"/>
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-3 hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="100,100 0,100 50,50" fill="#8B2332" opacity="0.07"/>
            <polygon points="100,100 50,50 100,0" fill="#7A7A3F" opacity="0.05"/>
          </svg>
        </div>
        
        {/* Circle patterns */}
        <div className="absolute top-1/4 left-0 w-56 h-56 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.25"/>
            <circle cx="100" cy="100" r="60" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.18"/>
            <circle cx="100" cy="100" r="40" fill="none" stroke="#8B2332" strokeWidth="0.6" opacity="0.12"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 right-0 w-52 h-52 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="75" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.22"/>
            <circle cx="100" cy="100" r="55" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.18"/>
          </svg>
        </div>
        
        {/* Additional scattered shapes */}
        <div className="absolute top-1/6 right-1/4 w-32 h-32 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 75,100 25,100 0,50" fill="#7A7A3F" opacity="0.08"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/6 left-1/4 w-34 h-34 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,12 88,50 50,88 12,50" fill="#8B2332" opacity="0.08"/>
          </svg>
        </div>
        
        {/* Diagonal accent lines */}
        <div className="absolute top-1/2 right-1/4 w-28 h-px bg-gradient-to-r from-transparent via-[#8B2332]/12 to-transparent transform rotate-45 hidden xl:block"></div>
        <div className="absolute bottom-1/3 left-1/4 w-28 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/12 to-transparent transform -rotate-45 hidden xl:block"></div>
        
        {/* Star-like decorative shapes */}
        <div className="absolute top-28 right-1/6 w-18 h-18 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,12 L52,35 L75,35 L58,48 L68,71 L50,58 L32,71 L42,48 L25,35 L48,35 Z" fill="#8B2332" opacity="0.07"/>
          </svg>
        </div>
        
        <div className="absolute bottom-28 left-1/6 w-16 h-16 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,15 L51.5,32 L68,32 L56,42 L63,59 L50,52 L37,59 L44,42 L32,32 L48.5,32 Z" fill="#7A7A3F" opacity="0.08"/>
          </svg>
        </div>
        
        {/* Hexagonal patterns */}
        <div className="absolute top-1/5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25" fill="none" stroke="#8B2332" strokeWidth="1.2" opacity="0.1"/>
            <polygon points="50,16 76.3,32 76.3,68 50,84 23.7,68 23.7,32" fill="#7A7A3F" opacity="0.05"/>
          </svg>
        </div>
        
        {/* Wave patterns */}
        <div className="absolute top-0 left-1/4 w-56 h-28 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,50 Q25,35 50,50 T100,50 T150,50 T200,50" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.07"/>
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-1/4 w-56 h-28 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,50 Q25,65 50,50 T100,50 T150,50 T200,50" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.07"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="text-center mb-16 md:mb-20 transform transition-all duration-700"
            data-animate-id="benefits-header"
          >
            <div className={`${isVisible['benefits-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 dark:from-[#B85C6D]/15 dark:via-[#B85C6D]/20 dark:to-[#B85C6D]/15 text-[#8B2332] dark:text-[#B85C6D] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20 dark:border-[#B85C6D]/20">
                  {benefits.badgeLabel}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#8B2332] dark:text-[#B85C6D] mb-4 leading-tight">
                {benefits.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                {benefits.description}
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {benefits.items.map((benefit, idx) => {
              const Icon = ICONS[benefit.icon] ?? AwardIcon;
              const isMaroon = benefit.color === '#8B2332';
              return (
                <div 
                  key={`${benefit.title}-${idx}`}
                  className="transform transition-all duration-700"
                  data-animate-id={`benefit-${idx}`}
                >
                  <div className={`bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] border border-gray-100 dark:border-gray-700 group h-full ${
                    isVisible[`benefit-${idx}`] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
                  }`}>
                    {/* Dotted pattern overlay */}
                    <div className="absolute inset-0 rounded-3xl opacity-[0.02]" style={{
                      backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}></div>
                    
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                      background: `linear-gradient(to bottom right, transparent, ${benefit.color === '#8B2332' ? 'rgba(139, 34, 50, 0.05)' : 'rgba(122, 122, 63, 0.05)'})`
                    }}></div>
                    
                    <div className="relative z-10">
                      <div className={`w-20 h-20 bg-gradient-to-br ${isMaroon ? 'from-[#8B2332]/20 to-[#8B2332]/10 dark:from-[#B85C6D]/20 dark:to-[#B85C6D]/10 border-[#8B2332]/20 dark:border-[#B85C6D]/20' : 'from-[#7A7A3F]/20 to-[#7A7A3F]/10 dark:from-[#9B9B5F]/20 dark:to-[#9B9B5F]/10 border-[#7A7A3F]/20 dark:border-[#9B9B5F]/20'} rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 border`}>
                        <Icon size={36} className={isMaroon ? "text-[#8B2332] dark:text-[#B85C6D]" : "text-[#7A7A3F] dark:text-[#9B9B5F]"} strokeWidth={2.5} />
                      </div>
                      <h3 className={`text-xl md:text-2xl font-bold mb-3 transition-colors ${isMaroon ? 'text-[#8B2332] dark:text-[#B85C6D] group-hover:text-[#6B1A28] dark:group-hover:text-[#C96D7E]' : 'text-[#8B2332] dark:text-[#B85C6D]'}`}>
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                    
                    {/* Decorative corners */}
                    <div className={`absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{
                      borderColor: `${benefit.color}33`
                    }}></div>
                    <div className={`absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{
                      borderColor: `${benefit.color === '#8B2332' ? '#7A7A3F' : '#8B2332'}33`
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

      {/* Membership Tiers */}
      <section className="relative py-20 md:py-32 bg-gray-50 dark:bg-gray-800 overflow-hidden transition-colors duration-300">
        {/* Enhanced background graphics - multiple layers */}
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
        <div className="absolute top-1/4 left-1/4 w-48 h-48 opacity-4 hidden lg:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.12"/>
            <polygon points="50,18 82,50 50,82 18,50" fill="#7A7A3F" opacity="0.1"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 right-1/4 w-44 h-44 opacity-4 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,0 Q 75,20 75,50 Q 75,80 50,75 Q 25,80 25,50 Q 25,20 50,0 Z"
              fill="#7A7A3F"
              opacity="0.12"
            />
          </svg>
        </div>
        
        {/* More floating shapes */}
        <div className="absolute top-1/3 right-1/5 w-36 h-36 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,8 92,50 50,92 8,50" fill="#8B2332" opacity="0.08"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/3 left-1/5 w-32 h-32 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,0 L 100,86.6 L 50,100 L 0,86.6 Z"
              fill="none"
              stroke="#7A7A3F"
              strokeWidth="1.5"
              opacity="0.1"
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
        <div className="absolute top-1/2 left-8 -translate-y-1/2 w-1.5 h-1.5 bg-[#8B2332]/15 rounded-full hidden lg:block"></div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 w-2 h-2 bg-[#7A7A3F]/15 rounded-full hidden lg:block"></div>
        
        {/* Organic shapes */}
        <div className="absolute top-0 left-1/3 -translate-x-1/2 w-72 h-72 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M 100,25 Q 140,45 155,100 Q 140,155 100,135 Q 60,155 45,100 Q 60,45 100,25 Z"
              fill="#8B2332"
              opacity="0.05"
            />
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-1/3 translate-x-1/2 w-68 h-68 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M 55,55 Q 95,20 135,55 Q 180,95 135,135 Q 95,180 55,135 Q 20,95 55,55 Z"
              fill="#7A7A3F"
              opacity="0.06"
            />
          </svg>
        </div>
        
        {/* Corner decorative elements */}
        <div className="absolute top-0 left-0 w-28 h-28 opacity-3 hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="0,0 100,0 50,50" fill="#8B2332" opacity="0.07"/>
            <polygon points="0,0 50,50 0,100" fill="#7A7A3F" opacity="0.05"/>
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-3 hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="100,100 0,100 50,50" fill="#8B2332" opacity="0.07"/>
            <polygon points="100,100 50,50 100,0" fill="#7A7A3F" opacity="0.05"/>
          </svg>
        </div>
        
        {/* Circle patterns */}
        <div className="absolute top-1/4 left-0 w-56 h-56 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.25"/>
            <circle cx="100" cy="100" r="60" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.18"/>
            <circle cx="100" cy="100" r="40" fill="none" stroke="#8B2332" strokeWidth="0.6" opacity="0.12"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 right-0 w-52 h-52 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="75" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.22"/>
            <circle cx="100" cy="100" r="55" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.18"/>
          </svg>
        </div>
        
        {/* Additional scattered shapes */}
        <div className="absolute top-1/6 right-1/4 w-32 h-32 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 75,100 25,100 0,50" fill="#7A7A3F" opacity="0.08"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/6 left-1/4 w-34 h-34 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,12 88,50 50,88 12,50" fill="#8B2332" opacity="0.08"/>
          </svg>
        </div>
        
        {/* Diagonal accent lines */}
        <div className="absolute top-1/2 right-1/4 w-28 h-px bg-gradient-to-r from-transparent via-[#8B2332]/12 to-transparent transform rotate-45 hidden xl:block"></div>
        <div className="absolute bottom-1/3 left-1/4 w-28 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/12 to-transparent transform -rotate-45 hidden xl:block"></div>
        
        {/* Star-like decorative shapes */}
        <div className="absolute top-28 right-1/6 w-18 h-18 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,12 L52,35 L75,35 L58,48 L68,71 L50,58 L32,71 L42,48 L25,35 L48,35 Z" fill="#8B2332" opacity="0.07"/>
          </svg>
        </div>
        
        <div className="absolute bottom-28 left-1/6 w-16 h-16 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,15 L51.5,32 L68,32 L56,42 L63,59 L50,52 L37,59 L44,42 L32,32 L48.5,32 Z" fill="#7A7A3F" opacity="0.08"/>
          </svg>
        </div>
        
        {/* Hexagonal patterns */}
        <div className="absolute top-1/5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25" fill="none" stroke="#8B2332" strokeWidth="1.2" opacity="0.1"/>
            <polygon points="50,16 76.3,32 76.3,68 50,84 23.7,68 23.7,32" fill="#7A7A3F" opacity="0.05"/>
          </svg>
        </div>
        
        {/* Wave patterns */}
        <div className="absolute top-0 left-1/4 w-56 h-28 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,50 Q25,35 50,50 T100,50 T150,50 T200,50" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.07"/>
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-1/4 w-56 h-28 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,50 Q25,65 50,50 T100,50 T150,50 T200,50" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.07"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="text-center mb-16 md:mb-20 transform transition-all duration-700"
            data-animate-id="tiers-header"
          >
            <div className={`${isVisible['tiers-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 dark:from-[#B85C6D]/15 dark:via-[#B85C6D]/20 dark:to-[#B85C6D]/15 text-[#8B2332] dark:text-[#B85C6D] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20 dark:border-[#B85C6D]/20">
                  {tiers.badgeLabel}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#8B2332] dark:text-[#B85C6D] mb-4 leading-tight">
                {tiers.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                {tiers.description}
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {tiers.items.map((tier, index) => {
              const isFeatured = !!tier.featured;
              const isIndividualTier = tier.name.toLowerCase().includes('individual');
              const headerClasses = isFeatured
                ? 'bg-gradient-to-br from-[#8B2332] to-[#6B1A28]'
                : index % 2 === 0
                ? 'bg-gradient-to-br from-gray-600 to-gray-700'
                : 'bg-gradient-to-br from-[#7A7A3F] to-[#6A6A35]';
              return (
                <div 
                  key={`${tier.name}-${index}`}
                  className="transform transition-all duration-700"
                  data-animate-id={`tier-${index+1}`}
                >
                  <div className={`bg-white dark:bg-gray-800 rounded-3xl ${isFeatured ? 'shadow-2xl hover:shadow-3xl border-4 border-[#8B2332] dark:border-[#B85C6D]' : 'shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-700'} group transition-all duration-500 transform hover:-translate-y-2 h-full ${isVisible[`tier-${index+1}`] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
                    {isFeatured && (
                      <div className="absolute top-6 right-6 bg-gradient-to-r from-[#7A7A3F] to-[#8B2332] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-20">
                        POPULAR
                      </div>
                    )}
                    <div className={`${headerClasses} text-white p-8 text-center relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                      }}></div>
                      <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">{tier.name}</h3>
                        {tier.subtitle ? <p className="text-white/80 mb-4">{tier.subtitle}</p> : null}
                        <div className="text-2xl md:text-3xl font-bold mb-1">{tier.priceLabel}</div>
                      </div>
                    </div>
                    <div className="p-8">
                      {tier.bullets?.length ? (
                        <ul className="space-y-4 mb-8">
                          {tier.bullets.map((b, i) => (
                            <li key={i} className="flex items-start space-x-3">
                              <CheckIcon size={20} className={`${isFeatured ? 'text-[#8B2332] dark:text-[#B85C6D]' : 'text-[#7A7A3F] dark:text-[#9B9B5F]'} mt-0.5 flex-shrink-0`} strokeWidth={2.5} />
                              <span className="text-gray-700 dark:text-gray-300">{b}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <button 
                        onClick={() => {
                          if (isIndividualTier) {
                            triggerIndividualApplication();
                            return;
                          }
                          setSelectedTier(tier.name);
                          setIsEnrollFormOpen(true);
                        }}
                        className={`w-full px-6 py-3 ${isFeatured ? 'bg-[#8B2332] hover:bg-[#6B1A28]' : 'bg-gray-600 hover:bg-gray-700'} text-white rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-105`}
                      >
                        {isIndividualTier ? 'Apply & Pay' : tier.applyLabel || 'Apply Now'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-gray-50 dark:bg-[#0f0f10] transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="currentColor" className="text-white dark:text-gray-800"/>
          </svg>
        </div>
      </div>

      {/* Requirements */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#FEFAF4] via-[#F6F0E8]/70 to-[#F1E5D9] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] overflow-hidden transition-colors duration-300">
        {/* Enhanced background graphics - multiple layers */}
        <DottedPattern opacity={0.03} size="32px" />
        <DottedPattern opacity={0.02} size="48px" className="mix-blend-multiply" />
        <GeometricPattern opacity={0.02} />
        <GeometricPattern opacity={0.015} className="rotate-45" />
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#8B2332" />
        <AbstractShape position="bottom" color="#7A7A3F" />
        
        {/* Additional decorative geometric shapes */}
        <div className="absolute top-1/4 right-1/5 w-44 h-44 opacity-4 hidden lg:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.12"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 left-1/5 w-40 h-40 opacity-4 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#7A7A3F" strokeWidth="2" opacity="0.12"/>
          </svg>
        </div>
        
        {/* Blur effects for depth */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#8B2332]/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#7A7A3F]/2 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#8B2332]/1.5 rounded-full blur-3xl"></div>
        
        {/* Decorative lines */}
        <div className="absolute top-1/2 left-0 w-px h-48 bg-gradient-to-b from-transparent via-[#8B2332]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/2 right-0 w-px h-48 bg-gradient-to-b from-transparent via-[#7A7A3F]/10 to-transparent hidden lg:block"></div>
        
        {/* Floating decorative dots */}
        <div className="absolute top-16 left-8 w-2 h-2 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute top-24 right-10 w-1.5 h-1.5 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-16 left-10 w-2 h-2 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-24 right-8 w-1.5 h-1.5 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        
        {/* Circle patterns */}
        <div className="absolute top-1/4 left-0 w-48 h-48 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="70" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.2"/>
            <circle cx="100" cy="100" r="50" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.15"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 right-0 w-44 h-44 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="65" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.18"/>
            <circle cx="100" cy="100" r="45" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.15"/>
          </svg>
        </div>
        
        {/* Diagonal accent lines */}
        <div className="absolute top-1/3 right-1/4 w-24 h-px bg-gradient-to-r from-transparent via-[#8B2332]/10 to-transparent transform rotate-45 hidden xl:block"></div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/10 to-transparent transform -rotate-45 hidden xl:block"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="text-center mb-12 md:mb-16 transform transition-all duration-700"
            data-animate-id="requirements-header"
          >
            <div className={`${isVisible['requirements-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 dark:from-[#B85C6D]/15 dark:via-[#B85C6D]/20 dark:to-[#B85C6D]/15 text-[#8B2332] dark:text-[#B85C6D] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20 dark:border-[#B85C6D]/20">
                  {requirements.badgeLabel}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#8B2332] dark:text-[#B85C6D] mb-4 leading-tight">
                {requirements.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                {requirements.description}
              </p>
            </div>
          </div>
          <div 
            className="transform transition-all duration-700"
            data-animate-id="requirements-content"
          >
            <div className={`bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 md:p-12 ${
              isVisible['requirements-content'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              {/* Dotted pattern overlay */}
              <div className="absolute inset-0 rounded-3xl opacity-[0.02]" style={{
                backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}></div>
              
              <ul className="space-y-6 relative z-10">
                {requirements.items.map((req, index) => {
                  const Icon = ICONS[req.icon] ?? HeartIcon;
                  return (
                    <li key={`${req.title}-${index}`} className="flex items-start space-x-4 group">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#8B2332]/20 to-[#8B2332]/10 dark:from-[#B85C6D]/20 dark:to-[#B85C6D]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-[#8B2332]/20 dark:border-[#B85C6D]/20">
                        <Icon size={24} className="text-[#8B2332] dark:text-[#B85C6D]" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-[#8B2332] dark:text-[#B85C6D] mb-2 group-hover:text-[#6B1A28] dark:group-hover:text-[#C96D7E] transition-colors">
                          {req.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {req.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-white dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="currentColor" className="text-[#FAF9F7] dark:text-gray-800"/>
          </svg>
        </div>
      </div>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#F7F3EC] via-[#F2EBE1] to-[#EADFD2] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] overflow-hidden transition-colors duration-300">
        {/* Enhanced background graphics */}
        <DottedPattern opacity={0.03} size="32px" />
        <DottedPattern opacity={0.02} size="48px" className="mix-blend-multiply" />
        <GeometricPattern opacity={0.02} />
        <GeometricPattern opacity={0.015} className="rotate-45" />
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#8B2332" />
        <AbstractShape position="bottom" color="#7A7A3F" />
        
        {/* Additional decorative geometric shapes */}
        <div className="absolute top-1/4 right-1/5 w-44 h-44 opacity-4 hidden lg:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.12"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 left-1/5 w-40 h-40 opacity-4 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#7A7A3F" strokeWidth="2" opacity="0.12"/>
          </svg>
        </div>
        
        {/* Blur effects for depth */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#8B2332]/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#7A7A3F]/2 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#8B2332]/1.5 rounded-full blur-3xl"></div>
        
        {/* Decorative lines */}
        <div className="absolute top-1/2 left-0 w-px h-48 bg-gradient-to-b from-transparent via-[#8B2332]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/2 right-0 w-px h-48 bg-gradient-to-b from-transparent via-[#7A7A3F]/10 to-transparent hidden lg:block"></div>
        
        {/* Floating decorative dots */}
        <div className="absolute top-16 left-8 w-2 h-2 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute top-24 right-10 w-1.5 h-1.5 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-16 left-10 w-2 h-2 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-24 right-8 w-1.5 h-1.5 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        
        {/* Circle patterns */}
        <div className="absolute top-1/4 left-0 w-48 h-48 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="70" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.2"/>
            <circle cx="100" cy="100" r="50" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.15"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 right-0 w-44 h-44 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="65" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.18"/>
            <circle cx="100" cy="100" r="45" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.15"/>
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
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-[#8B2332] dark:text-[#B85C6D]">
                {cta.title}
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                {cta.description}
              </p>
              <button
                onClick={() => setIsEnrollFormOpen(true)}
                className="group/btn px-8 py-4 bg-[#8B2332] text-white rounded-full font-semibold hover:bg-[#6B1A28] transition-all inline-flex items-center space-x-2 hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <span>{cta.primaryLabel}</span>
                <ArrowRightIcon size={20} className="transform group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {showIndividualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10">
          <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-y-auto max-h-full">
            <div className="flex justify-between items-start p-6 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="text-2xl font-bold text-[#8B2332] dark:text-[#B85C6D]">
                  Individual Member Application
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Fill in the details below, make your payment, and we will receive your application instantly.
                  Prefer Google Forms?{' '}
                  <a
                    href={GOOGLE_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8B2332] underline font-semibold"
                  >
                    Open the official form
                  </a>
                </p>
              </div>
              <button
                onClick={closeIndividualModal}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close individual member application form"
              >
                <XIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleIndividualSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { label: 'Full Name *', name: 'fullName', type: 'text', required: true },
                  { label: 'Phone Number *', name: 'phone', type: 'tel', required: true },
                  { label: 'ID Number *', name: 'idNumber', type: 'text', required: true },
                  { label: 'Email Address *', name: 'email', type: 'email', required: true },
                  { label: 'County *', name: 'county', type: 'text', required: true },
                  { label: 'Sub-County *', name: 'subCounty', type: 'text', required: true },
                  { label: 'Ward *', name: 'ward', type: 'text', required: true },
                  { label: 'Diaspora / Country (if outside Kenya)', name: 'diasporaCountry', type: 'text', required: false },
                ].map((field) => (
                  <label key={field.name} className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {field.label}
                    <input
                      type={field.type}
                      name={field.name}
                      value={individualForm[field.name as keyof IndividualFormState]}
                      onChange={handleIndividualInputChange}
                      required={field.required}
                      className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                    />
                  </label>
                ))}
              </div>

              <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                Manual M-Pesa Code (if you already paid via Paybill 400222 / Account 9859474#)
                <input
                  type="text"
                  name="mpesaCode"
                  value={individualForm.mpesaCode}
                  onChange={handleIndividualInputChange}
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                />
              </label>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/40 text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Payment Instructions</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Registration fee: <span className="font-bold">KSh 1,050</span></li>
                  <li>Pay with Paystack (MPesa, card, bank) or use Paybill <strong>400222</strong> / Account <strong>9859474#</strong> (PECK Housing Cooperative Society Ltd).</li>
                  <li>Keep the confirmation code; we will verify it alongside the Paystack reference.</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <button
                  type="button"
                  onClick={handlePaystackPayment}
                  disabled={isPaying}
                  className="px-5 py-3 rounded-full bg-[#8B2332] text-white font-semibold hover:bg-[#6B1A28] transition-all shadow-lg disabled:opacity-60"
                >
                  {isPaying ? 'Processing Payment...' : 'Pay with Paystack'}
                </button>
                {paymentReference && (
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    Payment verified: {paymentReference}
                  </span>
                )}
                {paymentMessage && (
                  <span className="text-sm text-gray-600 dark:text-gray-300">{paymentMessage}</span>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={closeIndividualModal}
                  className="px-5 py-3 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!paymentReference || isSubmittingApplication}
                  className="px-6 py-3 rounded-full bg-[#7A7A3F] text-white font-semibold shadow-lg hover:shadow-xl hover:bg-[#6A6A35] transition-all disabled:opacity-60"
                >
                  {isSubmittingApplication ? 'Sending...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enrollment Form Modal */}
      <EnrollForm 
        isOpen={isEnrollFormOpen}
        onClose={() => {
          setIsEnrollFormOpen(false);
          setSelectedTier(null);
        }}
        programName={selectedTier ? `${selectedTier} - APECK Membership` : undefined}
      />
      </div>
    </div>
  );
}
