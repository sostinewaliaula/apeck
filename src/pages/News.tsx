import { useEffect, useState, useRef, memo, useMemo } from 'react';
import { CalendarIcon, MapPinIcon, ClockIcon, ArrowRightIcon, BellIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EnrollForm } from '../components/EnrollForm';

// Helper function to create URL-friendly slug from title
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export function News() {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{ name: string; type: 'register' | 'enroll' } | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

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

  // Available images 4-9 - shuffled randomly
  const availableImages = ['/assets/image4.jpg', '/assets/image5.jpg', '/assets/image6.jpg', '/assets/image7.jpg', '/assets/image8.jpg', '/assets/image9.jpg'];
  
  // Function to get random image from available images
  const getRandomImage = () => {
    return availableImages[Math.floor(Math.random() * availableImages.length)];
  };
  
  const newsItems = [
    {
      id: 1,
      slug: 'annual-leadership-conference-2024',
      image: getRandomImage(),
      date: 'December 15, 2024',
      title: 'Annual Leadership Conference 2024',
      description: 'Join us for three days of powerful teaching, networking, and spiritual renewal at our flagship annual conference. Over 500 clergy leaders expected to attend.',
      category: 'Conference'
    },
    {
      id: 2,
      slug: 'new-pastoral-care-certification-program',
      image: getRandomImage(),
      date: 'December 10, 2024',
      title: 'New Pastoral Care Certification Program',
      description: 'We are excited to announce the launch of our comprehensive pastoral care and counseling certification program, starting January 2025.',
      category: 'Program'
    },
    {
      id: 3,
      slug: 'community-outreach-initiative-success',
      image: getRandomImage(),
      date: 'December 5, 2024',
      title: 'Community Outreach Initiative Success',
      description: 'Over 5,000 families reached through our latest humanitarian initiative across 10 counties. Thank you to all participating churches.',
      category: 'Outreach'
    },
    {
      id: 4,
      slug: 'leadership-workshop-series-announced',
      image: getRandomImage(),
      date: 'November 28, 2024',
      title: 'Leadership Workshop Series Announced',
      description: 'Monthly leadership development workshops starting in January. Register now to secure your spot in this transformative series.',
      category: 'Workshop'
    },
    {
      id: 5,
      slug: 'youth-ministry-training-success',
      image: getRandomImage(),
      date: 'November 20, 2024',
      title: 'Youth Ministry Training Success',
      description: 'Over 200 youth leaders completed our intensive youth ministry training program. Graduation ceremony held in Nairobi.',
      category: 'Training'
    },
    {
      id: 6,
      slug: 'new-regional-chapters-launched',
      image: getRandomImage(),
      date: 'November 15, 2024',
      title: 'New Regional Chapters Launched',
      description: 'APECK expands with three new regional chapters in Western, Coast, and Rift Valley regions to better serve our members.',
      category: 'Announcement'
    }
  ];

  const events = [
    {
      id: 1,
      date: '15',
      month: 'DEC',
      year: '2024',
      title: 'Annual Leadership Conference',
      time: '8:00 AM - 5:00 PM',
      location: 'KICC, Nairobi',
      description: 'Three days of powerful teaching, workshops, and networking. Featured speakers include renowned ministry leaders from across Africa.',
      color: '#8B2332'
    },
    {
      id: 2,
      date: '20',
      month: 'JAN',
      year: '2025',
      title: 'Pastoral Care Certification Program Begins',
      time: '9:00 AM - 4:00 PM',
      location: 'APECK Training Center',
      description: 'Comprehensive 6-month certification program in pastoral care and biblical counseling. Limited spots available.',
      color: '#7A7A3F'
    },
    {
      id: 3,
      date: '10',
      month: 'FEB',
      year: '2025',
      title: 'Regional Leaders Summit - Western',
      time: '9:00 AM - 3:00 PM',
      location: 'Kisumu',
      description: 'Regional gathering for clergy leaders in Western Kenya. Focus on church growth and community impact.',
      color: '#8B2332'
    }
  ];

  return (
    <div className="relative w-full bg-gradient-to-b from-[#FBF7F2] via-[#F5F1EB] to-[#EFE7DE] dark:bg-gray-900 pt-20 overflow-hidden transition-colors duration-300">
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
            backgroundImage: 'url(/assets/image9.jpg)',
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
            data-animate-id="news-hero"
          >
            <div className={`${isVisible['news-hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-lg border border-white/20">
                  NEWS & EVENTS
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                News & Events
              </h1>
              <p className="text-sm md:text-base text-white/95 max-w-3xl leading-relaxed">
            Stay updated with the latest news, events, and activities from APECK
          </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-white dark:bg-gray-900">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16 text-gray-50 dark:text-gray-800">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Upcoming Events */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#FEFAF4] via-[#F6F0E8]/70 to-[#F1E5D9] dark:bg-gray-900 overflow-hidden transition-colors duration-300">
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
          <div 
            className="text-center mb-16 md:mb-20 transform transition-all duration-700"
            data-animate-id="events-header"
          >
            <div className={`${isVisible['events-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 dark:from-[#B85C6D]/15 dark:via-[#B85C6D]/20 dark:to-[#B85C6D]/15 text-[#8B2332] dark:text-[#B85C6D] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20 dark:border-[#B85C6D]/20">
                  UPCOMING EVENTS
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#8B2332] dark:text-[#B85C6D] mb-4 leading-tight">
                Upcoming Events
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                Mark your calendar for these important dates
              </p>
            </div>
                </div>
          <div className="space-y-6 md:space-y-8">
            {events.map((event, index) => {
              const isMaroon = event.color === '#8B2332';
              return (
                <div 
                  key={event.id}
                  className="transform transition-all duration-700"
                  data-animate-id={`event-${index}`}
                >
                  <div className={`bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 group transition-all duration-500 transform hover:-translate-y-2 ${
                    isVisible[`event-${index}`] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
                  }`}>
                    <div className="md:flex">
                      {/* Date Section */}
                      <div className={`md:w-56 bg-gradient-to-br ${isMaroon ? 'from-[#8B2332] to-[#6B1A28]' : 'from-[#7A7A3F] to-[#6A6A35]'} text-white p-8 md:p-10 flex flex-col items-center justify-center relative overflow-hidden`}>
                        {/* Decorative pattern */}
                        <div className="absolute inset-0 opacity-10" style={{
                          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                          backgroundSize: '20px 20px',
                        }}></div>
                        <div className="relative z-10">
                          <div className="text-3xl md:text-4xl font-bold mb-2">{event.date}</div>
                          <div className="text-xl md:text-2xl font-semibold mb-1">{event.month}</div>
                          <div className="text-sm opacity-80">{event.year}</div>
              </div>
            </div>
                      
                      {/* Content Section */}
                      <div className="p-8 md:p-10 flex-1">
                        <h3 className="text-2xl md:text-3xl font-bold text-[#8B2332] dark:text-[#B85C6D] mb-4 group-hover:text-[#6B1A28] transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 md:gap-6 mb-5">
                          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <ClockIcon size={18} className="text-[#8B2332] dark:text-[#B85C6D]" strokeWidth={2.5} />
                            <span className="font-medium">{event.time}</span>
                </div>
                          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <MapPinIcon size={18} className="text-[#7A7A3F] dark:text-[#9B9B5F]" strokeWidth={2.5} />
                            <span className="font-medium">{event.location}</span>
              </div>
            </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                          {event.description}
                        </p>
                        <button 
                          onClick={() => {
                            setSelectedEvent({
                              name: event.title,
                              type: index === 1 ? 'enroll' : 'register'
                            });
                            setIsFormOpen(true);
                          }}
                          className={`px-5 py-2.5 ${isMaroon ? 'bg-[#8B2332] hover:bg-[#6B1A28]' : 'bg-[#7A7A3F] hover:bg-[#6A6A35]'} text-white rounded-full font-semibold text-xs md:text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105`}
                        >
                          {index === 1 ? 'Enroll Now' : 'Register Now'}
                </button>
              </div>
            </div>
                    
                    {/* Accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8B2332] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16 text-white dark:text-gray-900">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Featured News */}
      <section className="relative py-20 md:py-32 bg-white dark:bg-gray-900 overflow-hidden">
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
            data-animate-id="news-header"
          >
            <div className={`${isVisible['news-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 dark:from-[#B85C6D]/15 dark:via-[#B85C6D]/20 dark:to-[#B85C6D]/15 text-[#8B2332] dark:text-[#B85C6D] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20 dark:border-[#B85C6D]/20">
                  LATEST NEWS
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#8B2332] dark:text-[#B85C6D] mb-4 leading-tight">
                Latest News
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                Recent updates and announcements
              </p>
            </div>
                </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {newsItems.map((item, index) => (
              <div 
                key={item.id}
                className="transform transition-all duration-700"
                data-animate-id={`news-${index}`}
              >
                <div className={`bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] border border-gray-100 dark:border-gray-700 group ${
                  isVisible[`news-${index}`] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
                }`}>
                  {/* Image Container */}
                  <div className="relative h-64 md:h-72 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      style={{ willChange: 'transform' }}
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm text-[#8B2332] dark:text-[#B85C6D] rounded-full text-xs font-bold uppercase tracking-wide">
                      {item.category}
                    </div>
                    
                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-white/20 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 md:p-8">
                    <div className="flex items-center space-x-2 text-sm text-[#7A7A3F] dark:text-[#9B9B5F] font-semibold mb-4">
                      <CalendarIcon size={16} className="text-[#8B2332] dark:text-[#B85C6D]" strokeWidth={2.5} />
                      <span>{item.date}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-[#8B2332] dark:text-[#B85C6D] mb-3 group-hover:text-[#6B1A28] transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                    <Link 
                      to={`/news/${item.slug}`}
                      className="text-[#8B2332] dark:text-[#B85C6D] font-semibold hover:text-[#7A7A3F] dark:hover:text-[#9B9B5F] transition-colors inline-flex items-center space-x-2 group/btn"
                    >
                      <span>Read More</span>
                      <ArrowRightIcon size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  
                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B2332] via-[#7A7A3F] to-[#8B2332] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-white dark:bg-gray-900">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16 text-gray-50 dark:text-gray-800">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#F7F3EC] via-[#F2EBE1] to-[#EADFD2] dark:from-gray-800 dark:via-gray-900/50 dark:to-gray-800 overflow-hidden transition-colors duration-300">
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
              <pattern id="newsletter-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#8B2332" strokeWidth="0.5" opacity="0.08"/>
                <line x1="0" y1="0" x2="10" y2="0" stroke="#8B2332" strokeWidth="0.5" opacity="0.08"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#newsletter-grid)"/>
          </svg>
        </div>
        
        {/* Spiral-like decorative elements */}
        <div className="absolute bottom-1/3 right-1/3 translate-x-1/2 translate-y-1/2 w-36 h-36 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,50 Q60,30 80,30 Q90,30 90,50 Q90,70 70,70 Q50,70 50,50" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.1"/>
            <path d="M50,50 Q40,70 20,70 Q10,70 10,50 Q10,30 30,30 Q50,30 50,50" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.08"/>
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div 
            className="transform transition-all duration-700"
            data-animate-id="newsletter-section"
          >
            <div className={`${isVisible['newsletter-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 dark:from-[#B85C6D]/15 dark:via-[#B85C6D]/20 dark:to-[#B85C6D]/15 text-[#8B2332] dark:text-[#B85C6D] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20 dark:border-[#B85C6D]/20">
                  STAY CONNECTED
                </span>
              </div>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#8B2332]/20 to-[#8B2332]/10 rounded-full mb-6 shadow-lg">
                <BellIcon size={36} className="text-[#8B2332] dark:text-[#B85C6D]" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6 leading-tight text-[#8B2332] dark:text-[#B85C6D]">
                Stay Updated
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                Subscribe to our newsletter for the latest news, events, and resources
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-1 px-5 py-3 rounded-full text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2332] shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
                <button className="px-6 py-3 bg-[#8B2332] text-white rounded-full font-semibold text-xs md:text-sm hover:bg-[#6B1A28] transition-all shadow-xl hover:shadow-2xl hover:scale-105">
              Subscribe
            </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Event Registration/Enrollment Form Modal */}
      <EnrollForm 
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedEvent(null);
        }}
        eventName={selectedEvent?.name}
        eventType={selectedEvent?.type}
      />
      </div>
    </div>
  );
}
