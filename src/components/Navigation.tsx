import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon } from 'lucide-react';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navLinks = [{
    path: '/',
    label: 'Home'
  }, {
    path: '/about',
    label: 'About Us'
  }, {
    path: '/programs',
    label: 'Programs'
  }, {
    path: '/membership',
    label: 'Membership'
  }, {
    path: '/news',
    label: 'News & Events'
  }, {
    path: '/gallery',
    label: 'Gallery'
  }, {
    path: '/contact',
    label: 'Contact'
  }];
  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-4">
            <img 
              src="/assets/logo1.png" 
              alt="APECK Logo" 
              className="w-16 h-16 object-contain transition-all duration-300 hover:scale-110 hover:drop-shadow-2xl drop-shadow-lg filter brightness-110 shadow-xl border-2 border-[#8B2332]/20 rounded-lg p-1 bg-white" 
            />
            <div className="flex flex-col text-left">
              <span className="text-xs text-[#8B2332] font-medium">Association of</span>
              <span className="text-[#8B2332] font-bold text-sm leading-tight">PENTECOSTAL &</span>
              <span className="text-[#8B2332] font-bold text-sm leading-tight">EVANGELICAL</span>
              <span className="text-[#8B2332] font-bold text-sm leading-tight">CLERGY OF KENYA</span>
            </div>
          </Link>
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => <Link key={link.path} to={link.path} className={`text-sm font-medium transition-colors relative group ${location.pathname === link.path ? 'text-[#8B2332]' : 'text-gray-700 hover:text-[#8B2332]'}`}>
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#7A7A3F] transition-all group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''}`}></span>
              </Link>)}
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/membership" className="px-6 py-2 bg-[#8B2332] text-white rounded-full font-medium hover:bg-[#6B1A28] transition-colors">
              Join Us
            </Link>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-gray-700">
            {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && <div className="lg:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map(link => <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className={`block py-2 text-sm font-medium ${location.pathname === link.path ? 'text-[#8B2332]' : 'text-gray-700'}`}>
                {link.label}
              </Link>)}
            <Link to="/membership" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center px-6 py-2 bg-[#8B2332] text-white rounded-full font-medium">
              Join Us
            </Link>
          </div>
        </div>}
    </nav>;
