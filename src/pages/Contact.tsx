import { useEffect, useState, useRef, memo, useMemo } from 'react';
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon, FacebookIcon, InstagramIcon, YoutubeIcon, SendIcon } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchPageContent } from '../lib/pageContent';
import { resolveMediaUrl } from '../lib/media';
import { getApiBaseUrl } from '../lib/config';

// Fix for default marker icon in React/Webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const SUBJECT_OPTIONS = [
  { value: 'membership', label: 'Membership Inquiry' },
  { value: 'programs', label: 'Programs & Training' },
  { value: 'events', label: 'Events & Conferences' },
  { value: 'partnership', label: 'Partnership Opportunities' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Technical Support' },
] as const;

const CONTACT_FORM_INITIAL_STATE = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export function Contact() {
  const [formData, setFormData] = useState({ ...CONTACT_FORM_INITIAL_STATE });
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [sectionContent, setSectionContent] = useState<Record<string, unknown>>({});
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

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

  // Load CMS content
  useEffect(() => {
    let mounted = true;
    fetchPageContent('contact')
      .then((page) => {
        if (!mounted) return;
        const map: Record<string, unknown> = {};
        page.sections?.forEach((s) => {
          map[s.key] = s.content;
        });
        setSectionContent(map);
      })
      .catch(() => {
        // fallback to defaults
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Initialize map with CMS coordinates
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const mapCfg = sectionContent['contact_map'] as
      | { lat?: string; lng?: string; popup?: string }
      | undefined;
    const lat = Number((mapCfg?.lat ?? '-1.2921').toString());
    const lng = Number((mapCfg?.lng ?? '36.8219').toString());
    const coords: [number, number] = [Number.isFinite(lat) ? lat : -1.2921, Number.isFinite(lng) ? lng : 36.8219];

    const map = L.map(mapContainerRef.current, {
      center: coords,
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
    const marker = L.marker(coords).addTo(map);
    const popupHtml = mapCfg?.popup || '<b>APECK Headquarters</b><br>Nairobi, Kenya';
    marker.bindPopup(popupHtml).openPopup();
    mapRef.current = map;
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [sectionContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingMessage) return;

    setIsSubmittingMessage(true);
    setSubmissionFeedback(null);

    const subjectOption = SUBJECT_OPTIONS.find((option) => option.value === formData.subject);
    const payloadSubject = subjectOption?.label || formData.subject || 'General Inquiry';
    const payload: {
      name: string;
      email: string;
      subject: string;
      message: string;
      phone?: string;
    } = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: payloadSubject,
      message: formData.message.trim(),
    };

    const trimmedPhone = formData.phone.trim();
    if (trimmedPhone) {
      payload.phone = trimmedPhone;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let data: { message?: string } | null = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to send your message. Please try again.');
      }

      setSubmissionFeedback({
        type: 'success',
        message: data?.message || 'Thank you! Your message has been received.',
      });
      setFormData({ ...CONTACT_FORM_INITIAL_STATE });
    } catch (error) {
      setSubmissionFeedback({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Something went wrong while sending your message. Please try again.',
      });
    } finally {
      setIsSubmittingMessage(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (submissionFeedback) {
      setSubmissionFeedback(null);
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const heroContent = sectionContent['contact_hero'] as
    | {
        backgroundImage?: string;
        badgeLabel?: string;
        title?: string;
        description?: string;
      }
    | undefined;
  const heroBackgroundImage = heroContent?.backgroundImage
    ? resolveMediaUrl(heroContent.backgroundImage)
    : 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=75';
  const heroBadgeLabel = heroContent?.badgeLabel?.trim() || 'GET IN TOUCH';
  const heroTitle = heroContent?.title?.trim() || 'Contact Us';
  const heroDescription =
    heroContent?.description?.trim() ||
    'Get in touch with us. We are here to answer your questions and support your ministry';

  return (
    <div className="relative w-full bg-gradient-to-b from-[#FBF7F2] via-[#F5F1EB] to-[#EFE7DE] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] pt-20 overflow-hidden transition-colors duration-300">
      <div
        className="absolute inset-0 opacity-[0.08] dark:hidden pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(139,35,50,0.25) 0, transparent 45%), radial-gradient(circle at 80% 0%, rgba(122,122,63,0.15) 0, transparent 40%), radial-gradient(circle at 50% 80%, rgba(139,35,50,0.12) 0, transparent 50%)',
        }}
      ></div>

      {/* Dark mode background pattern */}
      <div
        className="absolute inset-0 hidden dark:block pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(184,92,109,0.08) 0, transparent 45%), radial-gradient(circle at 80% 0%, rgba(155,155,95,0.06) 0, transparent 40%), radial-gradient(circle at 50% 80%, rgba(184,92,109,0.05) 0, transparent 50%)',
        }}
      ></div>

      <div className="relative z-10">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBackgroundImage})`,
            willChange: 'background-image'
          }}
        ></div>
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B2332]/90 via-[#8B2332]/85 to-[#6B1A28]/90"></div>
        
        {/* Enhanced background graphics */}
        <DottedPattern opacity={0.08} size="32px" />
        <DottedPattern opacity={0.05} size="48px" className="mix-blend-overlay" />
        <GeometricPattern opacity={0.04} />
        <GeometricPattern opacity={0.03} className="rotate-45" />
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#ffffff" />
        <AbstractShape position="bottom" color="#ffffff" />
        <AbstractShape position="left" color="#ffffff" />
        <AbstractShape position="right" color="#ffffff" />
        
        {/* Additional decorative shapes */}
        <div className="absolute top-1/4 left-1/5 w-52 h-52 opacity-4 hidden lg:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#ffffff" opacity="0.12"/>
            <polygon points="50,15 85,50 50,85 15,50" fill="#ffffff" opacity="0.1"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 right-1/5 w-48 h-48 opacity-4 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,0 Q 80,25 80,60 Q 80,95 50,85 Q 20,95 20,60 Q 20,25 50,0 Z"
              fill="#ffffff"
              opacity="0.12"
            />
          </svg>
        </div>
        
        {/* Blur effects */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="transform transition-all duration-700"
            data-animate-id="contact-hero"
          >
            <div className={`${isVisible['contact-hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-white to-transparent dark:bg-[#0f0f10] transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16 text-gray-50 dark:text-gray-800">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Contact Form & Info Section */}
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
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div
              className="transform transition-all duration-700"
              data-animate-id="contact-form"
            >
              <div className={`${isVisible['contact-form'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] rounded-full mb-6 shadow-lg">
                    <SendIcon size={28} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#8B2332] dark:text-[#B85C6D] mb-6">
                    Send Us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B2332] focus:border-[#8B2332] transition-all shadow-sm hover:shadow-md bg-white dark:bg-gray-900/40 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B2332] focus:border-[#8B2332] transition-all shadow-sm hover:shadow-md bg-white dark:bg-gray-900/40 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B2332] focus:border-[#8B2332] transition-all shadow-sm hover:shadow-md bg-white dark:bg-gray-900/40 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                          placeholder="+254 700 000 000"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B2332] focus:border-[#8B2332] transition-all shadow-sm hover:shadow-md bg-white dark:bg-gray-900/40 text-gray-900 dark:text-gray-100"
                      >
                        <option value="">Select a subject</option>
                        {SUBJECT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B2332] focus:border-[#8B2332] transition-all shadow-sm hover:shadow-md resize-none bg-white dark:bg-gray-900/40 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder="Tell us how we can help you..."
                      ></textarea>
                    </div>
                    <div className="space-y-4">
                      <button
                        type="submit"
                        disabled={isSubmittingMessage}
                        className="w-full px-8 py-4 bg-gradient-to-r from-[#8B2332] to-[#6B1A28] text-white rounded-full font-semibold hover:from-[#6B1A28] hover:to-[#8B2332] transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform duration-300 inline-flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        <SendIcon size={20} strokeWidth={2.5} className={isSubmittingMessage ? 'animate-pulse' : ''} />
                        <span>{isSubmittingMessage ? 'Sending...' : 'Send Message'}</span>
                      </button>
                      {submissionFeedback && (
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm ${
                            submissionFeedback.type === 'success'
                              ? 'bg-green-600/10 text-green-100 border border-green-600/40'
                              : 'bg-red-600/10 text-red-100 border border-red-600/40'
                          }`}
                          aria-live="polite"
                        >
                          {submissionFeedback.message}
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div
              className="transform transition-all duration-700"
              data-animate-id="contact-info"
            >
              <div className={`${isVisible['contact-info'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`} style={{ transitionDelay: '200ms' }}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#7A7A3F] to-[#6A6A35] rounded-full mb-6 shadow-lg">
                  <MailIcon size={28} className="text-white" strokeWidth={2.5} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-[#8B2332] dark:text-[#B85C6D] mb-8">
                  Contact Information
                </h2>
                <div className="space-y-6 mb-12">
                  <div
                    className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-100 dark:border-gray-700"
                    data-animate-id="contact-address"
                  >
                    <div className={`${isVisible['contact-address'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700`}>
                      <div className="flex items-start space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                          <MapPinIcon size={24} className="text-white" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">
                            {(sectionContent['contact_info'] as { officeTitle?: string } | undefined)?.officeTitle?.trim() || 'Office Address'}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {((sectionContent['contact_info'] as { officeAddress?: string } | undefined)?.officeAddress || 'APECK Headquarters\nNairobi, Kenya\nP.O. Box 12345-00100')
                              .split('\n')
                              .map((line, i) => (
                                <span key={i}>
                                  {line}
                                  <br />
                                </span>
                              ))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-100 dark:border-gray-700"
                    data-animate-id="contact-phone"
                  >
                    <div className={`${isVisible['contact-phone'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700`} style={{ transitionDelay: '100ms' }}>
                      <div className="flex items-start space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#7A7A3F] to-[#6A6A35] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                          <PhoneIcon size={24} className="text-white" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">
                            Phone Numbers
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {(((sectionContent['contact_info'] as { phones?: Array<{ text?: string }> } | undefined)?.phones) ?? [
                              { text: 'Main Office: +254 700 000 000' },
                              { text: 'Training Dept: +254 700 000 001' },
                              { text: 'Membership: +254 700 000 002' },
                            ]).map((p, i) => (
                              <span key={i}>
                                {p.text}
                                <br />
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-100 dark:border-gray-700"
                    data-animate-id="contact-email"
                  >
                    <div className={`${isVisible['contact-email'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700`} style={{ transitionDelay: '200ms' }}>
                      <div className="flex items-start space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                          <MailIcon size={24} className="text-white" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">
                            Email Addresses
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {(((sectionContent['contact_info'] as { emails?: Array<{ text?: string }> } | undefined)?.emails) ?? [
                              { text: 'General: info@apeck.or.ke' },
                              { text: 'Programs: programs@apeck.or.ke' },
                              { text: 'Membership: membership@apeck.or.ke' },
                            ]).map((e, i) => (
                              <span key={i}>
                                {e.text}
                                <br />
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-100 dark:border-gray-700"
                    data-animate-id="contact-hours"
                  >
                    <div className={`${isVisible['contact-hours'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700`} style={{ transitionDelay: '300ms' }}>
                      <div className="flex items-start space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#7A7A3F] to-[#6A6A35] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                          <ClockIcon size={24} className="text-white" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">
                            {(sectionContent['contact_info'] as { hoursTitle?: string } | undefined)?.hoursTitle?.trim() || 'Office Hours'}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {(((sectionContent['contact_info'] as { hours?: string } | undefined)?.hours || 'Monday - Friday: 8:00 AM - 5:00 PM\nSaturday: 9:00 AM - 1:00 PM\nSunday: Closed')
                              .split('\n')).map((line, i) => (
                              <span key={i}>
                                {line}
                                <br />
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div
                  data-animate-id="social-media"
                  className={`${isVisible['social-media'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700`}
                  style={{ transitionDelay: '400ms' }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-[#8B2332] dark:text-[#B85C6D] mb-6">
                      {((sectionContent['contact_social'] as { title?: string } | undefined)?.title?.trim() || 'Connect With Us')}
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      <a
                        href={((sectionContent['contact_social'] as { facebook?: string } | undefined)?.facebook || '#')}
                        className="w-14 h-14 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] rounded-full flex items-center justify-center text-white hover:from-[#6B1A28] hover:to-[#8B2332] transition-all shadow-lg hover:shadow-xl hover:scale-110 transform duration-300"
                        aria-label="Facebook"
                      >
                        <FacebookIcon size={22} strokeWidth={2.5} />
                      </a>
                      <a
                        href={((sectionContent['contact_social'] as { x?: string } | undefined)?.x || '#')}
                        className="w-14 h-14 bg-gradient-to-br from-[#7A7A3F] to-[#6A6A35] rounded-full flex items-center justify-center text-white hover:from-[#6A6A35] hover:to-[#7A7A3F] transition-all shadow-lg hover:shadow-xl hover:scale-110 transform duration-300"
                        aria-label="X"
                      >
                        <img src="https://img.icons8.com/?size=100&id=fJp7hepMryiw&format=png&color=000000" alt="X" className="w-5 h-5" />
                      </a>
                      <a
                        href={((sectionContent['contact_social'] as { instagram?: string } | undefined)?.instagram || '#')}
                        className="w-14 h-14 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] rounded-full flex items-center justify-center text-white hover:from-[#6B1A28] hover:to-[#8B2332] transition-all shadow-lg hover:shadow-xl hover:scale-110 transform duration-300"
                        aria-label="Instagram"
                      >
                        <InstagramIcon size={22} strokeWidth={2.5} />
                      </a>
                      <a
                        href={((sectionContent['contact_social'] as { youtube?: string } | undefined)?.youtube || '#')}
                        className="w-14 h-14 bg-gradient-to-br from-[#7A7A3F] to-[#6A6A35] rounded-full flex items-center justify-center text-white hover:from-[#6A6A35] hover:to-[#7A7A3F] transition-all shadow-lg hover:shadow-xl hover:scale-110 transform duration-300"
                        aria-label="YouTube"
                      >
                        <YoutubeIcon size={22} strokeWidth={2.5} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#F6F2EA] via-[#F9F6F1] to-transparent dark:bg-[#0f0f10] transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16 text-white dark:text-gray-900">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Map Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#F7F3EC] via-[#F2EBE1] to-[#EADFD2] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] overflow-hidden transition-colors duration-300">
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
        
        {/* Grid pattern accents */}
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="map-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#8B2332" strokeWidth="0.5" opacity="0.08"/>
                <line x1="0" y1="0" x2="10" y2="0" stroke="#8B2332" strokeWidth="0.5" opacity="0.08"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#map-grid)"/>
          </svg>
        </div>
        
        {/* Spiral-like decorative elements */}
        <div className="absolute bottom-1/3 right-1/3 translate-x-1/2 translate-y-1/2 w-36 h-36 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,50 Q60,30 80,30 Q90,30 90,50 Q90,70 70,70 Q50,70 50,50" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.1"/>
            <path d="M50,50 Q40,70 20,70 Q10,70 10,50 Q10,30 30,30 Q50,30 50,50" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.08"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            className="text-center mb-12 md:mb-16 transform transition-all duration-700"
            data-animate-id="map-header"
          >
            <div className={`${isVisible['map-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 text-[#8B2332] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20">
                  LOCATION
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#8B2332] dark:text-[#B85C6D] mb-4 leading-tight">
                Find Us
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                Visit our office in Nairobi
              </p>
            </div>
          </div>
          <div
            className="transform transition-all duration-700"
            data-animate-id="map-container"
          >
            <div className={`${isVisible['map-container'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
              <div className="rounded-3xl overflow-hidden shadow-2xl h-96 md:h-[500px] relative group">
                {/* Map container */}
                <div 
                  ref={mapContainerRef}
                  className="w-full h-full z-0"
                  style={{ minHeight: '384px' }}
                ></div>
                
                {/* Custom corner decorations */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#8B2332]/30 pointer-events-none z-10"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#8B2332]/30 pointer-events-none z-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#8B2332]/30 pointer-events-none z-10"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#8B2332]/30 pointer-events-none z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
