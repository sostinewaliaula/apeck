import { useEffect, useState, useRef, memo, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CalendarIcon, ArrowLeftIcon, ArrowRightIcon, UserIcon, Share2Icon, Loader2 } from 'lucide-react';
import { fetchNewsArticle, fetchNewsList, PublicNewsArticle, PublicNewsSummary } from '../lib/news';
import { resolveMediaUrl } from '../lib/media';

const NEWS_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
};

function formatNewsDate(value?: string) {
  if (!value) return 'Latest update';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Latest update';
  return date.toLocaleDateString(undefined, NEWS_DATE_FORMAT);
}

function splitBodyContent(body?: string) {
  if (!body) return [];
  return body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [currentRelatedSlide, setCurrentRelatedSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [article, setArticle] = useState<PublicNewsArticle | null>(null);
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);
  const [articleError, setArticleError] = useState<string | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<PublicNewsSummary[]>([]);

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
    if (!slug) return;
    let isMounted = true;
    setIsLoadingArticle(true);
    fetchNewsArticle(slug)
      .then((data) => {
        if (!isMounted) return;
        setArticle(data);
        setArticleError(null);
      })
      .catch(() => {
        if (!isMounted) return;
        setArticle(null);
        setArticleError('News article not found.');
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingArticle(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    let isMounted = true;
    fetchNewsList({ limit: 6 })
      .then((items) => {
        if (!isMounted) return;
        const filtered = items.filter((item) => item.slug !== slug).slice(0, 6);
        setRelatedArticles(filtered);
      })
      .catch(() => {
        if (isMounted) {
          setRelatedArticles([]);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Available images 4-9
  const availableImages = ['/assets/image4.jpg', '/assets/image5.jpg', '/assets/image6.jpg', '/assets/image7.jpg', '/assets/image8.jpg', '/assets/image9.jpg'];
  
  // Function to get random image from available images
  const getRandomImage = () => {
    return availableImages[Math.floor(Math.random() * availableImages.length)];
  };

  const heroImage = resolveMediaUrl(article?.heroImageUrl) || getRandomImage();
  const articleParagraphs = splitBodyContent(article?.body);
  const articleCategory = 'News';
  const articleDate = formatNewsDate(article?.publishedAt);
  const articleAuthor = 'APECK Communications';
  const articleReadingTime = article?.readingTime ?? '';
  const relatedCards = relatedArticles.map((news) => ({
    id: news.id,
    slug: news.slug,
    image: resolveMediaUrl(news.heroImageUrl) || getRandomImage(),
    date: formatNewsDate(news.publishedAt),
    title: news.title,
    category: 'News',
  }));

  // Auto-scroll related articles carousel
  useEffect(() => {
    if (!article || relatedArticles.length <= 3 || isPaused) return;
    
    const length = relatedArticles.length;
    const timer = setInterval(() => {
      setCurrentRelatedSlide((prev) => (prev + 1) % length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [article, relatedArticles.length, isPaused]);

  if (isLoadingArticle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF7F2] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] transition-colors duration-300">
        <Loader2 className="animate-spin text-[#8B2332] dark:text-[#B85C6D]" size={48} />
      </div>
    );
  }

  if (articleError || !article) {
    return (
      <div className="relative w-full bg-gradient-to-b from-[#FBF7F2] via-[#F5F1EB] to-[#EFE7DE] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] pt-20 min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-300">
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
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl font-bold text-[#8B2332] dark:text-[#B85C6D] mb-4">News Article Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{articleError ?? "The article you're looking for doesn't exist."}</p>
          <Link to="/news" className="px-6 py-3 bg-[#8B2332] dark:bg-[#B85C6D] text-white rounded-full font-semibold hover:bg-[#6B1A28] dark:hover:bg-[#C96D7E] transition-all inline-flex items-center space-x-2">
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
      <section className="relative py-16 md:py-24 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
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
              {articleCategory}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-6 text-white/90">
            <div className="flex items-center space-x-2">
              <CalendarIcon size={18} />
              <span>{articleDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <UserIcon size={18} />
              <span>{articleAuthor}</span>
            </div>
            {articleReadingTime && (
              <div className="flex items-center space-x-2">
                <span>{articleReadingTime}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#FEFAF4] via-[#F6F0E8]/70 to-[#F1E5D9] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] overflow-hidden transition-colors duration-300">
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
            {articleParagraphs.map((paragraph, index) => (
              <p 
                key={index}
                className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-lg"
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
      {relatedCards.length > 0 && (
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#FDFBF7] via-white to-[#F6F0E8] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] overflow-hidden transition-colors duration-300">
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
                {relatedCards.length > 3 ? (
                  <div 
                    className="flex gap-8 transition-transform duration-700 ease-in-out"
                    style={{
                      transform: `translateX(calc(-${(currentRelatedSlide * 100) / cardsPerView}% - ${currentRelatedSlide * 2}rem))`
                    }}
                  >
                    {relatedCards.map((news) => (
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
                    {relatedCards.map((news) => (
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
              {relatedCards.length > 3 && (
                <>
                  <button
                    onClick={() => setCurrentRelatedSlide(prev => 
                      prev === 0 ? relatedCards.length - 1 : prev - 1
                    )}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-20"
                    aria-label="Previous article"
                  >
                    <ArrowLeftIcon size={24} className="text-[#8B2332] dark:text-[#B85C6D]" />
                  </button>
                  <button
                    onClick={() => setCurrentRelatedSlide(prev => 
                      (prev + 1) % relatedCards.length
                    )}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-20"
                    aria-label="Next article"
                  >
                    <ArrowRightIcon size={24} className="text-[#8B2332] dark:text-[#B85C6D]" />
                  </button>
                </>
              )}

              {/* Carousel Indicators */}
              {relatedCards.length > 3 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  {relatedCards.map((_, index) => (
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
    </div>
  );
}

