import { useEffect, useState } from 'react';
import { ArrowUpIcon } from 'lucide-react';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group backdrop-blur-sm border-2 border-white/20"
      aria-label="Scroll to top"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-[#8B2332] rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
      
      {/* Arrow icon */}
      <ArrowUpIcon 
        size={24} 
        className="md:w-7 md:h-7 transform transition-transform duration-300 group-hover:-translate-y-1" 
        strokeWidth={2.5}
      />
      
      {/* Pulse ring on hover */}
      <div className="absolute inset-0 rounded-full border-2 border-white/30 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"></div>
    </button>
  );
}

