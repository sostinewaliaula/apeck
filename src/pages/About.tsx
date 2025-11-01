import React from 'react';
import { TargetIcon, EyeIcon, HeartIcon, AwardIcon } from 'lucide-react';
export function About() {
  return <div className="w-full bg-white pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About APECK</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Building a unified community of Pentecostal and Evangelical clergy
            dedicated to excellence in ministry and Kingdom impact
          </p>
        </div>
      </section>
      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white p-12 rounded-2xl shadow-xl">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <TargetIcon size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-white/90 leading-relaxed">
                To empower, equip, and unite Pentecostal and Evangelical clergy
                across Kenya through comprehensive training, spiritual
                development, and collaborative ministry initiatives that advance
                the Kingdom of God and transform communities.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#7A7A3F] to-[#6A6A35] text-white p-12 rounded-2xl shadow-xl">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <EyeIcon size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-white/90 leading-relaxed">
                A Kenya where every Pentecostal and Evangelical clergy member is
                fully equipped, spiritually vibrant, and effectively leading
                transformative ministries that impact individuals, families, and
                communities for Christ.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#8B2332] mb-4">
              Core Values
            </h2>
            <p className="text-gray-600 text-lg">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-[#8B2332]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartIcon size={32} className="text-[#8B2332]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Spiritual Excellence
              </h3>
              <p className="text-gray-600">
                Pursuing the highest standards in spiritual life and ministry
                practice
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-[#7A7A3F]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AwardIcon size={32} className="text-[#7A7A3F]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Integrity
              </h3>
              <p className="text-gray-600">
                Maintaining the highest ethical standards in all our dealings
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-[#8B2332]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TargetIcon size={32} className="text-[#8B2332]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Unity
              </h3>
              <p className="text-gray-600">
                Fostering collaboration and partnership among clergy and
                ministries
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-[#7A7A3F]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <EyeIcon size={32} className="text-[#7A7A3F]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Empowerment
              </h3>
              <p className="text-gray-600">
                Equipping clergy with tools and resources for effective ministry
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Leadership */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#8B2332] mb-4">
              Our Leadership
            </h2>
            <p className="text-gray-600 text-lg">
              Experienced leaders committed to serving the clergy community
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" alt="Bishop" className="w-full h-64 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-[#8B2332] mb-2">
                  Bishop David Kimani
                </h3>
                <p className="text-[#7A7A3F] font-medium mb-3">
                  National Chairman
                </p>
                <p className="text-gray-600 text-sm">
                  Leading APECK with vision and passion for clergy empowerment
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" alt="Pastor" className="w-full h-64 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-[#8B2332] mb-2">
                  Rev. Peter Omondi
                </h3>
                <p className="text-[#7A7A3F] font-medium mb-3">
                  General Secretary
                </p>
                <p className="text-gray-600 text-sm">
                  Coordinating programs and member services across Kenya
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" alt="Leader" className="w-full h-64 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-[#8B2332] mb-2">
                  Pastor James Mwangi
                </h3>
                <p className="text-[#7A7A3F] font-medium mb-3">
                  Training Director
                </p>
                <p className="text-gray-600 text-sm">
                  Overseeing all training and development initiatives
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* History */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#8B2332] mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  APECK was founded in 2009 by a group of visionary clergy
                  leaders who recognized the need for a unified platform to
                  support, empower, and connect Pentecostal and Evangelical
                  ministers across Kenya.
                </p>
                <p>
                  What began as a small gathering of passionate pastors has
                  grown into a national movement representing over 1,500 clergy
                  members from all 47 counties of Kenya.
                </p>
                <p>
                  Over the past 15 years, we have facilitated hundreds of
                  training programs, provided mentorship to emerging leaders,
                  and created a supportive community where clergy can grow,
                  learn, and thrive in their calling.
                </p>
                <p>
                  Today, APECK stands as a beacon of unity, excellence, and
                  impact in the Kenyan church landscape, continuing to fulfill
                  our mission of empowering clergy for Kingdom impact.
                </p>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800" alt="Church gathering" className="rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>
    </div>;
}