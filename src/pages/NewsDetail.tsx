import { useEffect, useState, useRef, memo, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CalendarIcon, ArrowLeftIcon, ArrowRightIcon, UserIcon, TagIcon, Share2Icon } from 'lucide-react';

export function NewsDetail() {
  const { newsId } = useParams<{ newsId: string }>();
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [currentRelatedSlide, setCurrentRelatedSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

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

  // Available images 4-9
  const availableImages = ['/assets/image4.jpg', '/assets/image5.jpg', '/assets/image6.jpg', '/assets/image7.jpg', '/assets/image8.jpg', '/assets/image9.jpg'];
  
  // Function to get random image from available images
  const getRandomImage = () => {
    return availableImages[Math.floor(Math.random() * availableImages.length)];
  };

  // News data with detailed content
  const newsData: { [key: string]: {
    id: number;
    image: string;
    date: string;
    title: string;
    category: string;
    author: string;
    readTime: string;
    content: string[];
    related: number[];
  } } = {
    'annual-leadership-conference-2024': {
      id: 1,
      image: getRandomImage(),
      date: 'December 15, 2024',
      title: 'Annual Leadership Conference 2024',
      category: 'Conference',
      author: 'APECK Communications',
      readTime: '5 min read',
      content: [
        'We are thrilled to announce our flagship Annual Leadership Conference 2024, set to take place from December 18-20, 2024 at the Kenyatta International Convention Centre (KICC) in Nairobi. This three-day gathering promises to be a transformative experience for clergy leaders across Kenya and beyond.',
        'With over 500 registered participants expected, this year\'s conference will focus on "Empowering Leaders for Kingdom Impact in the 21st Century." The event will feature powerful teaching sessions, practical workshops, and networking opportunities designed to equip and inspire ministry leaders.',
        'Our keynote speakers include renowned ministry leaders from across Africa, bringing decades of experience in church leadership, community development, and biblical scholarship. Topics will cover essential areas such as:',
        'The conference will also include special sessions on youth ministry, women in leadership, and practical ministry tools. Evening sessions will feature worship, prayer, and fellowship opportunities.',
        'Early bird registration is now open, with special rates available for APECK members. Don\'t miss this opportunity to be part of what promises to be a landmark event in our ministry calendar.'
      ],
      related: [2, 4, 5]
    },
    'new-pastoral-care-certification-program': {
      id: 2,
      image: getRandomImage(),
      date: 'December 10, 2024',
      title: 'New Pastoral Care Certification Program',
      category: 'Program',
      author: 'APECK Training Department',
      readTime: '4 min read',
      content: [
        'APECK is excited to announce the launch of our comprehensive Pastoral Care and Biblical Counseling Certification Program, scheduled to begin in January 2025. This intensive 6-month program is designed to equip clergy with essential skills in pastoral care, crisis counseling, and biblical counseling.',
        'The program will be delivered through a combination of in-person workshops, online modules, and supervised practical experience. Participants will learn from experienced counselors and pastoral care specialists, gaining both theoretical knowledge and hands-on skills.',
        'Key components of the certification program include:',
        'The program is limited to 30 participants per cohort to ensure personalized attention and quality training. Applications are now open, with priority given to APECK members. Successful completion of the program will result in a recognized certification that can enhance ministry effectiveness and credibility.',
        'This initiative represents APECK\'s commitment to providing practical, applicable training that addresses real-world ministry challenges. We believe that equipped leaders can better serve their congregations and communities.'
      ],
      related: [1, 3, 5]
    },
    'community-outreach-initiative-success': {
      id: 3,
      image: getRandomImage(),
      date: 'December 5, 2024',
      title: 'Community Outreach Initiative Success',
      category: 'Outreach',
      author: 'APECK Outreach Coordinator',
      readTime: '6 min read',
      content: [
        'We are delighted to report the outstanding success of our latest Community Outreach Initiative, which concluded last month. Through the collective efforts of APECK member churches across 10 counties, we reached over 5,000 families with essential support and services.',
        'The initiative, launched in September 2024, focused on addressing critical needs in underserved communities. Our network of churches mobilized resources and volunteers to provide food security, medical assistance, educational support, and spiritual care to families facing various challenges.',
        'Key achievements of the initiative include:',
        'The success of this initiative demonstrates the power of collaborative ministry. When churches work together under the APECK umbrella, we can achieve far more than any single congregation could accomplish alone.',
        'We extend our heartfelt gratitude to all participating churches, volunteers, and donors who made this initiative possible. Your commitment to serving communities reflects the heart of the Gospel and demonstrates the positive impact of united ministry efforts.',
        'Plans are already underway for the next phase of community outreach initiatives in 2025, with expanded reach and additional services planned.'
      ],
      related: [2, 6]
    },
    'leadership-workshop-series-announced': {
      id: 4,
      image: getRandomImage(),
      date: 'November 28, 2024',
      title: 'Leadership Workshop Series Announced',
      category: 'Workshop',
      author: 'APECK Leadership Development',
      readTime: '3 min read',
      content: [
        'Starting January 2025, APECK will launch a monthly Leadership Workshop Series designed to provide ongoing development opportunities for clergy leaders at all stages of ministry.',
        'These workshops will cover a wide range of practical leadership topics, delivered by experienced ministry leaders and professional trainers. Each workshop is designed to be immediately applicable to daily ministry contexts.',
        'The series will include sessions on:',
        'Each workshop will be held on the last Saturday of the month at the APECK Training Center in Nairobi, with options for online participation for members outside the capital. Registration for individual workshops or the entire series is now open.',
        'This initiative reflects our commitment to continuous learning and leadership development. We believe that effective leaders are lifelong learners, and these workshops provide accessible opportunities for growth and skill enhancement.'
      ],
      related: [1, 5]
    },
    'youth-ministry-training-success': {
      id: 5,
      image: getRandomImage(),
      date: 'November 20, 2024',
      title: 'Youth Ministry Training Success',
      category: 'Training',
      author: 'APECK Youth Division',
      readTime: '5 min read',
      content: [
        'We celebrate the successful completion of our Intensive Youth Ministry Training Program, with over 200 youth leaders graduating from the program last month. The graduation ceremony, held at the APECK Training Center in Nairobi, was a joyful celebration of commitment and achievement.',
        'The 3-month intensive program equipped youth leaders with essential skills in youth ministry, discipleship, event planning, and crisis management. Participants came from churches across Kenya, representing diverse backgrounds and ministry contexts.',
        'Program highlights included:',
        'Feedback from graduates has been overwhelmingly positive, with many reporting increased confidence and effectiveness in their youth ministry roles. Several graduates have already implemented new programs and initiatives in their home churches.',
        'The success of this training program demonstrates the importance of specialized training for youth ministry. Young people face unique challenges in today\'s world, and they need leaders who are equipped, engaged, and committed to their spiritual growth.',
        'Applications for the next cohort, starting in March 2025, will open in January. We encourage all churches with youth ministry to consider sending their youth leaders for this transformative training experience.'
      ],
      related: [1, 4]
    },
    'new-regional-chapters-launched': {
      id: 6,
      image: getRandomImage(),
      date: 'November 15, 2024',
      title: 'New Regional Chapters Launched',
      category: 'Announcement',
      author: 'APECK Administration',
      readTime: '4 min read',
      content: [
        'APECK is proud to announce the launch of three new regional chapters, expanding our reach and ability to serve clergy across Kenya. The new chapters are located in Western Kenya, Coast Region, and Rift Valley.',
        'This expansion represents a significant milestone in APECK\'s growth and our commitment to making ministry support and training accessible to clergy throughout the country. Each regional chapter will have its own leadership team and will organize local events, training sessions, and networking opportunities.',
        'The regional chapters will provide:',
        'The launch events for each regional chapter will take place over the coming months, with opportunities for local clergy to join APECK and get involved in chapter activities. These chapters will work in coordination with the national office to ensure consistent service delivery and support for members.',
        'This expansion brings the total number of APECK regional chapters to 8, covering all major regions of Kenya. We are excited about the opportunities this presents for reaching more clergy and making a greater impact on ministry across the nation.',
        'Clergy interested in joining or learning more about these new regional chapters are encouraged to contact the APECK office or visit our regional chapter pages on the website.'
      ],
      related: [3, 1]
    }
  };

  // Get all news for related articles (moved before hooks)
  const allNews = [
    { id: 1, slug: 'annual-leadership-conference-2024', image: getRandomImage(), date: 'December 15, 2024', title: 'Annual Leadership Conference 2024', category: 'Conference' },
    { id: 2, slug: 'new-pastoral-care-certification-program', image: getRandomImage(), date: 'December 10, 2024', title: 'New Pastoral Care Certification Program', category: 'Program' },
    { id: 3, slug: 'community-outreach-initiative-success', image: getRandomImage(), date: 'December 5, 2024', title: 'Community Outreach Initiative Success', category: 'Outreach' },
    { id: 4, slug: 'leadership-workshop-series-announced', image: getRandomImage(), date: 'November 28, 2024', title: 'Leadership Workshop Series Announced', category: 'Workshop' },
    { id: 5, slug: 'youth-ministry-training-success', image: getRandomImage(), date: 'November 20, 2024', title: 'Youth Ministry Training Success', category: 'Training' },
    { id: 6, slug: 'new-regional-chapters-launched', image: getRandomImage(), date: 'November 15, 2024', title: 'New Regional Chapters Launched', category: 'Announcement' }
  ];

  // Get current news article
  const currentNews = newsId ? newsData[newsId] : null;
  
  // Get related news (moved after early return check would be better, but we need it for useEffect)
  const relatedNews = currentNews ? allNews.filter(news => currentNews.related.includes(news.id)) : [];

  // Auto-scroll related articles carousel
  useEffect(() => {
    if (!currentNews || relatedNews.length <= 3 || isPaused) return;
    
    const length = relatedNews.length;
    const timer = setInterval(() => {
      setCurrentRelatedSlide((prev) => (prev + 1) % length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [currentNews, relatedNews.length, isPaused]);

  if (!currentNews) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#8B2332] dark:text-[#B85C6D] mb-4">News Article Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The article you're looking for doesn't exist.</p>
          <Link to="/news" className="px-6 py-3 bg-[#8B2332] text-white rounded-full font-semibold hover:bg-[#6B1A28] transition-all inline-flex items-center space-x-2">
            <ArrowLeftIcon size={20} />
            <span>Back to News</span>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate cards per view based on screen size (handled via CSS, but need for transform)
  const cardsPerView = 3; // Desktop shows 3 cards

  return (
    <div className="w-full bg-white dark:bg-gray-900 pt-20">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${currentNews.image})`,
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
        
        {/* Additional decorative geometric shapes */}
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
        
        {/* More floating shapes */}
        <div className="absolute top-1/3 right-1/6 w-36 h-36 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,8 92,50 50,92 8,50" fill="#ffffff" opacity="0.08"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/3 left-1/6 w-32 h-32 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,0 L 100,86.6 L 50,100 L 0,86.6 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              opacity="0.1"
            />
          </svg>
        </div>
        
        {/* Blur effects for depth */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/3 rounded-full blur-3xl"></div>
        
        {/* Decorative lines */}
        <div className="absolute top-1/2 left-0 w-px h-56 bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/2 right-0 w-px h-56 bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block"></div>
        
        {/* Floating decorative dots */}
        <div className="absolute top-16 left-10 w-2.5 h-2.5 bg-white/20 rounded-full hidden md:block"></div>
        <div className="absolute top-24 right-12 w-2 h-2 bg-white/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-20 left-12 w-2 h-2 bg-white/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-28 right-10 w-2.5 h-2.5 bg-white/20 rounded-full hidden md:block"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back button */}
          <Link 
            to="/news" 
            className="inline-flex items-center space-x-2 text-white/90 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeftIcon size={20} className="transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to News</span>
          </Link>

          {/* Category Badge */}
          <div className="inline-block mb-6">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-bold uppercase tracking-wider border border-white/20">
              {currentNews.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6 leading-tight">
            {currentNews.title}
          </h1>

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-6 text-white/90">
            <div className="flex items-center space-x-2">
              <CalendarIcon size={18} />
              <span>{currentNews.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <UserIcon size={18} />
              <span>{currentNews.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>{currentNews.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-16 md:py-24 bg-white dark:bg-gray-900 overflow-hidden">
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
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="prose prose-lg max-w-none prose-headings:text-[#8B2332] dark:prose-headings:text-[#B85C6D] prose-p:text-gray-700 dark:prose-p:text-gray-300">
            {currentNews.content.map((paragraph, index) => (
              <p 
                key={index}
                className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-lg"
                data-animate-id={`content-${index}`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-gray-600 dark:text-gray-400 font-semibold">Share this article:</span>
              <button className="flex items-center space-x-2 px-4 py-2 bg-[#8B2332]/10 dark:bg-[#B85C6D]/10 text-[#8B2332] dark:text-[#B85C6D] rounded-full hover:bg-[#8B2332]/20 dark:hover:bg-[#B85C6D]/20 transition-colors">
                <Share2Icon size={18} className="text-[#8B2332] dark:text-[#B85C6D]" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <section className="relative py-16 md:py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
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
          
          {/* Floating decorative dots */}
          <div className="absolute top-16 left-10 w-2.5 h-2.5 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
          <div className="absolute top-24 right-12 w-2 h-2 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
          <div className="absolute bottom-20 left-12 w-2 h-2 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
          <div className="absolute bottom-28 right-10 w-2.5 h-2.5 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
          
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
            </svg>
          </div>
          
          <div className="absolute bottom-1/4 right-0 w-52 h-52 opacity-5">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="75" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.22"/>
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
            <h2 className="text-xl md:text-2xl font-bold text-[#8B2332] dark:text-[#B85C6D] mb-12 text-center">
              Related Articles
            </h2>
            
            {/* Carousel Container */}
            <div 
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div 
                ref={carouselRef}
                className="overflow-hidden"
              >
                {relatedNews.length > 3 ? (
                  <div 
                    className="flex gap-8 transition-transform duration-700 ease-in-out"
                    style={{
                      transform: `translateX(calc(-${(currentRelatedSlide * 100) / cardsPerView}% - ${currentRelatedSlide * 2}rem))`
                    }}
                  >
                    {relatedNews.map((news) => (
                      <Link
                        key={news.id}
                        to={`/news/${news.slug}`}
                        className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 group min-w-full sm:min-w-[calc(50%-1rem)] md:min-w-[calc(33.333%-1.5rem)] flex-shrink-0 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={news.image} 
                            alt={news.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                          />
                          <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm text-[#8B2332] dark:text-[#B85C6D] rounded-full text-xs font-bold uppercase">
                            {news.category}
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center space-x-2 text-sm text-[#7A7A3F] dark:text-[#9B9B5F] font-semibold mb-3">
                            <CalendarIcon size={14} />
                            <span>{news.date}</span>
                          </div>
                          <h3 className="text-xl font-bold text-[#8B2332] dark:text-[#B85C6D] mb-3 group-hover:text-[#6B1A28] transition-colors line-clamp-2">
                            {news.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-[#8B2332] dark:text-[#B85C6D] font-semibold group-hover:text-[#7A7A3F] dark:group-hover:text-[#9B9B5F] transition-colors">
                            <span>Read More</span>
                            <ArrowRightIcon size={16} className="transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-8">
                    {relatedNews.map((news) => (
                      <Link
                        key={news.id}
                        to={`/news/${news.slug}`}
                        className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 group border border-gray-100 dark:border-gray-700"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={news.image} 
                            alt={news.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                          />
                          <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm text-[#8B2332] dark:text-[#B85C6D] rounded-full text-xs font-bold uppercase">
                            {news.category}
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center space-x-2 text-sm text-[#7A7A3F] dark:text-[#9B9B5F] font-semibold mb-3">
                            <CalendarIcon size={14} />
                            <span>{news.date}</span>
                          </div>
                          <h3 className="text-xl font-bold text-[#8B2332] dark:text-[#B85C6D] mb-3 group-hover:text-[#6B1A28] transition-colors line-clamp-2">
                            {news.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-[#8B2332] dark:text-[#B85C6D] font-semibold group-hover:text-[#7A7A3F] dark:group-hover:text-[#9B9B5F] transition-colors">
                            <span>Read More</span>
                            <ArrowRightIcon size={16} className="transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Buttons (only show if more than 3 items) */}
              {relatedNews.length > 3 && (
                <>
                  <button
                    onClick={() => setCurrentRelatedSlide(prev => 
                      prev === 0 ? relatedNews.length - 1 : prev - 1
                    )}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-20"
                    aria-label="Previous article"
                  >
                    <ArrowLeftIcon size={24} className="text-[#8B2332] dark:text-[#B85C6D]" />
                  </button>
                  <button
                    onClick={() => setCurrentRelatedSlide(prev => 
                      (prev + 1) % relatedNews.length
                    )}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-20"
                    aria-label="Next article"
                  >
                    <ArrowRightIcon size={24} className="text-[#8B2332] dark:text-[#B85C6D]" />
                  </button>
                </>
              )}

              {/* Carousel Indicators */}
              {relatedNews.length > 3 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  {relatedNews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentRelatedSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                        index === currentRelatedSlide
                          ? 'w-3 h-3 bg-[#8B2332] dark:bg-[#B85C6D]'
                          : 'w-2 h-2 bg-[#8B2332]/30 dark:bg-[#B85C6D]/30 hover:bg-[#8B2332]/50 dark:hover:bg-[#B85C6D]/50'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

