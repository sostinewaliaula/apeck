import React from 'react';
import { CheckIcon, UsersIcon, AwardIcon, HeartIcon } from 'lucide-react';
export function Membership() {
  return <div className="w-full bg-white pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Membership</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Join a community of passionate clergy committed to excellence in
            ministry and Kingdom impact
          </p>
        </div>
      </section>
      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#8B2332] mb-4">
              Membership Benefits
            </h2>
            <p className="text-gray-600 text-lg">Why join APECK?</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-[#8B2332]/10 rounded-full flex items-center justify-center mb-4">
                <AwardIcon size={24} className="text-[#8B2332]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Professional Development
              </h3>
              <p className="text-gray-600">
                Access to comprehensive training programs, workshops, and
                seminars for continuous growth
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-[#7A7A3F]/10 rounded-full flex items-center justify-center mb-4">
                <UsersIcon size={24} className="text-[#7A7A3F]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Networking Opportunities
              </h3>
              <p className="text-gray-600">
                Connect with fellow clergy across Kenya and build meaningful
                ministry partnerships
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-[#8B2332]/10 rounded-full flex items-center justify-center mb-4">
                <HeartIcon size={24} className="text-[#8B2332]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Pastoral Care
              </h3>
              <p className="text-gray-600">
                Receive support, counseling, and mentorship from experienced
                ministry leaders
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-[#7A7A3F]/10 rounded-full flex items-center justify-center mb-4">
                <CheckIcon size={24} className="text-[#7A7A3F]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Certification
              </h3>
              <p className="text-gray-600">
                Official recognition and certification as a member of APECK
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-[#8B2332]/10 rounded-full flex items-center justify-center mb-4">
                <AwardIcon size={24} className="text-[#8B2332]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Resource Library
              </h3>
              <p className="text-gray-600">
                Access to extensive library of books, materials, and digital
                resources
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-[#7A7A3F]/10 rounded-full flex items-center justify-center mb-4">
                <UsersIcon size={24} className="text-[#7A7A3F]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Annual Conference
              </h3>
              <p className="text-gray-600">
                Exclusive access to our annual leadership conference and special
                events
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Membership Tiers */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#8B2332] mb-4">
              Membership Categories
            </h2>
            <p className="text-gray-600 text-lg">
              Choose the membership level that fits your ministry
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Associate Member */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-gray-600 to-gray-700 text-white p-8 text-center">
                <h3 className="text-2xl font-bold mb-2">Associate Member</h3>
                <p className="text-white/80 mb-4">For emerging clergy</p>
                <div className="text-4xl font-bold">KSh 5,000</div>
                <p className="text-white/80 text-sm">per year</p>
              </div>
              <div className="p-8">
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Access to basic training programs
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Quarterly newsletters</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Online resource access
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Networking opportunities
                    </span>
                  </li>
                </ul>
                <button className="w-full mt-8 px-6 py-3 bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700 transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
            {/* Full Member */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-[#8B2332] transform scale-105">
              <div className="bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white p-8 text-center relative">
                <div className="absolute top-4 right-4 bg-[#7A7A3F] text-white text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </div>
                <h3 className="text-2xl font-bold mb-2">Full Member</h3>
                <p className="text-white/80 mb-4">For established clergy</p>
                <div className="text-4xl font-bold">KSh 10,000</div>
                <p className="text-white/80 text-sm">per year</p>
              </div>
              <div className="p-8">
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckIcon size={20} className="text-[#8B2332] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      All Associate benefits
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckIcon size={20} className="text-[#8B2332] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Full training program access
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckIcon size={20} className="text-[#8B2332] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Mentorship opportunities
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckIcon size={20} className="text-[#8B2332] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Conference discounts</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckIcon size={20} className="text-[#8B2332] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Voting rights</span>
                  </li>
                </ul>
                <button className="w-full mt-8 px-6 py-3 bg-[#8B2332] text-white rounded-full font-semibold hover:bg-[#6B1A28] transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
            {/* Lifetime Member */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-[#7A7A3F] to-[#6A6A35] text-white p-8 text-center">
                <h3 className="text-2xl font-bold mb-2">Lifetime Member</h3>
                <p className="text-white/80 mb-4">For senior clergy</p>
                <div className="text-4xl font-bold">KSh 50,000</div>
                <p className="text-white/80 text-sm">one-time payment</p>
              </div>
              <div className="p-8">
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      All Full Member benefits
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Lifetime membership</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Priority event access</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Leadership opportunities
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckIcon size={20} className="text-[#7A7A3F] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Legacy recognition</span>
                  </li>
                </ul>
                <button className="w-full mt-8 px-6 py-3 bg-[#7A7A3F] text-white rounded-full font-semibold hover:bg-[#6A6A35] transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Requirements */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#8B2332] mb-4">
              Membership Requirements
            </h2>
            <p className="text-gray-600 text-lg">
              What you need to become a member
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#8B2332]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckIcon size={20} className="text-[#8B2332]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#8B2332] mb-2">
                    Calling to Ministry
                  </h3>
                  <p className="text-gray-600">
                    Clear evidence of a calling to full-time Christian ministry
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#8B2332]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckIcon size={20} className="text-[#8B2332]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#8B2332] mb-2">
                    Doctrinal Statement
                  </h3>
                  <p className="text-gray-600">
                    Agreement with APECK's statement of faith and core beliefs
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#8B2332]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckIcon size={20} className="text-[#8B2332]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#8B2332] mb-2">
                    Ministry Experience
                  </h3>
                  <p className="text-gray-600">
                    Active involvement in ministry (requirements vary by
                    membership level)
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#8B2332]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckIcon size={20} className="text-[#8B2332]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#8B2332] mb-2">
                    References
                  </h3>
                  <p className="text-gray-600">
                    Two pastoral references from recognized ministry leaders
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#8B2332]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckIcon size={20} className="text-[#8B2332]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#8B2332] mb-2">
                    Application Fee
                  </h3>
                  <p className="text-gray-600">
                    One-time non-refundable application fee of KSh 1,000
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join APECK?</h2>
          <p className="text-xl text-white/90 mb-8">
            Take the next step in your ministry journey and become part of our
            community
          </p>
          <button className="px-8 py-4 bg-white text-[#8B2332] rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Start Your Application
          </button>
        </div>
      </section>
    </div>;
}