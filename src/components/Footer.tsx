import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon, MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
export function Footer() {
  return <footer className="bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=100&h=100&fit=crop" alt="APECK Logo" className="w-10 h-10 rounded-full object-cover" />
              <span className="font-bold text-lg">APECK</span>
            </div>
            <p className="text-white/80 text-sm mb-4">
              Empowering the Clergy for Kingdom Impact across Kenya
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <FacebookIcon size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <TwitterIcon size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <InstagramIcon size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <YoutubeIcon size={16} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-white/80 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-white/80 hover:text-white transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link to="/membership" className="text-white/80 hover:text-white transition-colors">
                  Membership
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-white/80 hover:text-white transition-colors">
                  News & Events
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Training Materials
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Publications
                </a>
              </li>
              <li>
                <Link to="/gallery" className="text-white/80 hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPinIcon size={16} className="mt-1 flex-shrink-0" />
                <span className="text-white/80">Nairobi, Kenya</span>
              </li>
              <li className="flex items-center space-x-2">
                <PhoneIcon size={16} className="flex-shrink-0" />
                <span className="text-white/80">+254 700 000 000</span>
              </li>
              <li className="flex items-center space-x-2">
                <MailIcon size={16} className="flex-shrink-0" />
                <span className="text-white/80">info@apeck.or.ke</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/70">
          <p>
            &copy; {new Date().getFullYear()} APECK - Association of Pentecostal
            & Evangelical Clergy of Kenya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
}