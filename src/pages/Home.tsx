import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, HeartIcon, UsersIcon, BookOpenIcon, SparklesIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [{
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1600',
    title: 'Empowering the Clergy',
    subtitle: 'for Kingdom Impact',
    description: 'Uniting Pentecostal and Evangelical clergy across Kenya through training, leadership development, and spiritual empowerment'
  }, {
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1600',
    title: 'Comprehensive Training',
    subtitle: 'Programs',
    description: 'Over 250+ training programs designed to equip clergy for effective ministry and leadership excellence'
  }, {
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1600',
    title: 'Community Impact',
    subtitle: 'Across Kenya',
    description: 'Reaching all 47 counties with transformative ministry initiatives and humanitarian outreach programs'
  }, {
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600',
    title: 'Join 1,500+ Clergy',
    subtitle: 'Members',
    description: 'Be part of a vibrant community of passionate ministry leaders committed to excellence and Kingdom growth'
  }];
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };
  return <div className="w-full bg-white">
      {/* Hero Carousel Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Slides */}
        {slides.map((slide, index) => <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B2332]/95 to-[#6B1A28]/95 z-10"></div>
            <div className="absolute inset-0 bg-cover bg-center" style={{
          backgroundImage: `url('${slide.image}')`
        }}></div>
          </div>)}
        {/* Decorative Elements */}
        <div className="absolute inset-0 z-20 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#7A7A3F] rounded-full blur-3xl"></div>
        </div>
        {/* Content */}
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <div className="mb-8 inline-block">
            <img 
              src="/assets/logo1.png" 
              alt="APECK Logo" 
              className="w-32 h-32 mx-auto mb-4 object-contain transition-all duration-500 hover:scale-125 hover:rotate-3 drop-shadow-2xl filter brightness-110 shadow-2xl border-4 border-white/50 rounded-2xl p-3 bg-white/95 backdrop-blur-sm transform hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]" 
            />
          </div>
          {slides.map((slide, index) => <div key={index} className={`transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0 absolute'}`}>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                {slide.title}
                <br />
                <span className="text-[#7A7A3F]">{slide.subtitle}</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
                {slide.description}
              </p>
            </div>)}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/membership" className="px-8 py-4 bg-white text-[#8B2332] rounded-full font-semibold hover:bg-gray-100 transition-all inline-flex items-center justify-center space-x-2 shadow-xl">
              <span>Join APECK</span>
              <ArrowRightIcon size={20} />
            </Link>
            <Link to="/about" className="px-8 py-4 bg-[#7A7A3F] text-white rounded-full font-semibold hover:bg-[#6A6A35] transition-all inline-flex items-center justify-center space-x-2">
              <span>Learn More</span>
            </Link>
            <a href="#donate" className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-[#8B2332] transition-all inline-flex items-center justify-center space-x-2">
              <HeartIcon size={20} />
              <span>Partner With Us</span>
            </a>
          </div>
        </div>
        {/* Navigation Arrows */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
          <ChevronLeftIcon size={24} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
          <ChevronRightIcon size={24} />
        </button>
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex space-x-2">
          {slides.map((_, index) => <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'}`} />)}
        </div>
      </section>
      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#8B2332] mb-6">
                Who We Are
              </h2>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                APECK is the premier association uniting Pentecostal and
                Evangelical clergy across Kenya. We are dedicated to empowering
                spiritual leaders through comprehensive training, mentorship,
                and resources that enable them to fulfill their calling with
                excellence.
              </p>
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                Our mission is to strengthen the body of Christ by equipping
                clergy with the tools, knowledge, and support they need to lead
                transformative ministries that impact communities and advance
                the Kingdom of God.
              </p>
              <Link to="/about" className="inline-flex items-center space-x-2 text-[#8B2332] font-semibold hover:text-[#7A7A3F] transition-colors">
                <span>Read Our Full Story</span>
                <ArrowRightIcon size={20} />
              </Link>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800" alt="Clergy gathering" className="rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#7A7A3F]/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-[#7A7A3F] mb-2">
                1,500+
              </div>
              <div className="text-white/80">Members</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#7A7A3F] mb-2">47</div>
              <div className="text-white/80">Counties Reached</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#7A7A3F] mb-2">250+</div>
              <div className="text-white/80">Training Programs</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#7A7A3F] mb-2">15</div>
              <div className="text-white/80">Years of Impact</div>
            </div>
          </div>
        </div>
      </section>
      {/* Programs Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#8B2332] mb-4">
              Our Programs & Initiatives
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive programs designed to empower clergy and strengthen
              ministry impact
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-[#8B2332]/10 rounded-full flex items-center justify-center mb-6">
                <BookOpenIcon size={32} className="text-[#8B2332]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Training Programs
              </h3>
              <p className="text-gray-600 mb-4">
                Comprehensive theological and leadership training for clergy at
                all levels
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-[#7A7A3F]/10 rounded-full flex items-center justify-center mb-6">
                <UsersIcon size={32} className="text-[#7A7A3F]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Clergy Empowerment
              </h3>
              <p className="text-gray-600 mb-4">
                Resources and support for personal and ministerial growth
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-[#8B2332]/10 rounded-full flex items-center justify-center mb-6">
                <SparklesIcon size={32} className="text-[#8B2332]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Leadership Development
              </h3>
              <p className="text-gray-600 mb-4">
                Mentorship and coaching for emerging and established leaders
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-[#7A7A3F]/10 rounded-full flex items-center justify-center mb-6">
                <HeartIcon size={32} className="text-[#7A7A3F]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Community Outreach
              </h3>
              <p className="text-gray-600 mb-4">
                Collaborative initiatives to serve communities across Kenya
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link to="/programs" className="inline-flex items-center space-x-2 px-8 py-4 bg-[#8B2332] text-white rounded-full font-semibold hover:bg-[#6B1A28] transition-colors">
              <span>Explore All Programs</span>
              <ArrowRightIcon size={20} />
            </Link>
          </div>
        </div>
      </section>
      {/* Recent Updates */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#8B2332] mb-4">
              Recent Updates
            </h2>
            <p className="text-gray-600 text-lg">
              Stay informed about our latest activities and events
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600" alt="Conference" className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="text-sm text-[#7A7A3F] font-semibold mb-2">
                  DECEMBER 15, 2024
                </div>
                <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                  Annual Leadership Conference 2024
                </h3>
                <p className="text-gray-600 mb-4">
                  Join us for three days of powerful teaching, networking, and
                  spiritual renewal
                </p>
                <Link to="/news" className="text-[#8B2332] font-semibold hover:text-[#7A7A3F] transition-colors">
                  Read More →
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600" alt="Training" className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="text-sm text-[#7A7A3F] font-semibold mb-2">
                  DECEMBER 10, 2024
                </div>
                <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                  New Training Program Launch
                </h3>
                <p className="text-gray-600 mb-4">
                  Introducing our comprehensive pastoral care and counseling
                  certification
                </p>
                <Link to="/news" className="text-[#8B2332] font-semibold hover:text-[#7A7A3F] transition-colors">
                  Read More →
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600" alt="Community" className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="text-sm text-[#7A7A3F] font-semibold mb-2">
                  DECEMBER 5, 2024
                </div>
                <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                  Community Outreach Success
                </h3>
                <p className="text-gray-600 mb-4">
                  Over 5,000 families reached through our latest humanitarian
                  initiative
                </p>
                <Link to="/news" className="text-[#8B2332] font-semibold hover:text-[#7A7A3F] transition-colors">
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join a community of passionate clergy committed to transforming
            Kenya through the Gospel
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/membership" className="px-8 py-4 bg-white text-[#8B2332] rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Become a Member
            </Link>
            <Link to="/contact" className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-[#8B2332] transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>;
}