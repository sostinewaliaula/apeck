import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, HeartIcon, UsersIcon, BookOpenIcon, SparklesIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon, QuoteIcon, StarIcon, AwardIcon, TrendingUpIcon } from 'lucide-react';

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
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

  useEffect(() => {
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-animate-id');
            if (id) {
              setIsVisible((prev) => ({ ...prev, [id]: true }));
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
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  // Dotted pattern background component
  const DottedPattern = ({ className = '' }: { className?: string }) => (
    <div className={`absolute inset-0 opacity-[0.03] ${className}`} style={{
      backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
      backgroundSize: '24px 24px',
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
      <section className="relative py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        <DottedPattern />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div 
              className="transform transition-all duration-700"
              data-animate-id="about-text"
            >
              <div className={`${isVisible['about-text'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                <span className="inline-block px-4 py-2 bg-[#8B2332]/10 text-[#8B2332] rounded-full text-sm font-semibold mb-6">
                  WELCOME TO APECK
                </span>
                <h2 className="text-5xl md:text-6xl font-bold text-[#8B2332] mb-6 leading-tight">
                  Who We Are
                </h2>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  APECK is the premier association uniting Pentecostal and
                  Evangelical clergy across Kenya. We are dedicated to empowering
                  spiritual leaders through comprehensive training, mentorship,
                  and resources that enable them to fulfill their calling with
                  excellence.
                </p>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                  Our mission is to strengthen the body of Christ by equipping
                  clergy with the tools, knowledge, and support they need to lead
                  transformative ministries that impact communities and advance
                  the Kingdom of God.
                </p>
                <Link 
                  to="/about" 
                  className="group inline-flex items-center space-x-2 text-[#8B2332] font-semibold hover:text-[#7A7A3F] transition-colors text-lg"
                >
                  <span>Read Our Full Story</span>
                  <ArrowRightIcon size={20} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div 
              className="relative transform transition-all duration-700"
              data-animate-id="about-image"
            >
              <div className={`${isVisible['about-image'] ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'}`}>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800" 
                    alt="Clergy gathering" 
                    className="rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-[#7A7A3F]/20 rounded-full blur-3xl animate-pulse-slow"></div>
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#8B2332]/20 rounded-full blur-3xl animate-float"></div>
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-[#8B2332]/30 rounded-tr-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-[#7A7A3F]/30 rounded-bl-3xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Numbers */}
      <section className="relative py-24 bg-gradient-to-br from-[#8B2332] via-[#8B2332] to-[#6B1A28] text-white overflow-hidden">
        <DottedPattern className="opacity-10" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#7A7A3F]/10 rounded-full blur-3xl animate-float"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: '1,500+', label: 'Members', icon: UsersIcon },
              { value: '47', label: 'Counties Reached', icon: TrendingUpIcon },
              { value: '250+', label: 'Training Programs', icon: BookOpenIcon },
              { value: '15', label: 'Years of Impact', icon: AwardIcon }
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center transform transition-all duration-700"
                data-animate-id={`stat-${index}`}
              >
                <div className={`${isVisible[`stat-${index}`] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90'}`}>
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm border border-white/20">
                    <stat.icon size={40} className="text-[#7A7A3F]" />
                  </div>
                  <div className="text-5xl md:text-6xl font-bold text-[#7A7A3F] mb-3">
                    {stat.value}
                  </div>
                  <div className="text-white/90 text-lg font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
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
