import { Link } from 'react-router-dom';
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon, MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
export function Footer() {
  return <footer className="relative bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white overflow-hidden">
      {/* Enhanced background patterns */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
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
              <polygon points="40,0 80,40 40,80 0,40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
              <polygon points="20,0 40,20 20,40 0,20" fill="none" stroke="white" strokeWidth="0.3" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-geometric)" />
        </svg>
      </div>
      
      {/* Blur effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7A7A3F]/5 rounded-full blur-3xl opacity-50"></div>
      
      {/* Additional decorative graphics */}
      {/* Floating geometric shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 opacity-[0.04] hidden md:block">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,0 100,50 50,100 0,50" fill="white" opacity="0.3"/>
          <polygon points="50,20 80,50 50,80 20,50" fill="#7A7A3F" opacity="0.2"/>
        </svg>
      </div>
      <div className="absolute top-20 right-20 w-40 h-40 opacity-[0.03] hidden lg:block animate-pulse-slow">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
          <circle cx="50" cy="50" r="25" fill="none" stroke="#7A7A3F" strokeWidth="0.3" opacity="0.2"/>
        </svg>
      </div>
      <div className="absolute bottom-20 left-1/4 w-36 h-36 opacity-[0.04] hidden md:block">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M 50,0 Q 80,25 80,60 Q 80,95 50,85 Q 20,95 20,60 Q 20,25 50,0 Z"
            fill="white"
            opacity="0.2"
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
      <div className="absolute top-1/2 left-0 w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block"></div>
      <div className="absolute top-1/2 right-0 w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block"></div>
      
      {/* Top border separator with gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 via-[#7A7A3F]/30 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-16 md:pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-12">
          {/* Logo and About Section */}
          <div className="lg:col-span-1">
            <div className="mb-6 w-full">
              <img 
                src="/assets/logo3.png" 
                alt="APECK Logo" 
                className="w-full max-w-[280px] md:max-w-[320px] h-auto object-contain transition-all duration-300 hover:scale-105 hover:drop-shadow-2xl drop-shadow-lg filter brightness-110" 
              />
            </div>
            <p className="text-white/90 text-xs md:text-sm mb-6 leading-relaxed max-w-xs">
              Empowering the Clergy for Kingdom Impact across Kenya
            </p>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="group w-12 h-12 bg-white/15 rounded-full flex items-center justify-center hover:bg-white/25 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/10 hover:border-white/30"
              >
                <FacebookIcon size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="#" 
                className="group w-12 h-12 bg-white/15 rounded-full flex items-center justify-center hover:bg-white/25 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/10 hover:border-white/30"
              >
                <TwitterIcon size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="#" 
                className="group w-12 h-12 bg-white/15 rounded-full flex items-center justify-center hover:bg-white/25 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/10 hover:border-white/30"
              >
                <InstagramIcon size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="#" 
                className="group w-12 h-12 bg-white/15 rounded-full flex items-center justify-center hover:bg-white/25 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/10 hover:border-white/30"
              >
                <YoutubeIcon size={20} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base md:text-lg mb-5 text-white relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#7A7A3F] to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/about" 
                  className="text-white/80 hover:text-white transition-all duration-300 inline-block hover:translate-x-2 group text-xs md:text-sm"
                >
                  <span className="group-hover:border-b border-white/30">About Us</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/programs" 
                  className="text-white/80 hover:text-white transition-all duration-300 inline-block hover:translate-x-2 group text-xs md:text-sm"
                >
                  <span className="group-hover:border-b border-white/30">Programs</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/membership" 
                  className="text-white/80 hover:text-white transition-all duration-300 inline-block hover:translate-x-2 group text-xs md:text-sm"
                >
                  <span className="group-hover:border-b border-white/30">Membership</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/news" 
                  className="text-white/80 hover:text-white transition-all duration-300 inline-block hover:translate-x-2 group text-xs md:text-sm"
                >
                  <span className="group-hover:border-b border-white/30">News & Events</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="font-bold text-base md:text-lg mb-5 text-white relative inline-block">
              Resources
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#7A7A3F] to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className="text-white/80 hover:text-white transition-all duration-300 inline-block hover:translate-x-2 group text-xs md:text-sm"
                >
                  <span className="group-hover:border-b border-white/30">Training Materials</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-white/80 hover:text-white transition-all duration-300 inline-block hover:translate-x-2 group text-xs md:text-sm"
                >
                  <span className="group-hover:border-b border-white/30">Publications</span>
                </a>
              </li>
              <li>
                <Link 
                  to="/gallery" 
                  className="text-white/80 hover:text-white transition-all duration-300 inline-block hover:translate-x-2 group text-xs md:text-sm"
                >
                  <span className="group-hover:border-b border-white/30">Gallery</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-white/80 hover:text-white transition-all duration-300 inline-block hover:translate-x-2 group text-xs md:text-sm"
                >
                  <span className="group-hover:border-b border-white/30">Contact</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-base md:text-lg mb-5 text-white relative inline-block">
              Contact Info
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#7A7A3F] to-transparent"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 group">
                <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-all">
                  <MapPinIcon size={12} className="group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-white/80 hover:text-white transition-colors text-xs md:text-sm">Nairobi, Kenya</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-all">
                  <PhoneIcon size={12} className="group-hover:scale-110 transition-transform" />
                </div>
                <a href="tel:+254700000000" className="text-white/80 hover:text-white transition-colors text-xs md:text-sm">
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-all">
                  <MailIcon size={12} className="group-hover:scale-110 transition-transform" />
                </div>
                <a href="mailto:info@apeck.or.ke" className="text-white/80 hover:text-white transition-colors text-xs md:text-sm">
                  info@apeck.or.ke
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="border-t border-white/20 mt-12 md:mt-16 pt-8 md:pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/70 text-xs md:text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} APECK - Association of Pentecostal
              & Evangelical Clergy of Kenya. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-white/60 text-xs md:text-sm">
              <span>Made with</span>
              <span className="text-red-400 animate-pulse">♥</span>
              <span>for Kingdom Impact</span>
            </div>
          </div>
        </div>
      </div>
    </footer>;
}