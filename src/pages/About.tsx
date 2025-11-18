import { useEffect, useState, useRef, memo, useMemo } from 'react';
import { TargetIcon, EyeIcon, HeartIcon, AwardIcon, XIcon } from 'lucide-react';
import { fetchPageContent } from '../lib/pageContent';
import { resolveMediaUrl } from '../lib/media';

type AboutHeroContent = {
  badgeLabel?: string;
  title?: string;
  description?: string;
  backgroundImage?: string;
};

type AboutStoryContent = {
  badgeLabel?: string;
  title?: string;
  image?: string;
  paragraphs?: Array<{ text?: string }>;
};

type MissionVisionContent = {
  missionTitle?: string;
  missionDescription?: string;
  missionIcon?: string;
  visionTitle?: string;
  visionDescription?: string;
  visionIcon?: string;
};

type ValuesSectionContent = {
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

type LeadershipSectionContent = {
  badgeLabel?: string;
  title?: string;
  description?: string;
  leaders?: Array<{
    name?: string;
    role?: string;
    description?: string;
    image?: string;
    detailedBio?: string;
  }>;
};

const defaultHeroContent: Required<AboutHeroContent> = {
  badgeLabel: 'ABOUT US',
  title: 'About APECK',
  description:
    'Building a unified community of Pentecostal and Evangelical clergy dedicated to excellence in ministry and Kingdom impact',
  backgroundImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=75',
};

const defaultStoryContent = {
  badgeLabel: 'OUR STORY',
  title: 'Our Story',
  image: '/assets/image1.jpg',
  paragraphs: [
    'APECK was founded in **2009** by a group of visionary clergy leaders who recognized the urgent need for a unified platform to support, empower, and connect Pentecostal and Evangelical ministers across Kenya. These founding members, representing diverse denominations and regions, shared a common vision: to create an organization that would bridge divides, foster collaboration, and elevate the standards of clergy practice nationwide.',
    'The initial meetings took place in Nairobi, where **15 founding pastors** gathered to discuss the challenges facing clergy in Kenya. They identified critical gaps in training, support systems, and networking opportunities. From these humble beginnings, APECK was officially registered as a national association, establishing its first headquarters in the capital city.',
    'What began as a small gathering of passionate pastors has grown into a national movement representing over **1,500 clergy members** from all **47 counties** of Kenya. Our growth has been marked by strategic expansion into regional chapters, each led by dedicated coordinators who understand the unique ministry contexts of their areas.',
    'Over the past **15 years**, we have facilitated hundreds of training programs, provided mentorship to emerging leaders, and created a supportive community where clergy can grow, learn, and thrive in their calling. Our training initiatives have covered topics ranging from biblical exegesis and theological studies to practical ministry skills including counseling, leadership development, financial management, and community engagement. We\'ve organized **250+ workshops**, **47 annual conferences**, and numerous online learning opportunities.',
    'Our impact extends beyond training. APECK has facilitated partnerships with international organizations, securing resources and expertise to enhance our programs. We\'ve launched initiatives supporting clergy welfare, including health insurance programs, emergency relief funds, and professional development scholarships. Our advocacy efforts have seen us engage with government bodies on matters affecting religious freedom, clergy welfare, and community development.',
    'The association has been instrumental in establishing mentorship programs that pair experienced clergy with emerging leaders. These relationships have resulted in **300+ mentorship pairings**, creating pathways for knowledge transfer and spiritual growth. Through our networking events, regional conferences, and digital platforms, clergy members have found lasting friendships, ministry partnerships, and collaborative opportunities.',
    'Today, APECK stands as a beacon of unity, excellence, and impact in the Kenyan church landscape, continuing to fulfill our mission of empowering clergy for Kingdom impact. We remain committed to our founding principles while adapting to the changing needs of ministry in the 21st century.',
  ],
};

const defaultMissionVision = {
  missionTitle: 'Our Mission',
  missionDescription:
    'To empower, equip, and unite Pentecostal and Evangelical clergy across Kenya through comprehensive training, spiritual development, and collaborative ministry initiatives.',
  missionIcon: 'target',
  visionTitle: 'Our Vision',
  visionDescription:
    'A Kenya where every Pentecostal and Evangelical clergy member is fully equipped, spiritually vibrant, and effectively leading transformative ministries that impact communities for Christ.',
  visionIcon: 'eye',
};

const defaultValuesSection = {
  badgeLabel: 'OUR VALUES',
  title: 'Core Values',
  description: 'The principles that guide everything we do',
  items: [
    {
      title: 'Spiritual Excellence',
      description: 'Pursuing the highest standards in spiritual life and ministry practice',
      icon: 'heart',
      color: '#8B2332',
    },
    {
      title: 'Integrity',
      description: 'Maintaining the highest ethical standards in all our dealings',
      icon: 'award',
      color: '#7A7A3F',
    },
    {
      title: 'Unity',
      description: 'Fostering collaboration and partnership among clergy and ministries',
      icon: 'target',
      color: '#8B2332',
    },
    {
      title: 'Empowerment',
      description: 'Equipping clergy with tools and resources for effective ministry',
      icon: 'eye',
      color: '#7A7A3F',
    },
  ],
};

const defaultLeadershipSection = {
  badgeLabel: 'LEADERSHIP',
  title: 'Our Leadership',
  description: 'Experienced leaders committed to serving the clergy community',
  leaders: [
    {
      name: 'Apostle Peter Chacha',
      role: 'Founder and Lead Minister',
      description: 'Founder and Lead Minister of The Anointed of God Ministries, National Treasurer Church and clergy Association of Kenya',
      image: '/assets/image1.jpg',
      detailedBio: `Apostle Peter Chacha is the Founder and Lead Minister of The Anointed of God Ministries, National Treasurer Church and clergy Association of Kenya, Director of a consultancy firm "Paradigm Signature" and Director Christway School of Missions" in Kenya East Africa. Apostle Peter is also a trained professional mediator and a Life coach. His Apostolic ministry has touched many lives in Kenya, other African countries, Jamaica, Canada and the United States of America.

He teaches and ministers in conferences, seminars, crusades and miracle services. His ministry has been a great blessing to the body of Christ.

He holds a Diploma in public Relations & personnel Administration, Diploma in Advanced pastoral studies, Bachelor of Arts in Biblical studies, masters in Biblical studies and PhD in Leadership, Administration & Management and Honorary Doctorate degree in Divinity. He is also a registered and licensed counselor and psychologist by ministry of Health in Kenya.

Apostle Chacha has a passion for missions and has been in the frontline in spiritual warfare. God uses him to minister to the sick and the spiritually oppressed. He pastors a local church in nakuru, and oversees several branches across kenya.

He's married to his lovely wife Anne and together are blessed with three sons. Apostle Chacha and his family live and minister in Nakuru Kenya, East Africa.`,
    },
    {
      name: 'Bishop David Kimani',
      role: 'National Chairman',
      description: 'Leading APECK with vision and passion for clergy empowerment',
      image: '/assets/image2.jpg',
    },
    {
      name: 'Rev. Peter Omondi',
      role: 'General Secretary',
      description: 'Coordinating programs and member services across Kenya',
      image: '/assets/image3.jpg',
    },
  ],
};

const ABOUT_ICON_MAP = {
  target: TargetIcon,
  eye: EyeIcon,
  heart: HeartIcon,
  award: AwardIcon,
};

const highlightParagraph = (text: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((chunk, index) => {
    if (chunk.startsWith('**') && chunk.endsWith('**')) {
      return (
        <span key={index} className="font-semibold text-[#8B2332] dark:text-[#B85C6D]">
          {chunk.replace(/\*\*/g, '')}
        </span>
      );
    }
    return <span key={index}>{chunk}</span>;
  });

const toMediaUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('/assets') || url.startsWith('http')) {
    return url;
  }
  return resolveMediaUrl(url);
};

export function About() {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [sectionContent, setSectionContent] = useState<Record<string, unknown>>({});
  const [selectedLeader, setSelectedLeader] = useState<{
    name: string;
    role: string;
    description: string;
    image: string;
    detailedBio?: string;
  } | null>(null);

  // Memoized Dotted pattern background component
  const DottedPattern = memo(({ className = '', size = '24px', opacity = 0.03 }: { className?: string; size?: string; opacity?: number }) => (
    <div className={`absolute inset-0 ${className}`} style={{
      backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
      backgroundSize: `${size} ${size}`,
      opacity: opacity,
      willChange: 'opacity',
    }}></div>
  ));
  DottedPattern.displayName = 'DottedPattern';

  // Memoized Geometric pattern component
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

  // Memoized Abstract shape component
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
    let isMounted = true;
    fetchPageContent('about')
      .then((page) => {
        if (!isMounted) return;
        const sections: Record<string, unknown> = {};
        page.sections?.forEach((section) => {
          sections[section.key] = section.content;
        });
        setSectionContent(sections);
      })
      .catch(() => {
        /* fall back to defaults */
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const updates: { [key: string]: boolean } = {};
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-animate-id');
            if (id && !isVisible[id]) {
              updates[id] = true;
              // Unobserve after first intersection for better performance
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

  const heroContent = sectionContent['about_hero'] as AboutHeroContent | undefined;
  const heroBackgroundImage =
    heroContent?.backgroundImage?.trim()
      ? toMediaUrl(heroContent.backgroundImage.trim())
      : defaultHeroContent.backgroundImage;
  const heroBadgeLabel = heroContent?.badgeLabel?.trim() || defaultHeroContent.badgeLabel;
  const heroTitle = heroContent?.title?.trim() || defaultHeroContent.title;
  const heroDescription = heroContent?.description?.trim() || defaultHeroContent.description;

  const storySection = sectionContent['about_story'] as AboutStoryContent | undefined;
  const storyBadgeLabel = storySection?.badgeLabel?.trim() || defaultStoryContent.badgeLabel;
  const storyTitle = storySection?.title?.trim() || defaultStoryContent.title;
  const storyImage =
    storySection?.image?.trim() ? toMediaUrl(storySection.image.trim()) : defaultStoryContent.image;
  const storyParagraphs =
    storySection?.paragraphs?.map((item) => item.text?.trim()).filter(Boolean) ??
    defaultStoryContent.paragraphs;
  const storyFirstParagraphs = storyParagraphs.slice(0, 2);
  const storyLaterParagraphs = storyParagraphs.slice(2);

  const missionVisionSection = sectionContent['about_mission_vision'] as MissionVisionContent | undefined;
  const missionTitle = missionVisionSection?.missionTitle?.trim() || defaultMissionVision.missionTitle;
  const missionDescription =
    missionVisionSection?.missionDescription?.trim() || defaultMissionVision.missionDescription;
  const missionIconName = (missionVisionSection?.missionIcon ?? defaultMissionVision.missionIcon).toLowerCase();
  const MissionIcon =
    ABOUT_ICON_MAP[missionIconName as keyof typeof ABOUT_ICON_MAP] ?? TargetIcon;

  const visionTitle = missionVisionSection?.visionTitle?.trim() || defaultMissionVision.visionTitle;
  const visionDescription =
    missionVisionSection?.visionDescription?.trim() || defaultMissionVision.visionDescription;
  const visionIconName = (missionVisionSection?.visionIcon ?? defaultMissionVision.visionIcon).toLowerCase();
  const VisionIcon =
    ABOUT_ICON_MAP[visionIconName as keyof typeof ABOUT_ICON_MAP] ?? EyeIcon;

  const valuesSection = sectionContent['about_values'] as ValuesSectionContent | undefined;
  const valuesBadge = valuesSection?.badgeLabel?.trim() || defaultValuesSection.badgeLabel;
  const valuesTitle = valuesSection?.title?.trim() || defaultValuesSection.title;
  const valuesDescription =
    valuesSection?.description?.trim() || defaultValuesSection.description;
  const valueItems =
    valuesSection?.items?.map((item) => ({
      title: item.title?.trim() || '',
      description: item.description?.trim() || '',
      icon: item.icon?.trim()?.toLowerCase() || 'heart',
      color: item.color?.trim() || '#8B2332',
    })).filter((item) => item.title && item.description) ?? defaultValuesSection.items;

  // Leadership section - fully CMS-controlled including detailedBio
  const leadershipSection = sectionContent['about_leadership'] as LeadershipSectionContent | undefined;
  const leadershipBadge =
    leadershipSection?.badgeLabel?.trim() || defaultLeadershipSection.badgeLabel;
  const leadershipTitle =
    leadershipSection?.title?.trim() || defaultLeadershipSection.title;
  const leadershipDescription =
    leadershipSection?.description?.trim() || defaultLeadershipSection.description;
  // Leaders with detailedBio will be clickable and show a modal
  const leaders =
    leadershipSection?.leaders?.map((leader) => ({
      name: leader.name?.trim() || '',
      role: leader.role?.trim() || '',
      description: leader.description?.trim() || '',
      image: leader.image?.trim() ? toMediaUrl(leader.image.trim()) : '',
      detailedBio: leader.detailedBio?.trim() || '', // CMS-controlled: if provided, card becomes clickable
    })).filter((leader) => leader.name && leader.role) ?? defaultLeadershipSection.leaders.map((leader) => ({
      ...leader,
      detailedBio: leader.detailedBio || '',
    }));

  return <div className="w-full bg-white dark:bg-gray-900 pt-20 transition-colors duration-300">
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
                  {heroBadgeLabel}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {heroTitle}
              </h1>
              <p className="text-sm md:text-base text-white/90 max-w-3xl leading-relaxed">
                {heroDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#8B2332] to-white dark:to-gray-900 transition-colors duration-300">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0,0 Q400,50 600,40 T1200,50 L1200,100 L0,100 Z" fill="currentColor" className="text-white dark:text-gray-900"/>
        </svg>
      </div>

      {/* History - Moved to second section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#FEFAF4] via-[#F6F0E8]/70 to-[#F1E5D9] dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900 overflow-hidden transition-colors duration-300">
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
          <div 
            className="transform transition-all duration-700"
            data-animate-id="history-text"
          >
            <div className={`${isVisible['history-text'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              {/* Badge and Title */}
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 dark:from-[#B85C6D]/15 dark:via-[#B85C6D]/20 dark:to-[#B85C6D]/15 text-[#8B2332] dark:text-[#B85C6D] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20 dark:border-[#B85C6D]/20">
                  {storyBadgeLabel}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#8B2332] dark:text-[#B85C6D] mb-6 md:mb-8 leading-tight">
                {storyTitle}
              </h2>
              
              {/* Text content with image floating inside */}
              <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                {storyFirstParagraphs.map((paragraph, index) => (
                  <p key={`story-top-${index}`} className="transform transition-all duration-500 hover:translate-x-2">
                    {highlightParagraph(paragraph)}
                  </p>
                ))}
                
                {storyImage && (
                  <div 
                    className="relative transform transition-all duration-700 my-8 md:my-12"
                    data-animate-id="history-image"
                  >
                    <div className={`md:float-right md:ml-8 mb-6 md:mb-8 w-full md:w-96 lg:w-[420px] mx-auto md:mx-0 ${isVisible['history-image'] ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'}`}>
                      <div className="relative group">
                        <img 
                          src={storyImage}
                          loading="lazy" 
                          alt="APECK history" 
                          className="rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-700 w-full" 
                          style={{ willChange: 'transform' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                        
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#8B2332]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#7A7A3F]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-white/30 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-white/30 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {storyLaterParagraphs.map((paragraph, index) => (
                  <p key={`story-bottom-${index}`} className="transform transition-all duration-500 hover:translate-x-2">
                    {highlightParagraph(paragraph)}
                  </p>
                ))}
              </div>
              
              {/* Clear float to prevent layout issues */}
              <div className="clear-both"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="currentColor" className="text-gray-50 dark:text-gray-800"/>
          </svg>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="relative py-20 md:py-32 bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-300">
        {/* Enhanced background graphics - multiple layers */}
        <DottedPattern opacity={0.04} size="32px" />
        <DottedPattern opacity={0.02} size="48px" className="mix-blend-multiply" />
        <GeometricPattern opacity={0.025} />
        <GeometricPattern opacity={0.015} className="rotate-45" />
        
        {/* Circle patterns in corners */}
        <CirclePattern position="top-left" size={400} />
        <CirclePattern position="top-right" size={350} />
        <CirclePattern position="bottom-left" size={380} />
        <CirclePattern position="bottom-right" size={320} />
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#8B2332" />
        <AbstractShape position="bottom" color="#7A7A3F" />
        <AbstractShape position="left" color="#8B2332" />
        <AbstractShape position="right" color="#7A7A3F" />
        
        {/* Subtle circular graphics in corners */}
        <div className="absolute top-0 left-0 w-64 h-64 opacity-6">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.3"/>
            <circle cx="100" cy="100" r="70" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.2"/>
            <circle cx="100" cy="100" r="50" fill="none" stroke="#8B2332" strokeWidth="0.6" opacity="0.15"/>
          </svg>
        </div>
        
        <div className="absolute top-0 right-0 w-56 h-56 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.25"/>
            <circle cx="100" cy="100" r="65" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.2"/>
          </svg>
        </div>
        
        <div className="absolute bottom-0 left-0 w-60 h-60 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.25"/>
            <circle cx="100" cy="100" r="60" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.18"/>
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-0 w-52 h-52 opacity-4">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="75" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.3"/>
            <circle cx="100" cy="100" r="55" fill="none" stroke="#8B2332" strokeWidth="0.7" opacity="0.2"/>
          </svg>
        </div>
        
        {/* Geometric shapes scattered */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-4 hidden lg:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,5 95,50 50,95 5,50" fill="#8B2332" opacity="0.1"/>
            <polygon points="50,20 80,50 50,80 20,50" fill="#7A7A3F" opacity="0.08"/>
          </svg>
        </div>
        
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-36 h-36 opacity-4 hidden lg:block">
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
        
        <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 translate-y-1/2 w-38 h-38 opacity-4 hidden lg:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,10 90,50 50,90 10,50" fill="#8B2332" opacity="0.1"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/3 right-1/3 translate-x-1/2 translate-y-1/2 w-34 h-34 opacity-4 hidden lg:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 75,100 25,100 0,50" fill="#7A7A3F" opacity="0.1"/>
          </svg>
        </div>
        
        {/* Blur effects for depth */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#8B2332]/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#7A7A3F]/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8B2332]/2 rounded-full blur-3xl"></div>
        
        {/* Decorative lines */}
        <div className="absolute top-1/2 left-0 w-px h-48 bg-gradient-to-b from-transparent via-[#8B2332]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/2 right-0 w-px h-48 bg-gradient-to-b from-transparent via-[#7A7A3F]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#8B2332]/8 to-transparent hidden lg:block"></div>
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/8 to-transparent hidden lg:block"></div>
        
        {/* Floating decorative dots */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute top-32 right-16 w-2 h-2 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-24 left-20 w-2.5 h-2.5 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-32 right-12 w-3 h-3 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        <div className="absolute top-1/2 left-8 -translate-y-1/2 w-2 h-2 bg-[#8B2332]/15 rounded-full hidden lg:block"></div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 w-2.5 h-2.5 bg-[#7A7A3F]/15 rounded-full hidden lg:block"></div>
        
        {/* Additional organic shapes */}
        <div className="absolute top-0 left-1/3 -translate-x-1/2 w-80 h-80 opacity-4 hidden xl:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M 100,20 Q 160,40 180,100 Q 160,160 100,140 Q 40,160 20,100 Q 40,40 100,20 Z"
              fill="#8B2332"
              opacity="0.06"
            />
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-1/3 translate-x-1/2 w-72 h-72 opacity-4 hidden xl:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M 60,60 Q 100,20 140,60 Q 180,100 140,140 Q 100,180 60,140 Q 20,100 60,60 Z"
              fill="#7A7A3F"
              opacity="0.07"
            />
          </svg>
        </div>
        
        {/* Corner decorative elements */}
        <div className="absolute top-0 left-0 w-24 h-24 opacity-3 hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="0,0 100,0 50,50" fill="#8B2332" opacity="0.08"/>
            <polygon points="0,0 50,50 0,100" fill="#7A7A3F" opacity="0.06"/>
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-0 w-28 h-28 opacity-3 hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="100,100 0,100 50,50" fill="#8B2332" opacity="0.08"/>
            <polygon points="100,100 50,50 100,0" fill="#7A7A3F" opacity="0.06"/>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 max-w-6xl mx-auto">
            {/* Mission Card */}
            <div 
              className="transform transition-all duration-700"
              data-animate-id="mission"
            >
              <div className={`bg-[#8B2332] text-white p-8 md:p-10 lg:p-12 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden group ${
                isVisible['mission'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`}>
                {/* Icon - white outline on transparent circle background */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    {/* Transparent lighter maroon circle background */}
                    <div className="w-24 h-24 bg-[#8B2332]/40 rounded-full flex items-center justify-center">
                      {/* White outline target icon */}
                      <MissionIcon 
                        size={48} 
                        className="text-white"
                        strokeWidth={2.5}
                        fill="none"
                      />
                    </div>
                  </div>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">{missionTitle}</h2>
                <p className="text-xs md:text-sm text-white leading-relaxed">
                  {missionDescription}
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div 
              className="transform transition-all duration-700"
              data-animate-id="vision"
            >
              <div className={`bg-[#7A7A3F] text-white p-8 md:p-10 lg:p-12 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden group ${
                isVisible['vision'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`} style={{ transitionDelay: '150ms' }}>
                {/* Icon - white outline on transparent circle background */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    {/* Transparent lighter olive green circle background */}
                    <div className="w-24 h-24 bg-[#7A7A3F]/40 rounded-full flex items-center justify-center">
                      {/* White outline eye icon */}
                      <VisionIcon 
                        size={48} 
                        className="text-white"
                        strokeWidth={2.5}
                        fill="none"
                      />
                    </div>
                  </div>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">{visionTitle}</h2>
                <p className="text-xs md:text-sm text-white leading-relaxed">
                  {visionDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="currentColor" className="text-gray-50 dark:text-gray-800"/>
          </svg>
        </div>
      </div>

      {/* Core Values */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#FEFAF4] via-[#F6F0E8]/70 to-[#F1E5D9] dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 overflow-hidden transition-colors duration-300">
        {/* Enhanced background graphics - multiple layers */}
        <DottedPattern opacity={0.04} size="32px" />
        <DottedPattern opacity={0.02} size="48px" className="mix-blend-multiply" />
        <GeometricPattern opacity={0.025} />
        <GeometricPattern opacity={0.015} className="rotate-45" />
        
        {/* Circle patterns in all corners */}
        <CirclePattern position="top-left" size={380} />
        <CirclePattern position="top-right" size={350} />
        <CirclePattern position="bottom-left" size={360} />
        <CirclePattern position="bottom-right" size={340} />
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#8B2332" />
        <AbstractShape position="bottom" color="#7A7A3F" />
        
        {/* Additional decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-48 h-48 opacity-4 hidden lg:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.15"/>
            <polygon points="50,15 85,50 50,85 15,50" fill="#7A7A3F" opacity="0.12"/>
          </svg>
        </div>
        <div className="absolute bottom-1/4 left-1/4 w-44 h-44 opacity-4 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,0 Q 80,25 80,60 Q 80,95 50,85 Q 20,95 20,60 Q 20,25 50,0 Z"
              fill="#7A7A3F"
              opacity="0.15"
            />
          </svg>
        </div>
        
        <div className="absolute top-1/3 left-1/5 w-40 h-40 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,5 95,50 50,95 5,50" fill="#8B2332" opacity="0.1"/>
          </svg>
        </div>
        <div className="absolute bottom-1/3 right-1/5 w-36 h-36 opacity-3 hidden xl:block">
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
        <div className="absolute top-1/2 left-0 w-px h-56 bg-gradient-to-b from-transparent via-[#8B2332]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/2 right-0 w-px h-56 bg-gradient-to-b from-transparent via-[#7A7A3F]/10 to-transparent hidden lg:block"></div>
        
        {/* Floating decorative dots */}
        <div className="absolute top-16 left-12 w-3 h-3 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute top-24 right-20 w-2 h-2 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-20 left-16 w-2.5 h-2.5 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-28 right-14 w-3 h-3 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-2 h-2 bg-[#8B2332]/15 rounded-full hidden lg:block"></div>
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-2.5 h-2.5 bg-[#7A7A3F]/15 rounded-full hidden lg:block"></div>
        
        {/* Organic shapes */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-72 h-72 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M 100,20 Q 160,40 180,100 Q 160,160 100,140 Q 40,160 20,100 Q 40,40 100,20 Z"
              fill="#8B2332"
              opacity="0.06"
            />
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-68 h-68 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M 60,60 Q 100,20 140,60 Q 180,100 140,140 Q 100,180 60,140 Q 20,100 60,60 Z"
              fill="#7A7A3F"
              opacity="0.07"
            />
          </svg>
        </div>
        
        {/* Corner decorative elements */}
        <div className="absolute top-0 left-0 w-28 h-28 opacity-3 hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="0,0 100,0 50,50" fill="#8B2332" opacity="0.08"/>
            <polygon points="0,0 50,50 0,100" fill="#7A7A3F" opacity="0.06"/>
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-3 hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="100,100 0,100 50,50" fill="#8B2332" opacity="0.08"/>
            <polygon points="100,100 50,50 100,0" fill="#7A7A3F" opacity="0.06"/>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="text-center mb-16 md:mb-20 transform transition-all duration-700"
            data-animate-id="values-header"
          >
            <div className={`${isVisible['values-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 dark:from-[#B85C6D]/15 dark:via-[#B85C6D]/20 dark:to-[#B85C6D]/15 text-[#8B2332] dark:text-[#B85C6D] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20 dark:border-[#B85C6D]/20">
                  {valuesBadge}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#8B2332] mb-4 leading-tight">
                {valuesTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                {valuesDescription}
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {valueItems.map((value, index) => {
              const Icon = ABOUT_ICON_MAP[value.icon as keyof typeof ABOUT_ICON_MAP] ?? HeartIcon;
              const delay = index * 150;
              const accentColor = value.color || '#8B2332';
              return (
                <div 
                  key={index}
                  className="transform transition-all duration-700"
                  data-animate-id={`value-${index}`}
                  style={{ transitionDelay: isVisible[`value-${index}`] ? `${delay}ms` : '0ms' }}
                >
                  <div className={`bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-[1.03] relative border border-gray-100 dark:border-gray-700 group h-full overflow-hidden ${
                    isVisible[`value-${index}`] ? 'opacity-100 translate-y-0 scale-100 rotate-0' : 'opacity-0 translate-y-12 scale-90 rotate-2'
                  }`}>
                    {/* Enhanced dotted pattern overlay */}
                    <div className="absolute inset-0 rounded-3xl opacity-[0.03]" style={{
                      backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}></div>
                    
                    {/* Gradient overlay on hover */}
                    <div 
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(to bottom right, transparent, ${value.color === '#8B2332' ? 'rgba(139, 34, 50, 0.08)' : 'rgba(122, 122, 63, 0.08)'})`
                      }}
                    ></div>
                    
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{
                      background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                      backgroundSize: '200% 200%',
                      animation: 'shimmer 2s infinite',
                    }}></div>
                    
                    {/* Icon container with enhanced styling */}
                    <div className="relative mb-6 flex justify-center">
                      <div className="relative">
                        {/* Animated glow effect */}
                        <div 
                          className="absolute inset-0 rounded-full blur-xl animate-pulse-slow transition-all group-hover:scale-125"
                          style={{ 
                            backgroundColor: `${accentColor}40`,
                          }}
                        ></div>
                        <div 
                          className="relative w-24 h-24 rounded-full flex items-center justify-center border-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.08), transparent)',
                            borderColor: `${accentColor}40`,
                          }}
                        >
                          <Icon 
                            size={40} 
                            className="group-hover:scale-110 transition-transform duration-300"
                            style={{ color: accentColor }}
                            strokeWidth={2.5}
                          />
                        </div>
                        {/* Enhanced decorative dots */}
                        <div 
                          className="absolute -top-3 -right-3 w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 shadow-lg"
                          style={{ backgroundColor: value.color }}
                        ></div>
                        <div 
                          className="absolute -bottom-3 -left-3 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 shadow-lg"
                          style={{ backgroundColor: value.color }}
                        ></div>
                        <div 
                          className="absolute top-0 -right-6 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
                          style={{ backgroundColor: value.color }}
                        ></div>
                        <div 
                          className="absolute bottom-0 -left-6 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
                          style={{ backgroundColor: value.color }}
                        ></div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-center transition-colors duration-300 relative z-10"
                      style={{ color: accentColor }}>
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed relative z-10 text-sm md:text-base">
                      {value.description}
                    </p>
                    
                    {/* Enhanced decorative corners */}
                    <div 
                      className="absolute top-0 right-0 w-24 h-24 border-t-3 border-r-3 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ borderColor: `${accentColor}40` }}
                    ></div>
                    <div 
                      className="absolute bottom-0 left-0 w-20 h-20 border-b-3 border-l-3 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ borderColor: `${accentColor}40` }}
                    ></div>
                    
                    {/* Bottom accent line */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-b-3xl"
                      style={{ color: accentColor }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="currentColor" className="text-white dark:text-gray-800"/>
          </svg>
        </div>
      </div>

      {/* Leadership */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-white via-gray-50/30 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900 overflow-hidden transition-colors duration-300">
        {/* Enhanced background graphics - multiple layers */}
        <DottedPattern opacity={0.04} size="32px" />
        <DottedPattern opacity={0.02} size="48px" className="mix-blend-multiply" />
        <GeometricPattern opacity={0.025} />
        <GeometricPattern opacity={0.015} className="rotate-45" />
        
        {/* Circle patterns in all corners */}
        <CirclePattern position="top-left" size={400} />
        <CirclePattern position="top-right" size={360} />
        <CirclePattern position="bottom-left" size={380} />
        <CirclePattern position="bottom-right" size={350} />
        
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
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#8B2332]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#7A7A3F]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8B2332]/3 rounded-full blur-3xl"></div>
        
        {/* Decorative lines */}
        <div className="absolute top-1/2 left-0 w-px h-64 bg-gradient-to-b from-transparent via-[#8B2332]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/2 right-0 w-px h-64 bg-gradient-to-b from-transparent via-[#7A7A3F]/10 to-transparent hidden lg:block"></div>
        
        {/* Floating decorative dots */}
        <div className="absolute top-24 left-16 w-3 h-3 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute top-32 right-24 w-2 h-2 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-28 left-20 w-2.5 h-2.5 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-36 right-18 w-3 h-3 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        <div className="absolute top-1/2 left-12 -translate-y-1/2 w-2 h-2 bg-[#8B2332]/15 rounded-full hidden lg:block"></div>
        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-2.5 h-2.5 bg-[#7A7A3F]/15 rounded-full hidden lg:block"></div>
        
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="text-center mb-16 md:mb-20 transform transition-all duration-700"
            data-animate-id="leadership-header"
          >
            <div className={`${isVisible['leadership-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 dark:from-[#B85C6D]/15 dark:via-[#B85C6D]/20 dark:to-[#B85C6D]/15 text-[#8B2332] dark:text-[#B85C6D] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20 dark:border-[#B85C6D]/20">
                  {leadershipBadge}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#8B2332] mb-4 leading-tight">
                {leadershipTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                {leadershipDescription}
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {leaders.map((leader, index) => {
              const delay = index * 150;
              const leaderImage = leader.image || '/assets/image1.jpg';
              return (
                <div 
                  key={index}
                  className="transform transition-all duration-700"
                  data-animate-id={`leader-${index}`}
                  style={{ transitionDelay: isVisible[`leader-${index}`] ? `${delay}ms` : '0ms' }}
                >
                  <div 
                    className={`bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-[1.03] relative border border-gray-100 dark:border-gray-700 group ${
                      leader.detailedBio ? 'cursor-pointer' : ''
                    } ${
                      isVisible[`leader-${index}`] ? 'opacity-100 translate-y-0 scale-100 rotate-0' : 'opacity-0 translate-y-12 scale-90 rotate-2'
                    }`}
                    onClick={() => leader.detailedBio && setSelectedLeader(leader)}
                  >
                    {/* Enhanced dotted pattern overlay */}
                    <div className="absolute inset-0 rounded-3xl opacity-[0.03]" style={{
                      backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}></div>
                    
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent to-[#8B2332]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                    
                    {/* Image container with enhanced styling */}
                    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                      {leaderImage ? (
                        <img 
                          src={leaderImage}
                          alt={leader.name}
                          loading="lazy"
                          className="w-full h-64 md:h-72 object-cover object-top transform group-hover:scale-105 transition-transform duration-700" 
                          style={{ willChange: 'transform' }}
                        />
                      ) : (
                        <div className="w-full h-64 md:h-72 bg-gray-200 dark:bg-gray-700" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Decorative corner with enhanced styling */}
                      <div className="absolute top-0 left-0 w-20 h-20 border-t-3 border-l-3 border-white/40 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg backdrop-blur-sm"></div>
                      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-white/30 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Floating badge effect */}
                      <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-[#8B2332]/90 backdrop-blur-sm rounded-full text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg">
                        Leader
                      </div>
                      {leader.detailedBio && (
                        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[#8B2332] text-xs font-semibold shadow-lg">
                          View Details
                        </div>
                      )}
                    </div>
                    
                    {/* Content with enhanced styling */}
                    <div className="p-6 md:p-8 text-center relative z-10">
                      <h3 className="text-xl md:text-2xl font-bold text-[#8B2332] dark:text-[#B85C6D] mb-2 group-hover:text-[#6B1A28] dark:group-hover:text-[#C96D7E] transition-colors duration-300">
                        {leader.name}
                      </h3>
                      <p className="text-[#7A7A3F] dark:text-[#9B9B5F] font-semibold mb-3 md:mb-4 text-sm md:text-base group-hover:text-[#6A6A35] dark:group-hover:text-[#8B8B4F] transition-colors duration-300">
                        {leader.role}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                        {leader.description}
                      </p>
                      
                    {/* Enhanced decorative accent line */}
                    <div className="mt-6 h-1 bg-gradient-to-r from-transparent via-[#8B2332]/30 dark:via-[#B85C6D]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                      
                      {/* Social/contact icons placeholder area */}
                      <div className="flex justify-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="w-8 h-8 rounded-full bg-[#8B2332]/10 dark:bg-[#B85C6D]/10 hover:bg-[#8B2332]/20 dark:hover:bg-[#B85C6D]/20 flex items-center justify-center transition-colors cursor-pointer">
                          <svg className="w-4 h-4 text-[#8B2332] dark:text-[#B85C6D]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#8B2332]/10 dark:bg-[#B85C6D]/10 hover:bg-[#8B2332]/20 dark:hover:bg-[#B85C6D]/20 flex items-center justify-center transition-colors cursor-pointer">
                          <img src="https://img.icons8.com/?size=100&id=fJp7hepMryiw&format=png&color=000000" alt="X" className="w-4 h-4" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#8B2332]/10 dark:bg-[#B85C6D]/10 hover:bg-[#8B2332]/20 dark:hover:bg-[#B85C6D]/20 flex items-center justify-center transition-colors cursor-pointer">
                          <svg className="w-4 h-4 text-[#8B2332] dark:text-[#B85C6D]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced decorative corners */}
                    <div className="absolute bottom-0 right-0 w-24 h-24 border-b-3 border-r-3 border-[#8B2332]/20 dark:border-[#B85C6D]/20 rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 border-b-3 border-l-3 border-[#7A7A3F]/15 dark:border-[#9B9B5F]/15 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8B2332]/20 dark:via-[#B85C6D]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-3xl"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leader Detail Modal */}
      {selectedLeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10" onClick={() => setSelectedLeader(null)}>
          <div 
            className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start p-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <div>
                <h3 className="text-2xl font-bold text-[#8B2332] dark:text-[#B85C6D]">
                  {selectedLeader.name}
                </h3>
                <p className="text-sm text-[#7A7A3F] dark:text-[#9B9B5F] mt-2 font-semibold">
                  {selectedLeader.role}
                </p>
              </div>
              <button
                onClick={() => setSelectedLeader(null)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close leader details"
              >
                <XIcon size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {selectedLeader.image && (
                <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden">
                  <img
                    src={selectedLeader.image}
                    alt={selectedLeader.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              )}

              {selectedLeader.description && (
                <div className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedLeader.description}
                  </p>
                </div>
              )}

              {selectedLeader.detailedBio && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-[#8B2332] dark:text-[#B85C6D]">
                    Biography
                  </h4>
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line space-y-4">
                    {selectedLeader.detailedBio.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-sm md:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>;
}