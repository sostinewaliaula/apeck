import React from 'react';
import { CalendarIcon, MapPinIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
export function News() {
  return <div className="w-full bg-white pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">News & Events</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Stay updated with the latest news, events, and activities from APECK
          </p>
        </div>
      </section>
      {/* Featured News */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#8B2332] mb-4">
              Latest News
            </h2>
            <p className="text-gray-600 text-lg">
              Recent updates and announcements
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600" alt="Conference" className="w-full h-56 object-cover" />
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-[#7A7A3F] font-semibold mb-3">
                  <CalendarIcon size={16} />
                  <span>December 15, 2024</span>
                </div>
                <h3 className="text-2xl font-bold text-[#8B2332] mb-3">
                  Annual Leadership Conference 2024
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Join us for three days of powerful teaching, networking, and
                  spiritual renewal at our flagship annual conference. Over 500
                  clergy leaders expected to attend.
                </p>
                <button className="text-[#8B2332] font-semibold hover:text-[#7A7A3F] transition-colors inline-flex items-center space-x-2">
                  <span>Read More</span>
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600" alt="Training" className="w-full h-56 object-cover" />
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-[#7A7A3F] font-semibold mb-3">
                  <CalendarIcon size={16} />
                  <span>December 10, 2024</span>
                </div>
                <h3 className="text-2xl font-bold text-[#8B2332] mb-3">
                  New Pastoral Care Certification Program
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  We are excited to announce the launch of our comprehensive
                  pastoral care and counseling certification program, starting
                  January 2025.
                </p>
                <button className="text-[#8B2332] font-semibold hover:text-[#7A7A3F] transition-colors inline-flex items-center space-x-2">
                  <span>Read More</span>
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600" alt="Community" className="w-full h-56 object-cover" />
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-[#7A7A3F] font-semibold mb-3">
                  <CalendarIcon size={16} />
                  <span>December 5, 2024</span>
                </div>
                <h3 className="text-2xl font-bold text-[#8B2332] mb-3">
                  Community Outreach Initiative Success
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Over 5,000 families reached through our latest humanitarian
                  initiative across 10 counties. Thank you to all participating
                  churches.
                </p>
                <button className="text-[#8B2332] font-semibold hover:text-[#7A7A3F] transition-colors inline-flex items-center space-x-2">
                  <span>Read More</span>
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600" alt="Workshop" className="w-full h-56 object-cover" />
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-[#7A7A3F] font-semibold mb-3">
                  <CalendarIcon size={16} />
                  <span>November 28, 2024</span>
                </div>
                <h3 className="text-2xl font-bold text-[#8B2332] mb-3">
                  Leadership Workshop Series Announced
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Monthly leadership development workshops starting in January.
                  Register now to secure your spot in this transformative
                  series.
                </p>
                <button className="text-[#8B2332] font-semibold hover:text-[#7A7A3F] transition-colors inline-flex items-center space-x-2">
                  <span>Read More</span>
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=600" alt="Youth" className="w-full h-56 object-cover" />
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-[#7A7A3F] font-semibold mb-3">
                  <CalendarIcon size={16} />
                  <span>November 20, 2024</span>
                </div>
                <h3 className="text-2xl font-bold text-[#8B2332] mb-3">
                  Youth Ministry Training Success
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Over 200 youth leaders completed our intensive youth ministry
                  training program. Graduation ceremony held in Nairobi.
                </p>
                <button className="text-[#8B2332] font-semibold hover:text-[#7A7A3F] transition-colors inline-flex items-center space-x-2">
                  <span>Read More</span>
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=600" alt="Meeting" className="w-full h-56 object-cover" />
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-[#7A7A3F] font-semibold mb-3">
                  <CalendarIcon size={16} />
                  <span>November 15, 2024</span>
                </div>
                <h3 className="text-2xl font-bold text-[#8B2332] mb-3">
                  New Regional Chapters Launched
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  APECK expands with three new regional chapters in Western,
                  Coast, and Rift Valley regions to better serve our members.
                </p>
                <button className="text-[#8B2332] font-semibold hover:text-[#7A7A3F] transition-colors inline-flex items-center space-x-2">
                  <span>Read More</span>
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Upcoming Events */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#8B2332] mb-4">
              Upcoming Events
            </h2>
            <p className="text-gray-600 text-lg">
              Mark your calendar for these important dates
            </p>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="md:flex">
                <div className="md:w-48 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white p-8 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold mb-2">15</div>
                  <div className="text-xl">DEC</div>
                  <div className="text-sm opacity-80">2024</div>
                </div>
                <div className="p-8 flex-1">
                  <h3 className="text-2xl font-bold text-[#8B2332] mb-3">
                    Annual Leadership Conference
                  </h3>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <ClockIcon size={16} />
                      <span>8:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPinIcon size={16} />
                      <span>KICC, Nairobi</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Three days of powerful teaching, workshops, and networking.
                    Featured speakers include renowned ministry leaders from
                    across Africa.
                  </p>
                  <button className="px-6 py-2 bg-[#8B2332] text-white rounded-full font-semibold hover:bg-[#6B1A28] transition-colors">
                    Register Now
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="md:flex">
                <div className="md:w-48 bg-gradient-to-br from-[#7A7A3F] to-[#6A6A35] text-white p-8 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold mb-2">20</div>
                  <div className="text-xl">JAN</div>
                  <div className="text-sm opacity-80">2025</div>
                </div>
                <div className="p-8 flex-1">
                  <h3 className="text-2xl font-bold text-[#8B2332] mb-3">
                    Pastoral Care Certification Program Begins
                  </h3>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <ClockIcon size={16} />
                      <span>9:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPinIcon size={16} />
                      <span>APECK Training Center</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Comprehensive 6-month certification program in pastoral care
                    and biblical counseling. Limited spots available.
                  </p>
                  <button className="px-6 py-2 bg-[#7A7A3F] text-white rounded-full font-semibold hover:bg-[#6A6A35] transition-colors">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="md:flex">
                <div className="md:w-48 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white p-8 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold mb-2">10</div>
                  <div className="text-xl">FEB</div>
                  <div className="text-sm opacity-80">2025</div>
                </div>
                <div className="p-8 flex-1">
                  <h3 className="text-2xl font-bold text-[#8B2332] mb-3">
                    Regional Leaders Summit - Western
                  </h3>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <ClockIcon size={16} />
                      <span>9:00 AM - 3:00 PM</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPinIcon size={16} />
                      <span>Kisumu</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Regional gathering for clergy leaders in Western Kenya.
                    Focus on church growth and community impact.
                  </p>
                  <button className="px-6 py-2 bg-[#8B2332] text-white rounded-full font-semibold hover:bg-[#6B1A28] transition-colors">
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-white/90 mb-8">
            Subscribe to our newsletter for the latest news, events, and
            resources
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7A7A3F]" />
            <button className="px-8 py-4 bg-[#7A7A3F] text-white rounded-full font-semibold hover:bg-[#6A6A35] transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>;
}