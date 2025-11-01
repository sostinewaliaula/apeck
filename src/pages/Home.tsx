import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, HeartIcon, UsersIcon, BookOpenIcon, SparklesIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon, QuoteIcon, StarIcon, AwardIcon, TrendingUpIcon } from 'lucide-react';

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [countedValues, setCountedValues] = useState<{ [key: number]: number }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  const slides = [{
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1600',
    title: 'Empowering the Clergy',
    subtitle: 'for Kingdom Impact',
    description: 'Uniting Pentecostal and Evangelical clergy across Kenya through training, leadership development, and spiritual empowerment'
  }, {
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1600',
    title: 'Comprehensive Training',
    subtitle: 'Programs',
    description: 'Over 250+ training programs designed to equip clergy for effective ministry and leadership excellence'
  }, {
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1600',
    title: 'Community Impact',
    subtitle: 'Across Kenya',
    description: 'Reaching all 47 counties with transformative ministry initiatives and humanitarian outreach programs'
  }, {
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600',
    title: 'Join 1,500+ Clergy',
    subtitle: 'Members',
    description: 'Be part of a vibrant community of passionate ministry leaders committed to excellence and Kingdom growth'
  }];

  const testimonials = [
    {
      name: 'Rev. Dr. James Mwangi',
      role: 'Senior Pastor, Nairobi',
      content: 'APECK has transformed my ministry through comprehensive training programs that equipped me with practical leadership skills and theological depth.',
      rating: 5
    },
    {
      name: 'Pastor Grace Wanjiku',
      role: 'Church Leader, Mombasa',
      content: 'The community and support network I found through APECK has been invaluable. The mentorship programs helped me navigate complex ministry challenges.',
      rating: 5
    },
    {
      name: 'Bishop David Otieno',
      role: 'Regional Coordinator',
      content: 'APECK\'s commitment to excellence in clergy development is unmatched. The training programs are relevant, practical, and spiritually enriching.',
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Counter animation function
  const animateCounter = (index: number, target: number) => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        setCountedValues((prev) => ({ ...prev, [index]: Math.round(current) }));
        clearInterval(timer);
      } else {
        setCountedValues((prev) => ({ ...prev, [index]: Math.round(current) }));
      }
    }, duration / steps);
  };

  useEffect(() => {
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-animate-id');
            if (id) {
              setIsVisible((prev) => ({ ...prev, [id]: true }));
              
              // Trigger counter animation for stats
              if (id.startsWith('stat-')) {
                const index = parseInt(id.split('-')[1]);
                const statValues = [
                  { num: 1500, suffix: '+' },
                  { num: 47, suffix: '' },
                  { num: 250, suffix: '+' },
                  { num: 15, suffix: '' }
                ];
                
                if (statValues[index] && !countedValues[index]) {
                  animateCounter(index, statValues[index].num);
                }
              }
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate-id]');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      elements.forEach((el) => observerRef.current?.unobserve(el));
    };
  }, [countedValues]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  // Dotted pattern background component (stippled/dot grid pattern)
  const DottedPattern = ({ className = '', size = '24px', opacity = 0.03 }: { className?: string; size?: string; opacity?: number }) => (
    <div className={`absolute inset-0 ${className}`} style={{
      backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
      backgroundSize: `${size} ${size}`,
      opacity: opacity,
    }}></div>
  );

  // Geometric pattern component (polygonal/triangular tessellation)
  const GeometricPattern = ({ className = '', opacity = 0.02 }: { className?: string; opacity?: number }) => {
    // Create SVG pattern for geometric shapes with unique ID
    const patternId = `geometric-pattern-${Math.random().toString(36).substr(2, 9)}`;
    return (
      <div className={`absolute inset-0 ${className}`} style={{ opacity }}>
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
  };

  // Abstract geometric shape component (curved/polygonal decorative elements)
  const AbstractShape = ({ position = 'right', color = '#8B2332' }: { position?: 'left' | 'right' | 'top' | 'bottom'; color?: string }) => {
    const positions = {
      right: 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
      left: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
      top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
      bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2'
    };

    return (
      <div className={`absolute ${positions[position]} w-64 h-64 md:w-96 md:h-96 opacity-5`}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M 100,0 Q 150,50 150,100 Q 150,150 100,150 Q 50,150 50,100 Q 50,50 100,0 Z"
            fill={color}
            transform="rotate(45 100 100)"
          />
          <path
            d="M 100,30 Q 130,50 130,80 Q 130,110 100,130 Q 70,130 70,100 Q 70,70 100,50 Z"
            fill={color}
            opacity="0.6"
            transform="rotate(45 100 100)"
          />
        </svg>
      </div>
    );
  };

  // Additional decorative circle pattern
  const CirclePattern = ({ position = 'center', size = 200 }: { position?: string; size?: number }) => {
    const positions = {
      center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      'top-left': 'top-0 left-0',
      'top-right': 'top-0 right-0',
      'bottom-left': 'bottom-0 left-0',
      'bottom-right': 'bottom-0 right-0'
    };

    return (
      <div 
        className={`absolute ${positions[position as keyof typeof positions] || positions.center} opacity-3`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <svg width={size} height={size} viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.1"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.08"/>
          <circle cx="100" cy="100" r="40" fill="none" stroke="#8B2332" strokeWidth="0.6" opacity="0.06"/>
        </svg>
      </div>
    );
  };

  // Diagonal line pattern component
  const DiagonalPattern = ({ angle = 45 }: { angle?: number }) => (
    <div className="absolute inset-0 opacity-[0.02]" style={{
      backgroundImage: 'repeating-linear-gradient(' + angle + 'deg, transparent, transparent 10px, #8B2332 10px, #8B2332 11px)',
    }}></div>
  );

  return <div className="w-full bg-white overflow-hidden">
      {/* Hero Carousel Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 z-0">
          <DottedPattern />
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#8B2332]/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-[#7A7A3F]/5 rounded-full blur-3xl animate-float"></div>
        </div>

        {/* Slides */}
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Subtle dark overlay - much lighter than before */}
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            {/* Subtle red tint - very light */}
            <div className="absolute inset-0 bg-[#8B2332]/20 z-10"></div>
            <div 
              className="absolute inset-0 bg-cover bg-center transform transition-transform duration-[10s] ease-out z-0"
              style={{
                backgroundImage: `url('${slide.image}')`,
                transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)'
              }}
            ></div>
          </div>
        ))}

        {/* Content */}
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col justify-center min-h-screen">
          {/* Main Heading with staggered animation */}
          <div className="mb-8 md:mb-12">
            {slides.map((slide, index) => (
              <div 
                key={index} 
                className={`transition-all duration-1000 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 absolute w-full left-0'}`}
                data-animate-id={`slide-${index}`}
              >
                <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight transform transition-all duration-700 drop-shadow-2xl ${isVisible[`slide-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                  {slide.title}
                  <br />
                  <span className="text-[#7A7A3F] inline-block mt-2 drop-shadow-lg">{slide.subtitle}</span>
                </h1>
                <p className={`text-lg md:text-xl lg:text-2xl text-white/95 mb-8 md:mb-12 max-w-3xl mx-auto transform transition-all duration-700 delay-200 drop-shadow-lg ${isVisible[`slide-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                  {slide.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Buttons with animation - positioned above indicators */}
          <div 
            className={`flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center flex-wrap transform transition-all duration-700 delay-300 mb-6 ${isVisible['cta'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            data-animate-id="cta"
          >
            <Link 
              to="/membership" 
              className="group px-6 md:px-8 py-3 md:py-4 bg-white text-[#8B2332] rounded-full font-semibold hover:bg-gray-100 transition-all inline-flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl hover:scale-105 transform text-sm md:text-base"
            >
              <span>Join APECK</span>
              <ArrowRightIcon size={18} className="md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/about" 
              className="px-6 md:px-8 py-3 md:py-4 bg-[#7A7A3F] text-white rounded-full font-semibold hover:bg-[#6A6A35] transition-all inline-flex items-center justify-center space-x-2 hover:scale-105 transform shadow-xl hover:shadow-2xl text-sm md:text-base"
            >
              <span>Learn More</span>
            </Link>
            <a 
              href="#donate" 
              className="group px-6 md:px-8 py-3 md:py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-[#8B2332] transition-all inline-flex items-center justify-center space-x-2 hover:scale-105 transform text-sm md:text-base"
            >
              <HeartIcon size={18} className="md:w-5 md:h-5 transform group-hover:scale-110 transition-transform" />
              <span>Partner With Us</span>
            </a>
            <button className="group px-6 md:px-8 py-3 md:py-4 border-2 border-white/70 text-white rounded-full font-semibold hover:bg-white/10 hover:border-white transition-all inline-flex items-center justify-center space-x-2 hover:scale-105 transform backdrop-blur-sm text-sm md:text-base shadow-lg">
              <PlayIcon size={18} className="md:w-5 md:h-5 transform group-hover:scale-110 transition-transform" />
              <span>Watch Video</span>
            </button>
          </div>
        </div>

        {/* Navigation Arrows - positioned to not interfere with content */}
        <button 
          onClick={prevSlide} 
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 border border-white/30 shadow-lg"
        >
          <ChevronLeftIcon size={24} className="md:w-7 md:h-7" />
        </button>
        <button 
          onClick={nextSlide} 
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 border border-white/30 shadow-lg"
        >
          <ChevronRightIcon size={24} className="md:w-7 md:h-7" />
        </button>

        {/* Slide Indicators - positioned at the very bottom of the section */}
        <div className="absolute bottom-8 md:bottom-10 left-1/2 transform -translate-x-1/2 z-40 flex space-x-2">
          {slides.map((_, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentSlide(index)} 
              className={`h-2.5 md:h-3 rounded-full transition-all duration-300 shadow-lg ${index === currentSlide ? 'bg-white w-8 md:w-10' : 'bg-white/40 hover:bg-white/60 w-2.5 md:w-3'}`} 
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* About Section with Modern Graphics */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden">
        {/* Enhanced background patterns - multiple layers */}
        <DottedPattern opacity={0.04} size="28px" />
        <DottedPattern opacity={0.02} size="40px" className="mix-blend-multiply" />
        <GeometricPattern opacity={0.03} />
        <DiagonalPattern angle={45} />
        <DiagonalPattern angle={135} />
        
        {/* Abstract geometric shapes - more positions */}
        <AbstractShape position="right" color="#8B2332" />
        <AbstractShape position="left" color="#7A7A3F" />
        <AbstractShape position="top" color="#8B2332" />
        
        {/* Additional circle patterns */}
        <CirclePattern position="top-left" size={300} />
        <CirclePattern position="bottom-right" size={250} />
        
        {/* More dotted patterns with different sizes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 opacity-[0.02]">
          <div style={{
            backgroundImage: 'radial-gradient(circle, #7A7A3F 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            width: '100%',
            height: '100%'
          }}></div>
        </div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 opacity-[0.02]">
          <div style={{
            backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            width: '100%',
            height: '100%'
          }}></div>
        </div>
        
        {/* Blur elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B2332]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7A7A3F]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8B2332]/3 rounded-full blur-3xl"></div>
        
        {/* Additional geometric shapes */}
        <div className="absolute top-20 right-20 w-48 h-48 opacity-5 hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.4"/>
            <polygon points="50,20 80,50 50,80 20,50" fill="#7A7A3F" opacity="0.3"/>
          </svg>
        </div>
        <div className="absolute bottom-20 left-20 w-40 h-40 opacity-5 hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,86.6 50,100 0,86.6" fill="#7A7A3F" opacity="0.4"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <div 
              className="transform transition-all duration-700 order-2 lg:order-1"
              data-animate-id="about-text"
            >
              <div className={`space-y-6 ${isVisible['about-text'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                {/* Modern badge */}
                <div className="inline-block">
                  <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332] to-[#6B1A28] text-white rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-lg">
                    WELCOME TO APECK
                  </span>
                </div>
                
                {/* Main heading with gradient effect */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#8B2332] leading-tight">
                  Who We Are
                </h2>
                
                {/* Content paragraphs with better styling */}
                <div className="space-y-6">
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                    <span className="font-semibold text-[#8B2332]">APECK</span> is the premier association uniting Pentecostal and
                    Evangelical clergy across Kenya. We are dedicated to empowering
                    spiritual leaders through comprehensive training, mentorship,
                    and resources that enable them to fulfill their calling with
                    excellence.
                  </p>
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                    Our mission is to strengthen the body of Christ by equipping
                    clergy with the tools, knowledge, and support they need to lead
                    transformative ministries that impact communities and advance
                    the Kingdom of God.
                  </p>
                </div>

                {/* Enhanced CTA button */}
                <Link 
                  to="/about" 
                  className="group inline-flex items-center space-x-3 px-6 py-3 bg-white border-2 border-[#8B2332] text-[#8B2332] font-semibold rounded-full hover:bg-[#8B2332] hover:text-white transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 transform"
                >
                  <span>Read Our Full Story</span>
                  <ArrowRightIcon size={20} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Decorative stats or highlights */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-3xl font-bold text-[#8B2332]">15+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#7A7A3F]">1,500+</div>
                    <div className="text-sm text-gray-600">Active Members</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Content */}
            <div 
              className="relative transform transition-all duration-700 order-1 lg:order-2"
              data-animate-id="about-image"
            >
              <div className={`${isVisible['about-image'] ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'}`}>
                <div className="relative group">
                  {/* Background geometric patterns behind image - multiple layers */}
                  <div className="absolute -z-10 inset-0 -m-8">
                    <GeometricPattern opacity={0.08} />
                    <GeometricPattern opacity={0.05} />
                    <DottedPattern opacity={0.06} size="20px" />
                    <DottedPattern opacity={0.04} size="35px" />
                    <DiagonalPattern angle={30} />
                    
                    {/* Large curved geometric shape */}
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 opacity-10">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        <path
                          d="M 100,0 Q 180,50 180,100 Q 180,150 100,180 Q 20,150 20,100 Q 20,50 100,0 Z"
                          fill="#8B2332"
                        />
                      </svg>
                    </div>
                    
                    {/* Additional curved shapes */}
                    <div className="absolute -top-16 -left-16 w-64 h-64 opacity-8">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        <path
                          d="M 50,50 Q 100,0 150,50 Q 200,100 150,150 Q 100,200 50,150 Q 0,100 50,50 Z"
                          fill="#7A7A3F"
                        />
                      </svg>
                    </div>
                    
                    {/* Circle patterns */}
                    <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-72 h-72 opacity-5">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        <circle cx="100" cy="100" r="90" fill="none" stroke="#8B2332" strokeWidth="2" opacity="0.3"/>
                        <circle cx="100" cy="100" r="70" fill="none" stroke="#7A7A3F" strokeWidth="1.5" opacity="0.2"/>
                        <circle cx="100" cy="100" r="50" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.15"/>
                      </svg>
                    </div>
                  </div>

                  {/* Main image with modern styling */}
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white p-1">
                    <div className="relative overflow-hidden rounded-3xl">
                      <img 
                        src="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800" 
                        alt="Clergy gathering" 
                        className="w-full h-auto transform group-hover:scale-110 transition-transform duration-700" 
                      />
                      {/* Overlay gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#8B2332]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Dotted pattern overlay on image (subtle) */}
                      <div className="absolute inset-0 opacity-[0.04]" style={{
                        backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
                        backgroundSize: '16px 16px',
                      }}></div>
                    </div>
                  </div>

                  {/* Enhanced decorative elements */}
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#7A7A3F]/30 to-[#7A7A3F]/10 rounded-3xl blur-2xl animate-pulse-slow hidden md:block"></div>
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#8B2332]/30 to-[#8B2332]/10 rounded-3xl blur-2xl animate-float hidden md:block"></div>
                  
                  {/* Modern decorative corner accents */}
                  <div className="absolute top-4 right-4 w-20 h-20 border-t-4 border-r-4 border-white/50 rounded-tr-3xl shadow-lg backdrop-blur-sm"></div>
                  <div className="absolute bottom-4 left-4 w-20 h-20 border-b-4 border-l-4 border-white/50 rounded-bl-3xl shadow-lg backdrop-blur-sm"></div>

                  {/* Floating badge element */}
                  <div className="absolute -bottom-4 right-8 bg-white px-6 py-3 rounded-full shadow-xl border-2 border-[#8B2332]/20 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="text-sm font-bold text-[#8B2332]">Since 2009</div>
                    <div className="text-xs text-gray-600">Serving Kenya</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Numbers */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-[#8B2332] via-[#8B2332] to-[#6B1A28] text-white overflow-hidden">
        {/* Enhanced background patterns */}
        <DottedPattern opacity={0.12} size="32px" />
        <DottedPattern opacity={0.08} size="48px" className="mix-blend-overlay" />
        <GeometricPattern opacity={0.05} />
        <DiagonalPattern angle={45} />
        
        {/* Decorative geometric shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon points="100,0 200,100 100,200 0,100" fill="#7A7A3F" opacity="0.3"/>
            <polygon points="100,30 170,100 100,170 30,100" fill="#8B2332" opacity="0.2"/>
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-80 h-80 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M 100,0 Q 160,40 160,100 Q 160,160 100,160 Q 40,160 40,100 Q 40,40 100,0 Z"
              fill="#7A7A3F"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Enhanced blur and glow effects */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/8 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#7A7A3F]/15 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl"></div>
        </div>

        {/* Circle patterns */}
        <CirclePattern position="top-left" size={400} />
        <CirclePattern position="bottom-right" size={350} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
            {[
              { value: '1,500+', label: 'Members', icon: UsersIcon, suffix: '+', baseNum: 1500 },
              { value: '47', label: 'Counties Reached', icon: TrendingUpIcon, suffix: '', baseNum: 47 },
              { value: '250+', label: 'Training Programs', icon: BookOpenIcon, suffix: '+', baseNum: 250 },
              { value: '15', label: 'Years of Impact', icon: AwardIcon, suffix: '', baseNum: 15 }
            ].map((stat, index) => {
              const displayedValue = countedValues[index] !== undefined 
                ? `${countedValues[index].toLocaleString()}${stat.suffix}` 
                : '0';
              const isAnimated = isVisible[`stat-${index}`];
              const delay = index * 150; // Staggered animation delay
              
              return (
                <div 
                  key={index}
                  className="text-center transform transition-all duration-700 group"
                  data-animate-id={`stat-${index}`}
                  style={{
                    transitionDelay: isAnimated ? `${delay}ms` : '0ms'
                  }}
                >
                  <div 
                    className={`transition-all duration-1000 ease-out ${
                      isAnimated 
                        ? 'opacity-100 translate-y-0 scale-100 rotate-0' 
                        : 'opacity-0 translate-y-12 scale-75 rotate-3'
                    }`}
                    style={{
                      transitionDelay: `${delay}ms`
                    }}
                  >
                    {/* Icon with modern styling - semi-transparent circular background */}
                    <div className="relative inline-flex items-center justify-center mb-6 md:mb-8">
                      {/* Outer glow effect with pulse */}
                      <div 
                        className={`absolute inset-0 bg-[#8B2332]/30 rounded-full blur-xl transition-all duration-500 group-hover:bg-[#8B2332]/50 ${
                          isAnimated ? 'animate-pulse-slow' : ''
                        }`}
                      ></div>
                      
                      {/* Animated ring on appear */}
                      <div 
                        className={`absolute inset-0 rounded-full border-2 border-[#7A7A3F]/30 transition-all duration-1000 ${
                          isAnimated ? 'scale-125 opacity-0' : 'scale-100 opacity-100'
                        }`}
                        style={{ transitionDelay: `${delay + 200}ms` }}
                      ></div>
                      
                      {/* Semi-transparent circular background */}
                      <div 
                        className={`relative inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-[#8B2332]/40 rounded-full backdrop-blur-sm border-2 border-white/20 shadow-lg transition-all duration-500 group-hover:border-white/40 group-hover:scale-110 group-hover:rotate-6 ${
                          isAnimated ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
                        }`}
                        style={{ transitionDelay: `${delay + 300}ms` }}
                      >
                        <stat.icon 
                          size={44} 
                          className={`text-[#7A7A3F] md:w-12 md:h-12 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${
                            isAnimated ? 'scale-100 rotate-0' : 'scale-0 -rotate-180'
                          }`}
                          style={{ transitionDelay: `${delay + 400}ms` }}
                        />
                      </div>
                      
                      {/* Decorative dots around icon with entrance animation */}
                      <div 
                        className={`absolute -top-2 -right-2 w-3 h-3 bg-[#7A7A3F] rounded-full transition-all duration-500 group-hover:opacity-100 group-hover:scale-125 ${
                          isAnimated ? 'opacity-60 scale-100' : 'opacity-0 scale-0'
                        }`}
                        style={{ transitionDelay: `${delay + 500}ms` }}
                      ></div>
                      <div 
                        className={`absolute -bottom-2 -left-2 w-2 h-2 bg-[#7A7A3F] rounded-full transition-all duration-500 group-hover:opacity-100 group-hover:scale-125 ${
                          isAnimated ? 'opacity-60 scale-100' : 'opacity-0 scale-0'
                        }`}
                        style={{ transitionDelay: `${delay + 600}ms` }}
                      ></div>
                    </div>
                    
                    {/* Number with counting animation */}
                    <div className="relative mb-3 md:mb-4">
                      <div 
                        className={`text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#7A7A3F] drop-shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:text-[#8BFFFF] inline-block ${
                          isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}
                        style={{ transitionDelay: `${delay + 700}ms` }}
                      >
                        {displayedValue}
                      </div>
                      {/* Animated glow behind number */}
                      <div 
                        className={`absolute inset-0 text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#7A7A3F]/20 blur-lg -z-10 transition-all duration-1000 ${
                          isAnimated ? 'opacity-100 animate-pulse-slow' : 'opacity-0'
                        }`}
                        style={{ transitionDelay: `${delay + 700}ms` }}
                      >
                        {displayedValue}
                      </div>
                      {/* Pulse ring effect */}
                      <div 
                        className={`absolute inset-0 rounded-lg border-2 border-[#7A7A3F]/20 transition-all duration-1000 ${
                          isAnimated ? 'scale-150 opacity-0 animate-ping' : 'scale-100 opacity-0'
                        }`}
                        style={{ transitionDelay: `${delay + 800}ms` }}
                      ></div>
                    </div>
                    
                    {/* Label with slide-up animation */}
                    <div 
                      className={`text-white/95 text-sm md:text-base lg:text-lg font-semibold tracking-wide uppercase transition-all duration-700 ${
                        isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}
                      style={{ transitionDelay: `${delay + 900}ms` }}
                    >
                      {stat.label}
                    </div>

                    {/* Decorative line with width animation */}
                    <div 
                      className={`mt-4 mx-auto h-0.5 bg-gradient-to-r from-transparent via-[#7A7A3F]/50 to-transparent transition-all duration-500 group-hover:opacity-100 group-hover:w-24 ${
                        isAnimated ? 'opacity-100 w-16' : 'opacity-0 w-0'
                      }`}
                      style={{ transitionDelay: `${delay + 1000}ms` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional decorative elements */}
          <div className="absolute top-1/2 left-0 w-px h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden lg:block"></div>
          <div className="absolute top-1/2 right-0 w-px h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden lg:block"></div>
          <div className="absolute top-1/2 left-1/4 w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block"></div>
          <div className="absolute top-1/2 right-1/4 w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block"></div>
        </div>
      </section>

      {/* Programs Preview with Modern Card Design */}
      <section className="relative py-24 bg-white overflow-hidden">
        <DottedPattern />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="text-center mb-16 transform transition-all duration-700"
            data-animate-id="programs-header"
          >
            <div className={`${isVisible['programs-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-block px-4 py-2 bg-[#8B2332]/10 text-[#8B2332] rounded-full text-sm font-semibold mb-6">
                OUR SERVICES
              </span>
              <h2 className="text-5xl md:text-6xl font-bold text-[#8B2332] mb-4">
                Our Programs & Initiatives
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Comprehensive programs designed to empower clergy and strengthen
                ministry impact
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: BookOpenIcon, 
                title: 'Training Programs', 
                description: 'Comprehensive theological and leadership training for clergy at all levels',
                color: 'bg-[#8B2332]/10 text-[#8B2332]'
              },
              { 
                icon: UsersIcon, 
                title: 'Clergy Empowerment', 
                description: 'Resources and support for personal and ministerial growth',
                color: 'bg-[#7A7A3F]/10 text-[#7A7A3F]'
              },
              { 
                icon: SparklesIcon, 
                title: 'Leadership Development', 
                description: 'Mentorship and coaching for emerging and established leaders',
                color: 'bg-[#8B2332]/10 text-[#8B2332]'
              },
              { 
                icon: HeartIcon, 
                title: 'Community Outreach', 
                description: 'Collaborative initiatives to serve communities across Kenya',
                color: 'bg-[#7A7A3F]/10 text-[#7A7A3F]'
              }
            ].map((program, index) => (
              <div 
                key={index}
                className="group relative transform transition-all duration-700"
                data-animate-id={`program-${index}`}
              >
                <div className={`${isVisible[`program-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full transform hover:-translate-y-2 hover:scale-105">
                    {/* Dotted pattern overlay */}
                    <div className="absolute inset-0 rounded-3xl opacity-[0.03]" style={{
                      backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0'
                    }}></div>
                    
                    <div className={`w-20 h-20 ${program.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10`}>
                      <program.icon size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-[#8B2332] mb-4 relative z-10">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed relative z-10">
                      {program.description}
                    </p>
                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#8B2332]/10 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div 
            className="text-center mt-16 transform transition-all duration-700"
            data-animate-id="programs-cta"
          >
            <div className={`${isVisible['programs-cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Link 
                to="/programs" 
                className="group inline-flex items-center space-x-2 px-10 py-5 bg-[#8B2332] text-white rounded-full font-semibold hover:bg-[#6B1A28] transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform"
              >
                <span>Explore All Programs</span>
                <ArrowRightIcon size={20} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <DottedPattern />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="text-center mb-16 transform transition-all duration-700"
            data-animate-id="testimonials-header"
          >
            <div className={`${isVisible['testimonials-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-block px-4 py-2 bg-[#8B2332]/10 text-[#8B2332] rounded-full text-sm font-semibold mb-6">
                TESTIMONIALS
              </span>
              <h2 className="text-5xl md:text-6xl font-bold text-[#8B2332] mb-4">
                What Our Members Say
              </h2>
              <p className="text-gray-600 text-lg">
                Real stories from clergy transformed through APECK
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="transform transition-all duration-700"
                data-animate-id={`testimonial-${index}`}
              >
                <div className={`bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 h-full transform hover:-translate-y-2 relative ${isVisible[`testimonial-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  {/* Quote icon */}
                  <QuoteIcon className="text-[#8B2332]/10 w-16 h-16 mb-4" size={64} />
                  
                  {/* Stars */}
                  <div className="flex space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 fill-[#7A7A3F] text-[#7A7A3F]" />
                    ))}
                  </div>

                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <div className="font-bold text-[#8B2332] text-lg">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#8B2332]/10 rounded-br-3xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Updates */}
      <section className="relative py-24 bg-white overflow-hidden">
        <DottedPattern />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="text-center mb-16 transform transition-all duration-700"
            data-animate-id="news-header"
          >
            <div className={`${isVisible['news-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-block px-4 py-2 bg-[#8B2332]/10 text-[#8B2332] rounded-full text-sm font-semibold mb-6">
                NEWS & UPDATES
              </span>
              <h2 className="text-5xl md:text-6xl font-bold text-[#8B2332] mb-4">
                Recent Updates
              </h2>
              <p className="text-gray-600 text-lg">
                Stay informed about our latest activities and events
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600', 
                date: 'DECEMBER 15, 2024',
                title: 'Annual Leadership Conference 2024',
                description: 'Join us for three days of powerful teaching, networking, and spiritual renewal'
              },
              { 
                image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600', 
                date: 'DECEMBER 10, 2024',
                title: 'New Training Program Launch',
                description: 'Introducing our comprehensive pastoral care and counseling certification'
              },
              { 
                image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600', 
                date: 'DECEMBER 5, 2024',
                title: 'Community Outreach Success',
                description: 'Over 5,000 families reached through our latest humanitarian initiative'
              }
            ].map((update, index) => (
              <div 
                key={index}
                className="transform transition-all duration-700"
                data-animate-id={`news-${index}`}
              >
                <div className={`bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible[`news-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="relative overflow-hidden">
                    <img 
                      src={update.image} 
                      alt={update.title} 
                      className="w-full h-56 object-cover transform hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#8B2332]">
                      {update.date}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#8B2332] mb-3">
                      {update.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {update.description}
                    </p>
                    <Link 
                      to="/news" 
                      className="group inline-flex items-center space-x-2 text-[#8B2332] font-semibold hover:text-[#7A7A3F] transition-colors"
                    >
                      <span>Read More</span>
                      <ArrowRightIcon size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#8B2332] via-[#8B2332] to-[#6B1A28] text-white overflow-hidden">
        <DottedPattern className="opacity-10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-[#7A7A3F]/10 rounded-full blur-3xl animate-float"></div>
        </div>
        <div 
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 transform transition-all duration-700"
          data-animate-id="cta-final"
        >
          <div className={`${isVisible['cta-final'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">Ready to Make an Impact?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join a community of passionate clergy committed to transforming
              Kenya through the Gospel
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/membership" 
                className="px-10 py-5 bg-white text-[#8B2332] rounded-full font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform"
              >
                Become a Member
              </Link>
              <Link 
                to="/contact" 
                className="px-10 py-5 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-[#8B2332] transition-all hover:scale-105 transform"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>;
}
