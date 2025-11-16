import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, YoutubeIcon, MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchPageContent } from '../lib/pageContent';
import { resolveMediaUrl } from '../lib/media';
export function Footer() {
  const [content, setContent] = useState<Record<string, unknown>>({});
  useEffect(() => {
    fetchPageContent('footer')
      .then((page) => {
        const map: Record<string, unknown> = {};
        page.sections?.forEach((s) => (map[s.key] = s.content));
        setContent(map);
      })
      .catch(() => {});
  }, []);
  return <footer className="relative bg-gradient-to-b from-[#FEFAF4] via-[#F6F0E8]/80 to-[#EFE4D7] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden transition-colors duration-300">
      {/* Enhanced background patterns */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
        <div style={{
          backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          width: '100%',
          height: '100%'
        }}></div>
      </div>
      
      {/* Additional geometric patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-geometric" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <polygon points="40,0 80,40 40,80 0,40" fill="none" stroke="#8B2332" strokeWidth="0.5" opacity="0.2"/>
              <polygon points="20,0 40,20 20,40 0,20" fill="none" stroke="#7A7A3F" strokeWidth="0.3" opacity="0.15"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-geometric)" />
        </svg>
      </div>
      
      {/* Blur effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B2332]/15 dark:bg-[#B85C6D]/10 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7A7A3F]/12 dark:bg-[#9B9B5F]/10 rounded-full blur-3xl opacity-50"></div>
      
      {/* Additional decorative graphics */}
      {/* Floating geometric shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 opacity-[0.04] hidden md:block">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.15"/>
          <polygon points="50,20 80,50 50,80 20,50" fill="#7A7A3F" opacity="0.12"/>
        </svg>
      </div>
      <div className="absolute top-20 right-20 w-40 h-40 opacity-[0.05] hidden lg:block animate-pulse-slow">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#8B2332" strokeWidth="0.5" opacity="0.2"/>
          <circle cx="50" cy="50" r="25" fill="none" stroke="#7A7A3F" strokeWidth="0.3" opacity="0.15"/>
        </svg>
      </div>
      <div className="absolute bottom-20 left-1/4 w-36 h-36 opacity-[0.04] hidden md:block">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M 50,0 Q 80,25 80,60 Q 80,95 50,85 Q 20,95 20,60 Q 20,25 50,0 Z"
            fill="#8B2332"
            opacity="0.15"
          />
        </svg>
      </div>
      <div className="absolute bottom-32 right-1/3 w-28 h-28 opacity-[0.03] hidden lg:block animate-float">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,10 90,50 50,90 10,50" fill="#7A7A3F" opacity="0.3"/>
        </svg>
      </div>
      
      {/* More dotted pattern clusters */}
      <div className="absolute top-1/4 left-0 w-64 h-64 opacity-[0.015]">
        <div style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          width: '100%',
          height: '100%'
        }}></div>
      </div>
      <div className="absolute bottom-1/4 right-0 w-72 h-72 opacity-[0.015]">
        <div style={{
          backgroundImage: 'radial-gradient(circle, #7A7A3F 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          width: '100%',
          height: '100%'
        }}></div>
      </div>
      
      {/* Decorative lines */}
      <div className="absolute top-1/2 left-0 w-px h-32 bg-gradient-to-b from-transparent via-[#8B2332]/10 dark:via-[#B85C6D]/10 to-transparent hidden lg:block"></div>
      <div className="absolute top-1/2 right-0 w-px h-32 bg-gradient-to-b from-transparent via-[#7A7A3F]/10 dark:via-[#9B9B5F]/10 to-transparent hidden lg:block"></div>
      
      {/* Top border separator with gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B2332]/20 dark:via-[#B85C6D]/20 via-[#7A7A3F]/15 dark:via-[#9B9B5F]/15 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-16 md:pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-12">
          {/* Logo and About Section */}
          <div className="lg:col-span-1">
            <div className="mb-6 w-full">
              <img 
                src={(content['footer_main'] as any)?.logo ? resolveMediaUrl((content['footer_main'] as any).logo) : '/assets/logo3.png'} 
                alt="APECK Logo" 
                className="w-full max-w-[280px] md:max-w-[320px] h-auto object-contain transition-all duration-300 hover:scale-105 hover:drop-shadow-2xl drop-shadow-lg filter brightness-110" 
              />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-6 leading-relaxed max-w-xs">
              {((content['footer_main'] as any)?.about || 'Empowering the Clergy for Kingdom Impact across Kenya')}
            </p>
            <div className="flex space-x-3">
              <a 
                href={((content['footer_main'] as any)?.facebook || '#')} 
                className="group w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#8B2332] dark:hover:bg-[#B85C6D] hover:text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-[#8B2332] dark:hover:border-[#B85C6D]"
              >
                <FacebookIcon size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href={((content['footer_main'] as any)?.x || '#')} 
                className="group w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#8B2332] dark:hover:bg-[#B85C6D] hover:text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-[#8B2332] dark:hover:border-[#B85C6D]"
                aria-label="X"
              >
                <img src="https://img.icons8.com/?size=100&id=fJp7hepMryiw&format=png&color=000000" alt="X" className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href={((content['footer_main'] as any)?.instagram || '#')} 
                className="group w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#8B2332] dark:hover:bg-[#B85C6D] hover:text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-[#8B2332] dark:hover:border-[#B85C6D]"
              >
                <InstagramIcon size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href={((content['footer_main'] as any)?.youtube || '#')} 
                className="group w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#8B2332] dark:hover:bg-[#B85C6D] hover:text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-[#8B2332] dark:hover:border-[#B85C6D]"
              >
                <YoutubeIcon size={20} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base md:text-lg mb-5 text-gray-800 dark:text-gray-200 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#7A7A3F] dark:from-[#9B9B5F] to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              {(((content['footer_main'] as any)?.quickLinks) || [
                { label: 'About Us', href: '/about' },
                { label: 'Programs', href: '/programs' },
                { label: 'Membership', href: '/membership' },
                { label: 'News & Events', href: '/news' },
              ]).map((lnk: any, idx: number) => (
                <li key={idx}>
                  <Link 
                    to={lnk.href || '#'}
                    className="text-gray-600 dark:text-gray-400 hover:text-[#8B2332] dark:hover:text-[#B85C6D] transition-all duration-300 inline-block hover:translate-x-2 group text-xs md:text-sm"
                  >
                    <span className="group-hover:border-b border-[#8B2332]/30 dark:border-[#B85C6D]/30">{lnk.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="font-bold text-base md:text-lg mb-5 text-gray-800 dark:text-gray-200 relative inline-block">
              Resources
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#7A7A3F] dark:from-[#9B9B5F] to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              {(((content['footer_main'] as any)?.resources) || [
                { label: 'Training Materials', href: '#' },
                { label: 'Publications', href: '#' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Contact', href: '/contact' },
              ]).map((lnk: any, idx: number) => (
                <li key={idx}>
                  <Link 
                    to={lnk.href || '#'}
                    className="text-gray-600 dark:text-gray-400 hover:text-[#8B2332] dark:hover:text-[#B85C6D] transition-all duration-300 inline-block hover:translate-x-2 group text-xs md:text-sm"
                  >
                    <span className="group-hover:border-b border-white/30">{lnk.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-base md:text-lg mb-5 text-gray-800 dark:text-gray-200 relative inline-block">
              Contact Info
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#7A7A3F] dark:from-[#9B9B5F] to-transparent"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 group">
                <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[#8B2332]/10 dark:bg-[#B85C6D]/10 flex items-center justify-center group-hover:bg-[#8B2332]/20 dark:group-hover:bg-[#B85C6D]/20 transition-all">
                  <MapPinIcon size={12} className="text-[#8B2332] dark:text-[#B85C6D] group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-gray-600 dark:text-gray-400 hover:text-[#8B2332] dark:hover:text-[#B85C6D] transition-colors text-xs md:text-sm">{((content['footer_main'] as any)?.address || 'Nairobi, Kenya')}</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#8B2332]/10 dark:bg-[#B85C6D]/10 flex items-center justify-center group-hover:bg-[#8B2332]/20 dark:group-hover:bg-[#B85C6D]/20 transition-all">
                <PhoneIcon size={12} className="text-[#8B2332] dark:text-[#B85C6D] group-hover:scale-110 transition-transform" />
                </div>
                <a href={`tel:${((content['footer_main'] as any)?.phone || '+254700000000')}`} className="text-gray-600 dark:text-gray-400 hover:text-[#8B2332] dark:hover:text-[#B85C6D] transition-colors text-xs md:text-sm">
                  {((content['footer_main'] as any)?.phone || '+254 700 000 000')}
                </a>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#8B2332]/10 dark:bg-[#B85C6D]/10 flex items-center justify-center group-hover:bg-[#8B2332]/20 dark:group-hover:bg-[#B85C6D]/20 transition-all">
                <MailIcon size={12} className="text-[#8B2332] dark:text-[#B85C6D] group-hover:scale-110 transition-transform" />
                </div>
                <a href={`mailto:${((content['footer_main'] as any)?.email || 'info@apeck.or.ke')}`} className="text-gray-600 dark:text-gray-400 hover:text-[#8B2332] dark:hover:text-[#B85C6D] transition-colors text-xs md:text-sm">
                  {((content['footer_main'] as any)?.email || 'info@apeck.or.ke')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-12 md:mt-16 pt-8 md:pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm text-center md:text-left">
              {(((content['footer_main'] as any)?.copyright) || `© ${new Date().getFullYear()} APECK - Association of Pentecostal & Evangelical Clergy of Kenya. All rights reserved.`)}
            </p>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-xs md:text-sm">
              <span>Made with</span>
              <span className="text-[#8B2332] dark:text-[#B85C6D] animate-pulse">♥</span>
              <span>for Kingdom Impact</span>
            </div>
          </div>
        </div>
      </div>
    </footer>;
}