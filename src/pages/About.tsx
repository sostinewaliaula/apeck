import { useEffect, useState, useRef } from 'react';
import { TargetIcon, EyeIcon, HeartIcon, AwardIcon } from 'lucide-react';

export function About() {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Dotted pattern background component
  const DottedPattern = ({ className = '', size = '24px', opacity = 0.03 }: { className?: string; size?: string; opacity?: number }) => (
    <div className={`absolute inset-0 ${className}`} style={{
      backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
      backgroundSize: `${size} ${size}`,
      opacity: opacity,
    }}></div>
  );

  // Geometric pattern component
  const GeometricPattern = ({ className = '', opacity = 0.02 }: { className?: string; opacity?: number }) => {
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

  // Abstract shape component
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
        </svg>
      </div>
    );
  };

  // Circle pattern component
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

  useEffect(() => {
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

  return <div className="w-full bg-white pt-20">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600)'
          }}
        ></div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B2332]/80 via-[#8B2332]/70 to-[#6B1A28]/85"></div>
        
        {/* Enhanced background graphics */}
        <DottedPattern opacity={0.08} size="32px" />
        <DottedPattern opacity={0.05} size="48px" />
        <GeometricPattern opacity={0.04} />
        <CirclePattern position="top-right" size={400} />
        <CirclePattern position="bottom-left" size={350} />
        
        {/* Blur effects */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-[#7A7A3F]/10 rounded-full blur-3xl animate-float"></div>
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#7A7A3F" />
        <AbstractShape position="bottom" color="#8B2332" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="transform transition-all duration-700"
            data-animate-id="about-hero"
          >
            <div className={`${isVisible['about-hero'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-xs md:text-sm font-bold uppercase tracking-wider border border-white/30">
                  ABOUT US
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                About APECK
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl leading-relaxed">
                Building a unified community of Pentecostal and Evangelical clergy
                dedicated to excellence in ministry and Kingdom impact
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#8B2332] to-white">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0,0 Q400,50 600,40 T1200,50 L1200,100 L0,100 Z" fill="white"/>
        </svg>
      </div>

      {/* History - Moved to second section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden">
        {/* Enhanced background graphics */}
        <DottedPattern opacity={0.04} size="32px" />
        <DottedPattern opacity={0.02} size="48px" />
        <GeometricPattern opacity={0.03} />
        <CirclePattern position="top-right" size={400} />
        <CirclePattern position="bottom-left" size={360} />
        
        {/* Blur effects */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#8B2332]/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#7A7A3F]/3 rounded-full blur-3xl"></div>
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#8B2332" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div 
              className="transform transition-all duration-700"
              data-animate-id="history-text"
            >
              <div className={`${isVisible['history-text'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                <div className="inline-block mb-6">
                  <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 text-[#8B2332] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20">
                    OUR STORY
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#8B2332] mb-6 md:mb-8 leading-tight">
                  Our Story
                </h2>
                <div className="space-y-6 text-gray-700 leading-relaxed text-base md:text-lg">
                  <p className="transform transition-all duration-500 hover:translate-x-2">
                    APECK was founded in <span className="font-semibold text-[#8B2332]">2009</span> by a group of visionary clergy
                    leaders who recognized the urgent need for a unified platform to
                    support, empower, and connect Pentecostal and Evangelical
                    ministers across Kenya. These founding members, representing diverse
                    denominations and regions, shared a common vision: to create an
                    organization that would bridge divides, foster collaboration, and
                    elevate the standards of clergy practice nationwide.
                  </p>
                  <p className="transform transition-all duration-500 hover:translate-x-2">
                    The initial meetings took place in Nairobi, where <span className="font-semibold text-[#7A7A3F]">15 founding
                    pastors</span> gathered to discuss the challenges facing clergy in
                    Kenya. They identified critical gaps in training, support systems,
                    and networking opportunities. From these humble beginnings, APECK
                    was officially registered as a national association, establishing
                    its first headquarters in the capital city.
                  </p>
                  <p className="transform transition-all duration-500 hover:translate-x-2">
                    What began as a small gathering of passionate pastors has
                    grown into a national movement representing over <span className="font-semibold text-[#7A7A3F]">1,500 clergy
                    members</span> from all <span className="font-semibold text-[#8B2332]">47 counties</span> of Kenya. Our growth
                    has been marked by strategic expansion into regional chapters,
                    each led by dedicated coordinators who understand the unique
                    ministry contexts of their areas. From the coastal regions of
                    Mombasa to the highlands of the Rift Valley, APECK has established
                    a presence that truly represents the diversity of Kenya's
                    Pentecostal and Evangelical community.
                  </p>
                  <p className="transform transition-all duration-500 hover:translate-x-2">
                    Over the past <span className="font-semibold text-[#8B2332]">15 years</span>, we have facilitated hundreds of
                    training programs, provided mentorship to emerging leaders,
                    and created a supportive community where clergy can grow,
                    learn, and thrive in their calling. Our training initiatives
                    have covered topics ranging from biblical exegesis and theological
                    studies to practical ministry skills including counseling,
                    leadership development, financial management, and community
                    engagement. We've organized <span className="font-semibold text-[#7A7A3F]">250+ workshops</span>, <span className="font-semibold text-[#8B2332]">47 annual
                    conferences</span>, and numerous online learning opportunities.
                  </p>
                  <p className="transform transition-all duration-500 hover:translate-x-2">
                    Our impact extends beyond training. APECK has facilitated
                    partnerships with international organizations, securing resources
                    and expertise to enhance our programs. We've launched initiatives
                    supporting clergy welfare, including health insurance programs,
                    emergency relief funds, and professional development scholarships.
                    Our advocacy efforts have seen us engage with government bodies
                    on matters affecting religious freedom, clergy welfare, and
                    community development.
                  </p>
                  <p className="transform transition-all duration-500 hover:translate-x-2">
                    The association has been instrumental in establishing
                    mentorship programs that pair experienced clergy with emerging
                    leaders. These relationships have resulted in <span className="font-semibold text-[#7A7A3F]">300+ mentorship
                    pairings</span>, creating pathways for knowledge transfer and
                    spiritual growth. Through our networking events, regional
                    conferences, and digital platforms, clergy members have found
                    lasting friendships, ministry partnerships, and collaborative
                    opportunities.
                  </p>
                  <p className="transform transition-all duration-500 hover:translate-x-2">
                    Today, APECK stands as a beacon of unity, excellence, and
                    impact in the Kenyan church landscape, continuing to fulfill
                    our mission of empowering clergy for Kingdom impact. We remain
                    committed to our founding principles while adapting to the
                    changing needs of ministry in the 21st century. Our vision for
                    the future includes expanded training facilities, increased
                    digital resources, enhanced member services, and deeper community
                    engagement across all regions of Kenya. We believe that empowered,
                    equipped, and united clergy are essential for the transformation
                    of our nation and the advancement of God's Kingdom.
                  </p>
                </div>
              </div>
            </div>
            
            <div 
              className="relative transform transition-all duration-700"
              data-animate-id="history-image"
            >
              <div className={`${isVisible['history-image'] ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'}`}>
                <div className="relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800" 
                    alt="Church gathering" 
                    className="rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#8B2332]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#7A7A3F]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Corner accents */}
                  <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-white/30 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-white/30 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
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

      {/* Mission & Vision */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden">
        {/* Enhanced background graphics */}
        <DottedPattern opacity={0.04} size="28px" />
        <DottedPattern opacity={0.02} size="40px" className="mix-blend-multiply" />
        <GeometricPattern opacity={0.03} />
        <CirclePattern position="top-left" size={300} />
        <CirclePattern position="bottom-right" size={280} />
        
        {/* Blur effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B2332]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7A7A3F]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        {/* Abstract shapes */}
        <AbstractShape position="left" color="#8B2332" />
        <AbstractShape position="right" color="#7A7A3F" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Mission Card */}
            <div 
              className="transform transition-all duration-700"
              data-animate-id="mission"
            >
              <div className={`bg-gradient-to-br from-[#8B2332] via-[#7B1F32] to-[#6B1A28] text-white p-8 md:p-12 rounded-3xl shadow-2xl hover:shadow-[0_20px_60px_rgba(139,34,50,0.4)] transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] relative overflow-hidden group ${
                isVisible['mission'] ? 'opacity-100 translate-y-0 scale-100 rotate-0' : 'opacity-0 translate-y-12 scale-90 rotate-2'
              }`}>
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}></div>
                
                {/* Icon with enhanced styling */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse-slow"></div>
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center relative z-10 border-2 border-white/30 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <TargetIcon size={40} className="group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Our Mission</h2>
                <p className="text-lg text-white/90 leading-relaxed relative z-10">
                  To empower, equip, and unite Pentecostal and Evangelical clergy
                  across Kenya through comprehensive training, spiritual
                  development, and collaborative ministry initiatives that advance
                  the Kingdom of God and transform communities.
                </p>
                
                {/* Decorative corner accents */}
                <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-white/20 rounded-tr-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-white/20 rounded-bl-3xl"></div>
              </div>
            </div>

            {/* Vision Card */}
            <div 
              className="transform transition-all duration-700"
              data-animate-id="vision"
            >
              <div className={`bg-gradient-to-br from-[#7A7A3F] via-[#6A6A35] to-[#5A5A2D] text-white p-8 md:p-12 rounded-3xl shadow-2xl hover:shadow-[0_20px_60px_rgba(122,122,63,0.4)] transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] relative overflow-hidden group ${
                isVisible['vision'] ? 'opacity-100 translate-y-0 scale-100 rotate-0' : 'opacity-0 translate-y-12 scale-90 -rotate-2'
              }`} style={{ transitionDelay: '150ms' }}>
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}></div>
                
                {/* Icon with enhanced styling */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse-slow"></div>
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center relative z-10 border-2 border-white/30 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <EyeIcon size={40} className="group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Our Vision</h2>
                <p className="text-lg text-white/90 leading-relaxed relative z-10">
                  A Kenya where every Pentecostal and Evangelical clergy member is
                  fully equipped, spiritually vibrant, and effectively leading
                  transformative ministries that impact individuals, families, and
                  communities for Christ.
                </p>
                
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-white/20 rounded-tl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-white/20 rounded-br-3xl"></div>
              </div>
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

      {/* Core Values */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
        {/* Enhanced background graphics */}
        <DottedPattern opacity={0.04} size="32px" />
        <DottedPattern opacity={0.02} size="48px" />
        <GeometricPattern opacity={0.03} />
        <CirclePattern position="top-right" size={320} />
        <CirclePattern position="bottom-left" size={300} />
        
        {/* Additional decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-48 h-48 opacity-3 hidden lg:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.15"/>
          </svg>
        </div>
        <div className="absolute bottom-1/4 left-1/4 w-44 h-44 opacity-3 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,0 Q 80,25 80,60 Q 80,95 50,85 Q 20,95 20,60 Q 20,25 50,0 Z"
              fill="#7A7A3F"
              opacity="0.15"
            />
          </svg>
        </div>
        
        {/* Blur effects */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#8B2332]/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#7A7A3F]/3 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="text-center mb-16 md:mb-20 transform transition-all duration-700"
            data-animate-id="values-header"
          >
            <div className={`${isVisible['values-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 text-[#8B2332] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20">
                  OUR VALUES
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#8B2332] mb-4 leading-tight">
                Core Values
              </h2>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: HeartIcon, title: 'Spiritual Excellence', description: 'Pursuing the highest standards in spiritual life and ministry practice', color: '#8B2332' },
              { icon: AwardIcon, title: 'Integrity', description: 'Maintaining the highest ethical standards in all our dealings', color: '#7A7A3F' },
              { icon: TargetIcon, title: 'Unity', description: 'Fostering collaboration and partnership among clergy and ministries', color: '#8B2332' },
              { icon: EyeIcon, title: 'Empowerment', description: 'Equipping clergy with tools and resources for effective ministry', color: '#7A7A3F' }
            ].map((value, index) => {
              const Icon = value.icon;
              const delay = index * 150;
              return (
                <div 
                  key={index}
                  className="transform transition-all duration-700"
                  data-animate-id={`value-${index}`}
                  style={{ transitionDelay: isVisible[`value-${index}`] ? `${delay}ms` : '0ms' }}
                >
                  <div className={`bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] relative border border-gray-100 group h-full ${
                    isVisible[`value-${index}`] ? 'opacity-100 translate-y-0 scale-100 rotate-0' : 'opacity-0 translate-y-12 scale-90 rotate-2'
                  }`}>
                    {/* Dotted pattern overlay */}
                    <div className="absolute inset-0 rounded-3xl opacity-[0.02]" style={{
                      backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}></div>
                    
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent to-[#8B2332]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Icon container */}
                    <div className="relative mb-6 flex justify-center">
                      <div className="relative">
                        <div 
                          className="absolute inset-0 rounded-full blur-xl transition-all"
                          style={{ 
                            backgroundColor: value.color === '#8B2332' ? 'rgba(139, 34, 50, 0.2)' : 'rgba(122, 122, 63, 0.2)'
                          }}
                        ></div>
                        <div 
                          className={`relative w-20 h-20 rounded-full flex items-center justify-center border-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${
                            value.color === '#8B2332' ? 'bg-gradient-to-br from-[#8B2332]/15 to-[#8B2332]/8 border-[#8B2332]/20 group-hover:border-[#8B2332]/40' : 'bg-gradient-to-br from-[#7A7A3F]/15 to-[#7A7A3F]/8 border-[#7A7A3F]/20 group-hover:border-[#7A7A3F]/40'
                          }`}
                        >
                          <Icon 
                            size={36} 
                            className="group-hover:scale-110 transition-transform"
                            style={{ color: value.color }}
                          />
                        </div>
                        {/* Decorative dots */}
                        <div 
                          className="absolute -top-2 -right-2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all"
                          style={{ backgroundColor: value.color }}
                        ></div>
                        <div 
                          className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all"
                          style={{ backgroundColor: value.color }}
                        ></div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-[#8B2332] mb-4 text-center group-hover:text-[#6B1A28] transition-colors relative z-10">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed relative z-10">
                      {value.description}
                    </p>
                    
                    {/* Decorative corners */}
                    <div 
                      className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ borderColor: `${value.color}33` }}
                    ></div>
                    <div 
                      className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ borderColor: `${value.color}33` }}
                    ></div>
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
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Leadership */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden">
        {/* Enhanced background graphics */}
        <DottedPattern opacity={0.04} size="32px" />
        <GeometricPattern opacity={0.03} />
        <CirclePattern position="top-left" size={350} />
        <CirclePattern position="bottom-right" size={380} />
        
        {/* Blur effects */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#8B2332]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#7A7A3F]/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="text-center mb-16 md:mb-20 transform transition-all duration-700"
            data-animate-id="leadership-header"
          >
            <div className={`${isVisible['leadership-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 text-[#8B2332] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20">
                  LEADERSHIP
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#8B2332] mb-4 leading-tight">
                Our Leadership
              </h2>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                Experienced leaders committed to serving the clergy community
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[
              { name: 'Bishop David Kimani', role: 'National Chairman', description: 'Leading APECK with vision and passion for clergy empowerment', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' },
              { name: 'Rev. Peter Omondi', role: 'General Secretary', description: 'Coordinating programs and member services across Kenya', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
              { name: 'Pastor James Mwangi', role: 'Training Director', description: 'Overseeing all training and development initiatives', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
              { name: 'Rev. Dr. Sarah Kariuki', role: 'Deputy Chairperson', description: 'Supporting organizational leadership and strategic planning', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400' },
              { name: 'Pastor Grace Wanjiku', role: 'Finance Director', description: 'Managing financial resources and budget planning', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400' },
              { name: 'Bishop Samuel Otieno', role: 'Programs Coordinator', description: 'Coordinating outreach and community development programs', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400' },
              { name: 'Rev. Michael Njoroge', role: 'Membership Director', description: 'Overseeing member recruitment and retention strategies', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
              { name: 'Pastor Jane Akinyi', role: 'Communications Director', description: 'Managing media relations and public communications', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' },
              { name: 'Rev. Dr. Daniel Mwaura', role: 'Research & Development', description: 'Leading theological research and policy development', image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400' }
            ].map((leader, index) => {
              const delay = index * 150;
              return (
                <div 
                  key={index}
                  className="transform transition-all duration-700"
                  data-animate-id={`leader-${index}`}
                  style={{ transitionDelay: isVisible[`leader-${index}`] ? `${delay}ms` : '0ms' }}
                >
                  <div className={`bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] relative border border-gray-100 group ${
                    isVisible[`leader-${index}`] ? 'opacity-100 translate-y-0 scale-100 rotate-0' : 'opacity-0 translate-y-12 scale-90 rotate-2'
                  }`}>
                    {/* Dotted pattern overlay */}
                    <div className="absolute inset-0 rounded-3xl opacity-[0.02]" style={{
                      backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}></div>
                    
                    {/* Image container */}
                    <div className="relative overflow-hidden">
                      <img 
                        src={leader.image} 
                        alt={leader.name} 
                        className="w-full h-64 md:h-72 object-cover transform group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Decorative corner */}
                      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-white/30 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 md:p-8 text-center relative z-10">
                      <h3 className="text-xl md:text-2xl font-bold text-[#8B2332] mb-2 group-hover:text-[#6B1A28] transition-colors">
                        {leader.name}
                      </h3>
                      <p className="text-[#7A7A3F] font-semibold mb-3 md:mb-4 text-sm md:text-base">
                        {leader.role}
                      </p>
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                        {leader.description}
                      </p>
                      
                      {/* Decorative accent line */}
                      <div className="mt-4 h-0.5 bg-gradient-to-r from-transparent via-[#8B2332]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    {/* Decorative corners */}
                    <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#8B2332]/10 rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>;
}