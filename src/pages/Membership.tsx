import { useEffect, useState, useRef, memo, useMemo } from 'react';
import { CheckIcon, UsersIcon, AwardIcon, HeartIcon, BookOpenIcon, ShieldIcon, StarIcon, ArrowRightIcon } from 'lucide-react';
import { EnrollForm } from '../components/EnrollForm';

export function Membership() {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [isEnrollFormOpen, setIsEnrollFormOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
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

  return <div className="w-full bg-white pt-20">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 text-white overflow-hidden">
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
                  JOIN APECK
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                Membership
              </h1>
              <p className="text-xl md:text-2xl text-white/95 max-w-3xl leading-relaxed mb-8">
                Join a community of passionate clergy committed to excellence in
                ministry and Kingdom impact
              </p>
              <button
                onClick={() => setIsEnrollFormOpen(true)}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-[#8B2332] rounded-full font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <span>Start Your Application</span>
                <ArrowRightIcon size={20} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
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

      {/* Benefits Section */}
      <section className="relative py-20 md:py-32 bg-white overflow-hidden">
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
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 text-[#8B2332] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20">
                  MEMBERSHIP BENEFITS
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#8B2332] mb-4 leading-tight">
                Membership Benefits
              </h2>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                Why join APECK?
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[
              { icon: AwardIcon, title: 'Professional Development', description: 'Access to comprehensive training programs, workshops, and seminars for continuous growth', color: '#8B2332', index: 0 },
              { icon: UsersIcon, title: 'Networking Opportunities', description: 'Connect with fellow clergy across Kenya and build meaningful ministry partnerships', color: '#7A7A3F', index: 1 },
              { icon: HeartIcon, title: 'Pastoral Care', description: 'Receive support, counseling, and mentorship from experienced ministry leaders', color: '#8B2332', index: 2 },
              { icon: ShieldIcon, title: 'Certification', description: 'Official recognition and certification as a member of APECK', color: '#7A7A3F', index: 3 },
              { icon: BookOpenIcon, title: 'Resource Library', description: 'Access to extensive library of books, materials, and digital resources', color: '#8B2332', index: 4 },
              { icon: StarIcon, title: 'Annual Conference', description: 'Exclusive access to our annual leadership conference and special events', color: '#7A7A3F', index: 5 }
            ].map((benefit) => {
              const Icon = benefit.icon;
              const isMaroon = benefit.color === '#8B2332';
              return (
                <div 
                  key={benefit.index}
                  className="transform transition-all duration-700"
                  data-animate-id={`benefit-${benefit.index}`}
                >
                  <div className={`bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] border border-gray-100 group h-full ${
                    isVisible[`benefit-${benefit.index}`] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
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
                      <div className={`w-20 h-20 bg-gradient-to-br ${isMaroon ? 'from-[#8B2332]/20 to-[#8B2332]/10 border-[#8B2332]/20' : 'from-[#7A7A3F]/20 to-[#7A7A3F]/10 border-[#7A7A3F]/20'} rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 border`}>
                        <Icon size={36} className={isMaroon ? "text-[#8B2332]" : "text-[#7A7A3F]"} strokeWidth={2.5} />
                      </div>
                      <h3 className={`text-xl md:text-2xl font-bold mb-3 transition-colors ${isMaroon ? 'text-[#8B2332] group-hover:text-[#6B1A28]' : 'text-[#8B2332]'}`}>
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
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
      <div className="relative w-full overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </div>

      {/* Membership Tiers */}
      <section className="relative py-20 md:py-32 bg-gray-50 overflow-hidden">
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
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 text-[#8B2332] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20">
                  MEMBERSHIP CATEGORIES
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#8B2332] mb-4 leading-tight">
                Membership Categories
              </h2>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                Choose the membership level that fits your ministry
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {/* Associate Member */}
            <div 
              className="transform transition-all duration-700"
              data-animate-id="tier-1"
            >
              <div className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden border border-gray-100 group transition-all duration-500 transform hover:-translate-y-2 h-full ${
                isVisible['tier-1'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
              }`}>
                <div className="bg-gradient-to-br from-gray-600 to-gray-700 text-white p-8 text-center relative overflow-hidden">
                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">Associate Member</h3>
                    <p className="text-white/80 mb-4">For emerging clergy</p>
                    <div className="text-4xl md:text-5xl font-bold mb-1">KSh 5,000</div>
                    <p className="text-white/80 text-sm">per year</p>
                  </div>
                </div>
                <div className="p-8">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start space-x-3">
                      <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-gray-700">Access to basic training programs</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-gray-700">Quarterly newsletters</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-gray-700">Online resource access</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-gray-700">Networking opportunities</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => {
                      setSelectedTier('Associate Member');
                      setIsEnrollFormOpen(true);
                    }}
                    className="w-full px-6 py-3 bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>

            {/* Full Member - Featured */}
            <div 
              className="transform transition-all duration-700"
              data-animate-id="tier-2"
            >
              <div className={`bg-white rounded-3xl shadow-2xl hover:shadow-3xl overflow-hidden border-4 border-[#8B2332] group transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.03] h-full relative ${
                isVisible['tier-2'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
              }`}>
                {/* Popular Badge */}
                <div className="absolute top-6 right-6 bg-gradient-to-r from-[#7A7A3F] to-[#8B2332] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-20">
                  POPULAR
                </div>
                
                <div className="bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white p-8 text-center relative overflow-hidden">
                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">Full Member</h3>
                    <p className="text-white/80 mb-4">For established clergy</p>
                    <div className="text-4xl md:text-5xl font-bold mb-1">KSh 10,000</div>
                    <p className="text-white/80 text-sm">per year</p>
                  </div>
                </div>
                <div className="p-8">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start space-x-3">
                      <CheckIcon size={20} className="text-[#8B2332] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-gray-700">All Associate benefits</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckIcon size={20} className="text-[#8B2332] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-gray-700">Full training program access</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckIcon size={20} className="text-[#8B2332] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-gray-700">Mentorship opportunities</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckIcon size={20} className="text-[#8B2332] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-gray-700">Conference discounts</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckIcon size={20} className="text-[#8B2332] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-gray-700">Voting rights</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => {
                      setSelectedTier('Full Member');
                      setIsEnrollFormOpen(true);
                    }}
                    className="w-full px-6 py-3 bg-[#8B2332] text-white rounded-full font-semibold hover:bg-[#6B1A28] transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>

            {/* Lifetime Member */}
            <div 
              className="transform transition-all duration-700"
              data-animate-id="tier-3"
            >
              <div className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden border border-gray-100 group transition-all duration-500 transform hover:-translate-y-2 h-full ${
                isVisible['tier-3'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
              }`}>
                <div className="bg-gradient-to-br from-[#7A7A3F] to-[#6A6A35] text-white p-8 text-center relative overflow-hidden">
                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">Lifetime Member</h3>
                    <p className="text-white/80 mb-4">For senior clergy</p>
                    <div className="text-4xl md:text-5xl font-bold mb-1">KSh 50,000</div>
                    <p className="text-white/80 text-sm">one-time payment</p>
                  </div>
                </div>
                <div className="p-8">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start space-x-3">
                      <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-gray-700">All Full Member benefits</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-gray-700">Lifetime membership</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-gray-700">Priority event access</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-gray-700">Leadership opportunities</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-gray-700">Legacy recognition</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => {
                      setSelectedTier('Lifetime Member');
                      setIsEnrollFormOpen(true);
                    }}
                    className="w-full px-6 py-3 bg-[#7A7A3F] text-white rounded-full font-semibold hover:bg-[#6A6A35] transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Apply Now
                  </button>
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

      {/* Requirements */}
      <section className="relative py-20 md:py-32 bg-white overflow-hidden">
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
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 text-[#8B2332] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20">
                  MEMBERSHIP REQUIREMENTS
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#8B2332] mb-4 leading-tight">
                Membership Requirements
              </h2>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                What you need to become a member
              </p>
            </div>
          </div>
          <div 
            className="transform transition-all duration-700"
            data-animate-id="requirements-content"
          >
            <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 ${
              isVisible['requirements-content'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              {/* Dotted pattern overlay */}
              <div className="absolute inset-0 rounded-3xl opacity-[0.02]" style={{
                backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}></div>
              
              <ul className="space-y-6 relative z-10">
                {[
                  { title: 'Calling to Ministry', description: 'Clear evidence of a calling to full-time Christian ministry', icon: HeartIcon },
                  { title: 'Doctrinal Statement', description: 'Agreement with APECK\'s statement of faith and core beliefs', icon: BookOpenIcon },
                  { title: 'Ministry Experience', description: 'Active involvement in ministry (requirements vary by membership level)', icon: AwardIcon },
                  { title: 'References', description: 'Two pastoral references from recognized ministry leaders', icon: UsersIcon },
                  { title: 'Application Fee', description: 'One-time non-refundable application fee of KSh 1,000', icon: ShieldIcon }
                ].map((req, index) => {
                  const Icon = req.icon;
                  return (
                    <li key={index} className="flex items-start space-x-4 group">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#8B2332]/20 to-[#8B2332]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-[#8B2332]/20">
                        <Icon size={24} className="text-[#8B2332]" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-[#8B2332] mb-2 group-hover:text-[#6B1A28] transition-colors">
                          {req.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
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
      <div className="relative w-full overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="#FAF9F7"/>
          </svg>
        </div>
      </div>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-[#FAF9F7] via-[#F5F4F2] to-[#FAF9F7] overflow-hidden">
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
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 text-[#8B2332] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20">
                  GET STARTED
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-[#8B2332]">
                Ready to Join APECK?
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                Take the next step in your ministry journey and become part of our
                community
              </p>
              <button
                onClick={() => setIsEnrollFormOpen(true)}
                className="group/btn px-8 py-4 bg-[#8B2332] text-white rounded-full font-semibold hover:bg-[#6B1A28] transition-all inline-flex items-center space-x-2 hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <span>Start Your Application</span>
                <ArrowRightIcon size={20} className="transform group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enrollment Form Modal */}
      <EnrollForm 
        isOpen={isEnrollFormOpen}
        onClose={() => {
          setIsEnrollFormOpen(false);
          setSelectedTier(null);
        }}
        programName={selectedTier ? `${selectedTier} - APECK Membership` : undefined}
      />
    </div>;
}
