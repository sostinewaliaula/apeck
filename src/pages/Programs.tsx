import { useEffect, useState, useRef, memo, useMemo } from 'react';
import { BookOpenIcon, UsersIcon, GraduationCapIcon, HeartIcon, TrendingUpIcon, AwardIcon, ArrowRightIcon, CheckIcon, SparklesIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Programs() {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
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

  return <div className="w-full bg-white pt-20">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1600&q=75)',
            willChange: 'background-image'
          }}
        ></div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B2332]/85 via-[#8B2332]/80 to-[#6B1A28]/85"></div>
        
        {/* Enhanced background graphics */}
        <DottedPattern opacity={0.08} size="32px" />
        <DottedPattern opacity={0.05} size="48px" />
        <GeometricPattern opacity={0.04} />
        
        {/* Blur effects */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#ffffff" />
        <AbstractShape position="bottom" color="#ffffff" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="transform transition-all duration-700"
            data-animate-id="programs-hero"
          >
            <div className={`${isVisible['programs-hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-lg border border-white/20">
                  OUR PROGRAMS
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">Our Programs</h1>
              <p className="text-xl md:text-2xl text-white/95 max-w-3xl leading-relaxed">
                Comprehensive training and development programs designed to empower
                clergy for effective ministry and Kingdom impact
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </div>

      {/* Main Programs */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
        {/* Enhanced background graphics - multiple layers */}
        <DottedPattern opacity={0.04} size="32px" />
        <DottedPattern opacity={0.02} size="48px" className="mix-blend-multiply" />
        <GeometricPattern opacity={0.025} />
        <GeometricPattern opacity={0.015} className="rotate-45" />
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#8B2332" />
        <AbstractShape position="bottom" color="#7A7A3F" />
        <AbstractShape position="left" color="#8B2332" />
        <AbstractShape position="right" color="#7A7A3F" />
        
        {/* Additional decorative geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-52 h-52 opacity-4 hidden lg:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.15"/>
            <polygon points="50,15 85,50 50,85 15,50" fill="#7A7A3F" opacity="0.12"/>
          </svg>
        </div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 opacity-4 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,0 Q 80,25 80,60 Q 80,95 50,85 Q 20,95 20,60 Q 20,25 50,0 Z"
              fill="#7A7A3F"
              opacity="0.15"
            />
          </svg>
        </div>
        
        <div className="absolute top-1/3 left-1/5 w-44 h-44 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,5 95,50 50,95 5,50" fill="#8B2332" opacity="0.1"/>
          </svg>
        </div>
        <div className="absolute bottom-1/3 right-1/5 w-40 h-40 opacity-3 hidden xl:block">
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
        
        {/* Blur effects for depth */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#8B2332]/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#7A7A3F]/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B2332]/2 rounded-full blur-3xl"></div>
        
        {/* Decorative lines */}
        <div className="absolute top-1/2 left-0 w-px h-64 bg-gradient-to-b from-transparent via-[#8B2332]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/2 right-0 w-px h-64 bg-gradient-to-b from-transparent via-[#7A7A3F]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-px bg-gradient-to-r from-transparent via-[#8B2332]/8 to-transparent hidden lg:block"></div>
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-40 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/8 to-transparent hidden lg:block"></div>
        
        {/* Floating decorative dots */}
        <div className="absolute top-20 left-12 w-3 h-3 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute top-28 right-16 w-2 h-2 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-24 left-16 w-2.5 h-2.5 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-32 right-12 w-3 h-3 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-2 h-2 bg-[#8B2332]/15 rounded-full hidden lg:block"></div>
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-2.5 h-2.5 bg-[#7A7A3F]/15 rounded-full hidden lg:block"></div>
        
        {/* Organic shapes */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-80 h-80 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M 100,20 Q 160,40 180,100 Q 160,160 100,140 Q 40,160 20,100 Q 40,40 100,20 Z"
              fill="#8B2332"
              opacity="0.06"
            />
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-76 h-76 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M 60,60 Q 100,20 140,60 Q 180,100 140,140 Q 100,180 60,140 Q 20,100 60,60 Z"
              fill="#7A7A3F"
              opacity="0.07"
            />
          </svg>
        </div>
        
        {/* Corner decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-3 hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="0,0 100,0 50,50" fill="#8B2332" opacity="0.08"/>
            <polygon points="0,0 50,50 0,100" fill="#7A7A3F" opacity="0.06"/>
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-0 w-36 h-36 opacity-3 hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="100,100 0,100 50,50" fill="#8B2332" opacity="0.08"/>
            <polygon points="100,100 50,50 100,0" fill="#7A7A3F" opacity="0.06"/>
          </svg>
        </div>
        
        {/* Circle patterns */}
        <div className="absolute top-1/4 left-0 w-64 h-64 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.3"/>
            <circle cx="100" cy="100" r="70" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.2"/>
            <circle cx="100" cy="100" r="50" fill="none" stroke="#8B2332" strokeWidth="0.6" opacity="0.15"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 right-0 w-56 h-56 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.25"/>
            <circle cx="100" cy="100" r="65" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.2"/>
          </svg>
        </div>
        
        {/* Additional scattered shapes */}
        <div className="absolute top-1/5 right-1/3 w-36 h-36 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 75,100 25,100 0,50" fill="#7A7A3F" opacity="0.1"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/5 left-1/3 w-38 h-38 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,10 90,50 50,90 10,50" fill="#8B2332" opacity="0.1"/>
          </svg>
        </div>
        
        {/* More floating geometric shapes */}
        <div className="absolute top-10 right-1/5 w-28 h-28 opacity-4 hidden lg:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,5 95,50 50,95 5,50" fill="#8B2332" opacity="0.12"/>
            <polygon points="50,20 80,50 50,80 20,50" fill="#7A7A3F" opacity="0.1"/>
          </svg>
        </div>
        
        <div className="absolute bottom-10 left-1/5 w-32 h-32 opacity-4 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#8B2332" strokeWidth="2" opacity="0.15"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="#7A7A3F" strokeWidth="1.5" opacity="0.12"/>
          </svg>
        </div>
        
        {/* Diagonal accent lines */}
        <div className="absolute top-1/2 right-1/4 w-32 h-px bg-gradient-to-r from-transparent via-[#8B2332]/15 to-transparent transform rotate-45 hidden xl:block"></div>
        <div className="absolute bottom-1/3 left-1/4 w-32 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/15 to-transparent transform -rotate-45 hidden xl:block"></div>
        <div className="absolute top-1/3 left-1/3 w-24 h-px bg-gradient-to-r from-transparent via-[#8B2332]/12 to-transparent transform rotate-12 hidden xl:block"></div>
        <div className="absolute bottom-1/2 right-1/3 w-24 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/12 to-transparent transform -rotate-12 hidden xl:block"></div>
        
        {/* More decorative dots with varying sizes */}
        <div className="absolute top-16 left-1/4 w-1.5 h-1.5 bg-[#8B2332]/25 rounded-full hidden lg:block"></div>
        <div className="absolute top-24 right-1/3 w-2 h-2 bg-[#7A7A3F]/25 rounded-full hidden lg:block"></div>
        <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-[#8B2332]/25 rounded-full hidden lg:block"></div>
        <div className="absolute bottom-28 right-1/4 w-2 h-2 bg-[#7A7A3F]/25 rounded-full hidden lg:block"></div>
        <div className="absolute top-1/2 left-1/6 -translate-y-1/2 w-1.5 h-1.5 bg-[#8B2332]/20 rounded-full hidden xl:block"></div>
        <div className="absolute top-1/2 right-1/6 -translate-y-1/2 w-2 h-2 bg-[#7A7A3F]/20 rounded-full hidden xl:block"></div>
        
        {/* Star-like decorative shapes */}
        <div className="absolute top-32 right-1/6 w-20 h-20 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,10 L55,40 L85,40 L60,60 L70,90 L50,70 L30,90 L40,60 L15,40 L45,40 Z" fill="#8B2332" opacity="0.08"/>
          </svg>
        </div>
        
        <div className="absolute bottom-32 left-1/6 w-18 h-18 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,15 L53,35 L73,35 L58,50 L68,70 L50,60 L32,70 L42,50 L27,35 L47,35 Z" fill="#7A7A3F" opacity="0.09"/>
          </svg>
        </div>
        
        {/* Curved decorative elements */}
        <div className="absolute top-1/4 left-0 w-40 h-40 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path d="M 0,100 Q 50,50 100,100 T 200,100" fill="none" stroke="#8B2332" strokeWidth="2" opacity="0.1"/>
            <path d="M 0,120 Q 50,80 100,120 T 200,120" fill="none" stroke="#7A7A3F" strokeWidth="1.5" opacity="0.08"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 right-0 w-44 h-44 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path d="M 200,100 Q 150,150 100,100 T 0,100" fill="none" stroke="#7A7A3F" strokeWidth="2" opacity="0.1"/>
            <path d="M 200,80 Q 150,130 100,80 T 0,80" fill="none" stroke="#8B2332" strokeWidth="1.5" opacity="0.08"/>
          </svg>
        </div>
        
        {/* Hexagonal patterns */}
        <div className="absolute top-1/5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25" fill="none" stroke="#8B2332" strokeWidth="1.5" opacity="0.12"/>
            <polygon points="50,15 78.3,32.5 78.3,67.5 50,85 21.7,67.5 21.7,32.5" fill="#7A7A3F" opacity="0.06"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/5 left-1/2 -translate-x-1/2 translate-y-1/2 w-28 h-28 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25" fill="none" stroke="#7A7A3F" strokeWidth="1.5" opacity="0.12"/>
            <polygon points="50,18 76.3,34 76.3,66 50,82 23.7,66 23.7,34" fill="#8B2332" opacity="0.06"/>
          </svg>
        </div>
        
        {/* Wave patterns */}
        <div className="absolute top-0 left-1/3 w-64 h-32 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,50 Q25,30 50,50 T100,50 T150,50 T200,50" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.08"/>
            <path d="M0,60 Q25,40 50,60 T100,60 T150,60 T200,60" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.06"/>
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-1/3 w-64 h-32 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,50 Q25,70 50,50 T100,50 T150,50 T200,50" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.08"/>
            <path d="M0,40 Q25,60 50,40 T100,40 T150,40 T200,40" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.06"/>
          </svg>
        </div>
        
        {/* Grid pattern accents */}
        <div className="absolute top-1/3 right-1/5 w-24 h-24 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <line x1="0" y1="0" x2="100" y2="100" stroke="#8B2332" strokeWidth="1" opacity="0.1"/>
            <line x1="100" y1="0" x2="0" y2="100" stroke="#7A7A3F" strokeWidth="1" opacity="0.1"/>
            <line x1="50" y1="0" x2="50" y2="100" stroke="#8B2332" strokeWidth="0.8" opacity="0.08"/>
            <line x1="0" y1="50" x2="100" y2="50" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.08"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/3 left-1/5 w-22 h-22 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <line x1="0" y1="0" x2="100" y2="100" stroke="#7A7A3F" strokeWidth="1" opacity="0.1"/>
            <line x1="100" y1="0" x2="0" y2="100" stroke="#8B2332" strokeWidth="1" opacity="0.1"/>
          </svg>
        </div>
        
        {/* Spiral-like decorative elements */}
        <div className="absolute top-2/3 right-1/4 w-20 h-20 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,50 Q55,30 65,30 Q75,30 80,50 Q80,70 70,80 Q60,85 50,75" fill="none" stroke="#8B2332" strokeWidth="1.5" opacity="0.1"/>
          </svg>
        </div>
        
        <div className="absolute bottom-2/3 left-1/4 w-18 h-18 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,50 Q45,70 35,70 Q25,70 20,50 Q20,30 30,20 Q40,15 50,25" fill="none" stroke="#7A7A3F" strokeWidth="1.5" opacity="0.1"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="text-center mb-16 md:mb-20 transform transition-all duration-700"
            data-animate-id="programs-header"
          >
            <div className={`${isVisible['programs-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 text-[#8B2332] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20">
                  FEATURED PROGRAMS
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#8B2332] mb-4 leading-tight">
                Featured Programs
              </h2>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                Equipping clergy for excellence in ministry
              </p>
            </div>
          </div>
          <div className="space-y-12 md:space-y-16">
            {/* Theological Training */}
            <div 
              className="transform transition-all duration-700"
              data-animate-id="program-1"
            >
              <div className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden border border-gray-100 group transition-all duration-500 transform hover:-translate-y-2 h-[500px] md:h-[600px] ${
                isVisible['program-1'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
              }`}>
                <div className="grid md:grid-cols-2 h-full">
                  <div className="p-8 md:p-12 relative flex flex-col overflow-hidden">
                    {/* Dotted pattern overlay */}
                    <div className="absolute inset-0 rounded-3xl opacity-[0.02]" style={{
                      backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}></div>
                    
                    <div className="relative z-10 flex flex-col flex-grow h-full">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#8B2332]/20 to-[#8B2332]/10 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-[#8B2332]/20">
                        <BookOpenIcon size={36} className="text-[#8B2332]" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold text-[#8B2332] mb-4 group-hover:text-[#6B1A28] transition-colors">
                        Theological Training
                      </h3>
                      <p className="text-gray-700 mb-6 leading-relaxed text-base md:text-lg">
                        Comprehensive theological education programs covering
                        biblical studies, systematic theology, church history, and
                        practical ministry skills.
                      </p>
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-start space-x-3">
                          <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                          <span className="text-gray-700">
                            Certificate in Theology (6 months)
                          </span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                          <span className="text-gray-700">
                            Diploma in Ministry (1 year)
                          </span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                          <span className="text-gray-700">
                            Advanced Theological Studies (2 years)
                          </span>
                        </li>
                      </ul>
                      <button className="group/btn px-6 py-3 bg-[#8B2332] text-white rounded-full font-semibold hover:bg-[#6B1A28] transition-all inline-flex items-center space-x-2 hover:scale-105 shadow-lg hover:shadow-xl mt-auto">
                        <span>Learn More</span>
                        <ArrowRightIcon size={18} className="transform group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                  <div className="relative h-full overflow-hidden group">
                    <img 
                      src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=75" 
                      alt="Theological training" 
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                      style={{ willChange: 'transform' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-20 h-20 border-t-3 border-r-3 border-white/40 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg backdrop-blur-sm"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Leadership Development */}
            <div 
              className="transform transition-all duration-700"
              data-animate-id="program-2"
            >
              <div className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden border border-gray-100 group transition-all duration-500 transform hover:-translate-y-2 h-[500px] md:h-[600px] ${
                isVisible['program-2'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
              }`}>
                <div className="grid md:grid-cols-2 h-full">
                  <div className="relative h-full order-2 md:order-1 overflow-hidden group">
                    <img 
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=75" 
                      alt="Leadership development" 
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                      style={{ willChange: 'transform' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-0 left-0 w-20 h-20 border-t-3 border-l-3 border-white/40 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg backdrop-blur-sm"></div>
                  </div>
                  <div className="p-8 md:p-12 order-1 md:order-2 relative flex flex-col overflow-hidden">
                    <div className="absolute inset-0 rounded-3xl opacity-[0.02]" style={{
                      backgroundImage: 'radial-gradient(circle, #7A7A3F 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}></div>
                    <div className="relative z-10 flex flex-col flex-grow h-full">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#7A7A3F]/20 to-[#7A7A3F]/10 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-[#7A7A3F]/20">
                        <TrendingUpIcon size={36} className="text-[#7A7A3F]" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold text-[#8B2332] mb-4 group-hover:text-[#6B1A28] transition-colors">
                        Leadership Development
                      </h3>
                      <p className="text-gray-700 mb-6 leading-relaxed text-base md:text-lg">
                        Intensive leadership training programs designed to develop
                        visionary leaders who can effectively lead churches and
                        ministries.
                      </p>
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-start space-x-3">
                          <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                          <span className="text-gray-700">
                            Strategic Leadership Training
                          </span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                          <span className="text-gray-700">
                            Church Growth & Development
                          </span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                          <span className="text-gray-700">
                            Mentorship & Coaching
                          </span>
                        </li>
                      </ul>
                      <button className="group/btn px-6 py-3 bg-[#7A7A3F] text-white rounded-full font-semibold hover:bg-[#6A6A35] transition-all inline-flex items-center space-x-2 hover:scale-105 shadow-lg hover:shadow-xl mt-auto">
                        <span>Learn More</span>
                        <ArrowRightIcon size={18} className="transform group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Pastoral Care */}
            <div 
              className="transform transition-all duration-700"
              data-animate-id="program-3"
            >
              <div className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden border border-gray-100 group transition-all duration-500 transform hover:-translate-y-2 h-[500px] md:h-[600px] ${
                isVisible['program-3'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
              }`}>
                <div className="grid md:grid-cols-2 h-full">
                  <div className="p-8 md:p-12 relative flex flex-col overflow-hidden">
                    <div className="absolute inset-0 rounded-3xl opacity-[0.02]" style={{
                      backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}></div>
                    <div className="relative z-10 flex flex-col flex-grow h-full">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#8B2332]/20 to-[#8B2332]/10 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-[#8B2332]/20">
                        <HeartIcon size={36} className="text-[#8B2332]" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold text-[#8B2332] mb-4 group-hover:text-[#6B1A28] transition-colors">
                        Pastoral Care & Counseling
                      </h3>
                      <p className="text-gray-700 mb-6 leading-relaxed text-base md:text-lg">
                        Professional training in pastoral care, counseling
                        techniques, and spiritual guidance to help clergy
                        effectively minister to their congregations.
                      </p>
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-start space-x-3">
                          <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                          <span className="text-gray-700">
                            Biblical Counseling Certification
                          </span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                          <span className="text-gray-700">
                            Crisis Intervention Training
                          </span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                          <span className="text-gray-700">
                            Marriage & Family Counseling
                          </span>
                        </li>
                      </ul>
                      <button className="group/btn px-6 py-3 bg-[#8B2332] text-white rounded-full font-semibold hover:bg-[#6B1A28] transition-all inline-flex items-center space-x-2 hover:scale-105 shadow-lg hover:shadow-xl mt-auto">
                        <span>Learn More</span>
                        <ArrowRightIcon size={18} className="transform group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                  <div className="relative h-full overflow-hidden group">
                    <img 
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=75" 
                      alt="Pastoral care" 
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                      style={{ willChange: 'transform' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-0 right-0 w-20 h-20 border-t-3 border-r-3 border-white/40 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg backdrop-blur-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-gray-50">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Additional Programs */}
      <section className="relative py-20 md:py-32 bg-gray-50 overflow-hidden">
        {/* Enhanced background graphics */}
        <DottedPattern opacity={0.03} size="32px" />
        <GeometricPattern opacity={0.02} />
        
        {/* Blur effects */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#8B2332]/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#7A7A3F]/2 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="text-center mb-16 md:mb-20 transform transition-all duration-700"
            data-animate-id="additional-programs-header"
          >
            <div className={`${isVisible['additional-programs-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 text-[#8B2332] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20">
                  ADDITIONAL PROGRAMS
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#8B2332] mb-4 leading-tight">
                Additional Programs
              </h2>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                Specialized training for specific ministry areas
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            <div 
              className="transform transition-all duration-700"
              data-animate-id="additional-program-1"
            >
              <div className={`bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] relative border border-gray-100 group h-full ${
                isVisible['additional-program-1'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
              }`}>
                {/* Dotted pattern overlay */}
                <div className="absolute inset-0 rounded-3xl opacity-[0.02]" style={{
                  backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}></div>
                
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent to-[#8B2332]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#8B2332]/20 to-[#8B2332]/10 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-[#8B2332]/20">
                    <UsersIcon size={28} className="text-[#8B2332]" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#8B2332] mb-3 group-hover:text-[#6B1A28] transition-colors">
                    Youth Ministry
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Specialized training for effective youth and young adult
                    ministry
                  </p>
                  <p className="text-sm text-[#7A7A3F] font-semibold inline-block px-4 py-2 bg-[#7A7A3F]/10 rounded-full">
                    3-month program
                  </p>
                </div>
                
                {/* Decorative corners */}
                <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#8B2332]/10 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#7A7A3F]/10 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
            {[
              { icon: GraduationCapIcon, title: "Children's Ministry", description: "Training for impactful children's ministry and Sunday school programs", duration: "2-month program", color: '#7A7A3F', index: 2 },
              { icon: BookOpenIcon, title: "Worship & Music", description: "Comprehensive worship leading and church music ministry training", duration: "4-month program", color: '#8B2332', index: 3 },
              { icon: HeartIcon, title: "Missions & Evangelism", description: "Equipping clergy for effective evangelism and missions work", duration: "3-month program", color: '#7A7A3F', index: 4 },
              { icon: AwardIcon, title: "Church Administration", description: "Practical training in church management and administration", duration: "2-month program", color: '#8B2332', index: 5 },
              { icon: TrendingUpIcon, title: "Media & Communications", description: "Modern ministry tools for digital age evangelism and communication", duration: "3-month program", color: '#7A7A3F', index: 6 }
            ].map((program) => {
              const Icon = program.icon;
              const isMaroon = program.color === '#8B2332';
              return (
                <div 
                  key={program.index}
                  className="transform transition-all duration-700"
                  data-animate-id={`additional-program-${program.index}`}
                >
                  <div className={`bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] relative border border-gray-100 group h-full ${
                    isVisible[`additional-program-${program.index}`] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
                  }`}>
                    {/* Dotted pattern overlay */}
                    <div className="absolute inset-0 rounded-3xl opacity-[0.02]" style={{
                      backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}></div>
                    
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                      background: `linear-gradient(to bottom right, transparent, ${program.color === '#8B2332' ? 'rgba(139, 34, 50, 0.05)' : 'rgba(122, 122, 63, 0.05)'})`
                    }}></div>
                    
                    <div className="relative z-10">
                      <div className={`w-16 h-16 bg-gradient-to-br ${isMaroon ? 'from-[#8B2332]/20 to-[#8B2332]/10 border-[#8B2332]/20' : 'from-[#7A7A3F]/20 to-[#7A7A3F]/10 border-[#7A7A3F]/20'} rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 border`}>
                        <Icon size={28} className={isMaroon ? "text-[#8B2332]" : "text-[#7A7A3F]"} strokeWidth={2.5} />
                      </div>
                      <h3 className={`text-xl md:text-2xl font-bold mb-3 transition-colors ${isMaroon ? 'text-[#8B2332] group-hover:text-[#6B1A28]' : 'text-[#8B2332]'}`}>
                        {program.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {program.description}
                      </p>
                      <p className={`text-sm font-semibold inline-block px-4 py-2 rounded-full ${isMaroon ? 'text-[#7A7A3F] bg-[#7A7A3F]/10' : 'text-[#7A7A3F] bg-[#7A7A3F]/10'}`}>
                        {program.duration}
                      </p>
                    </div>
                    
                    {/* Decorative corners */}
                    <div className={`absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{
                      borderColor: `${program.color}33`
                    }}></div>
                    <div className={`absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{
                      borderColor: `${program.color === '#8B2332' ? '#7A7A3F' : '#8B2332'}33`
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-gray-50">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </div>

      {/* Program Features */}
      <section className="relative py-20 md:py-32 bg-white overflow-hidden">
        {/* Enhanced background graphics */}
        <DottedPattern opacity={0.03} size="32px" />
        <GeometricPattern opacity={0.02} />
        
        {/* Blur effects */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#8B2332]/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#7A7A3F]/2 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="text-center mb-16 md:mb-20 transform transition-all duration-700"
            data-animate-id="features-header"
          >
            <div className={`${isVisible['features-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 text-[#8B2332] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20">
                  PROGRAM FEATURES
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#8B2332] mb-4 leading-tight">
                Program Features
              </h2>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                What makes our programs exceptional
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {[
              { icon: GraduationCapIcon, title: 'Expert Instructors', description: 'Learn from experienced ministry leaders and theologians', color: '#8B2332', index: 0 },
              { icon: BookOpenIcon, title: 'Practical Training', description: 'Hands-on experience and real-world ministry applications', color: '#7A7A3F', index: 1 },
              { icon: AwardIcon, title: 'Certification', description: 'Receive recognized certificates upon program completion', color: '#8B2332', index: 2 },
              { icon: UsersIcon, title: 'Community', description: 'Connect with fellow clergy and build lasting relationships', color: '#7A7A3F', index: 3 }
            ].map((feature) => {
              const Icon = feature.icon;
              const isMaroon = feature.color === '#8B2332';
              return (
                <div 
                  key={feature.index}
                  className="transform transition-all duration-700"
                  data-animate-id={`feature-${feature.index}`}
                >
                  <div className={`text-center bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] border border-gray-100 group h-full ${
                    isVisible[`feature-${feature.index}`] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
                  }`}>
                    {/* Dotted pattern overlay */}
                    <div className="absolute inset-0 rounded-3xl opacity-[0.02]" style={{
                      backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}></div>
                    
                    <div className="relative z-10">
                      <div className={`w-20 h-20 bg-gradient-to-br ${isMaroon ? 'from-[#8B2332]/20 to-[#8B2332]/10 border-[#8B2332]/20' : 'from-[#7A7A3F]/20 to-[#7A7A3F]/10 border-[#7A7A3F]/20'} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 border`}>
                        <Icon size={36} className={isMaroon ? "text-[#8B2332]" : "text-[#7A7A3F]"} strokeWidth={2.5} />
                      </div>
                      <h3 className={`text-lg md:text-xl font-bold mb-3 transition-colors ${isMaroon ? 'text-[#8B2332] group-hover:text-[#6B1A28]' : 'text-[#8B2332]'}`}>
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    
                    {/* Decorative corner */}
                    <div className={`absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{
                      borderColor: `${feature.color}33`
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </div>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-[#8B2332] via-[#7B1F32] to-[#6B1A28] text-white overflow-hidden">
        {/* Enhanced background graphics */}
        <DottedPattern opacity={0.08} size="32px" />
        <DottedPattern opacity={0.05} size="48px" />
        <GeometricPattern opacity={0.04} />
        
        {/* Blur effects */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#ffffff" />
        <AbstractShape position="bottom" color="#ffffff" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div 
            className="transform transition-all duration-700"
            data-animate-id="cta-section"
          >
            <div className={`${isVisible['cta-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-lg border border-white/20">
                  GET STARTED
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Ready to Grow in Your Ministry?
              </h2>
              <p className="text-xl md:text-2xl text-white/95 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                Enroll in one of our programs and take your ministry to the next
                level
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  to="/membership"
                  className="group/btn px-8 py-4 bg-white text-[#8B2332] rounded-full font-semibold hover:bg-gray-100 transition-all inline-flex items-center space-x-2 hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  <span>Enroll Now</span>
                  <ArrowRightIcon size={20} className="transform group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/contact"
                  className="px-8 py-4 border-2 border-white/70 text-white rounded-full font-semibold hover:bg-white/10 hover:border-white transition-all inline-flex items-center space-x-2 hover:scale-105 backdrop-blur-sm shadow-lg"
                >
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
}