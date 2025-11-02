import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon, ChevronRight, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    {
    path: '/',
    label: 'Home'
    },
    {
    path: '/about',
    label: 'About Us'
    },
    {
    path: '/programs',
    label: 'Programs'
    },
    {
    path: '/membership',
    label: 'Membership'
    },
    {
    path: '/news',
    label: 'News & Events'
    },
    {
    path: '/gallery',
    label: 'Gallery'
    },
    {
    path: '/contact',
    label: 'Contact'
    }
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/98 dark:bg-gray-900/98 backdrop-blur-md shadow-xl border-b border-gray-100 dark:border-gray-800' 
          : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none hidden lg:block">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        ></div>
      </div>

      {/* Decorative gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B2332]/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 md:space-x-4 group relative z-10"
          >
            <div className="relative">
              <img 
                src="/assets/logo1.png" 
                alt="APECK Logo" 
                className="w-14 h-14 md:w-16 md:h-16 object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-2 drop-shadow-lg filter brightness-110" 
              />
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-[#8B2332]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] md:text-xs text-[#8B2332] dark:text-[#B85C6D] font-bold leading-tight">Association of</span>
              <span className="text-[#8B2332] dark:text-[#B85C6D] font-bold text-xs md:text-sm leading-tight">PENTECOSTAL &</span>
              <span className="text-[#8B2332] dark:text-[#B85C6D] font-bold text-xs md:text-sm leading-tight">EVANGELICAL</span>
              <span className="text-[#8B2332] dark:text-[#B85C6D] font-bold text-xs md:text-sm leading-tight">CLERGY OF KENYA</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`relative px-3 py-1.5 text-xs md:text-sm font-semibold transition-all duration-300 rounded-lg group ${
                    isActive 
                      ? 'text-[#8B2332] dark:text-[#B85C6D]' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-[#8B2332] dark:hover:text-[#B85C6D]'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Active indicator background */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8B2332]/10 via-[#8B2332]/15 to-[#8B2332]/10 rounded-lg -z-10"></div>
                  )}
                  
                  <span className="relative z-10">{link.label}</span>
                  
                  {/* Underline animation */}
                  <span 
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8B2332] via-[#7A7A3F] to-[#8B2332] transition-all duration-500 rounded-full ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                  
                  {/* Hover background */}
                  <div className="absolute inset-0 bg-[#8B2332]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </Link>
              );
            })}
          </div>

          {/* Dark Mode Toggle & CTA Button */}
          <div className="hidden lg:flex items-center space-x-3 ml-6">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 group"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <SunIcon size={18} className="transition-transform group-hover:rotate-180 duration-500" />
              ) : (
                <MoonIcon size={18} className="transition-transform group-hover:-rotate-12 duration-300" />
              )}
            </button>
            
            <Link 
              to="/membership" 
              className="relative px-5 py-2 bg-gradient-to-r from-[#8B2332] via-[#7A2332] to-[#8B2332] text-white rounded-full font-semibold text-xs md:text-sm transition-all duration-300 hover:shadow-xl hover:shadow-[#8B2332]/25 hover:scale-105 group overflow-hidden"
            >
              {/* Shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              
              <span className="relative z-10 flex items-center space-x-2">
                <span>Join Us</span>
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-[#8B2332] rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <SunIcon size={20} />
              ) : (
                <MoonIcon size={20} />
              )}
            </button>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className={`relative p-2 rounded-lg transition-all duration-300 z-50 ${
                isMobileMenuOpen 
                  ? 'bg-[#8B2332] text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Toggle menu"
            >
            <div className="relative w-6 h-6 flex items-center justify-center">
              {isMobileMenuOpen ? (
                <XIcon size={24} className="animate-scale-in" />
              ) : (
                <MenuIcon size={24} className="animate-scale-in" />
              )}
            </div>
          </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden absolute top-full left-0 right-0 bg-white/98 dark:bg-gray-900/98 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 shadow-2xl transition-all duration-500 overflow-hidden ${
          isMobileMenuOpen 
            ? 'max-h-[600px] opacity-100' 
            : 'max-h-0 opacity-0'
        }`}
      >
        {/* Mobile menu background pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          ></div>
        </div>

        <div className="relative px-4 py-6 space-y-2">
          {navLinks.map((link, index) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path} 
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 relative group ${
                  isActive 
                    ? 'text-[#8B2332] dark:text-[#B85C6D] bg-gradient-to-r from-[#8B2332]/10 via-[#8B2332]/15 to-[#8B2332]/10 dark:from-[#B85C6D]/10 dark:via-[#B85C6D]/15 dark:to-[#B85C6D]/10' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-[#8B2332] dark:hover:text-[#B85C6D] hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: isMobileMenuOpen ? 'fade-in-up 0.5s ease-out forwards' : 'none'
                }}
              >
                <span className="relative z-10 flex items-center justify-between">
                  <span>{link.label}</span>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-[#8B2332]"></div>
                  )}
                </span>
                
                {/* Left border indicator for active */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8B2332] to-[#7A7A3F] rounded-l-xl"></div>
                )}
              </Link>
            );
          })}
          
          {/* Mobile CTA Button */}
          <Link 
            to="/membership" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full mt-4 px-5 py-3 bg-gradient-to-r from-[#8B2332] via-[#7A2332] to-[#8B2332] text-white rounded-xl font-semibold text-sm text-center transition-all duration-300 hover:shadow-xl hover:shadow-[#8B2332]/25 hover:scale-[1.02] relative overflow-hidden group"
          >
            {/* Shimmer effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <span>Join Us</span>
              <ChevronRight size={18} />
            </span>
            </Link>
          </div>
      </div>
    </nav>
  );
}
