import React, { Children } from 'react';
import { BookOpenIcon, UsersIcon, GraduationCapIcon, HeartIcon, TrendingUpIcon, AwardIcon } from 'lucide-react';
export function Programs() {
  return <div className="w-full bg-white pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Programs</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Comprehensive training and development programs designed to empower
            clergy for effective ministry
          </p>
        </div>
      </section>
      {/* Main Programs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#8B2332] mb-4">
              Featured Programs
            </h2>
            <p className="text-gray-600 text-lg">
              Equipping clergy for excellence in ministry
            </p>
          </div>
          <div className="space-y-12">
            {/* Theological Training */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="grid md:grid-cols-2">
                <div className="p-12">
                  <div className="w-16 h-16 bg-[#8B2332]/10 rounded-full flex items-center justify-center mb-6">
                    <BookOpenIcon size={32} className="text-[#8B2332]" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#8B2332] mb-4">
                    Theological Training
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Comprehensive theological education programs covering
                    biblical studies, systematic theology, church history, and
                    practical ministry skills.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#7A7A3F] mt-1">✓</span>
                      <span className="text-gray-700">
                        Certificate in Theology (6 months)
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#7A7A3F] mt-1">✓</span>
                      <span className="text-gray-700">
                        Diploma in Ministry (1 year)
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#7A7A3F] mt-1">✓</span>
                      <span className="text-gray-700">
                        Advanced Theological Studies (2 years)
                      </span>
                    </li>
                  </ul>
                  <button className="px-6 py-3 bg-[#8B2332] text-white rounded-full font-semibold hover:bg-[#6B1A28] transition-colors">
                    Learn More
                  </button>
                </div>
                <div className="relative h-64 md:h-auto">
                  <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800" alt="Theological training" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            {/* Leadership Development */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto order-2 md:order-1">
                  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800" alt="Leadership development" className="w-full h-full object-cover" />
                </div>
                <div className="p-12 order-1 md:order-2">
                  <div className="w-16 h-16 bg-[#7A7A3F]/10 rounded-full flex items-center justify-center mb-6">
                    <TrendingUpIcon size={32} className="text-[#7A7A3F]" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#8B2332] mb-4">
                    Leadership Development
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Intensive leadership training programs designed to develop
                    visionary leaders who can effectively lead churches and
                    ministries.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#7A7A3F] mt-1">✓</span>
                      <span className="text-gray-700">
                        Strategic Leadership Training
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#7A7A3F] mt-1">✓</span>
                      <span className="text-gray-700">
                        Church Growth & Development
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#7A7A3F] mt-1">✓</span>
                      <span className="text-gray-700">
                        Mentorship & Coaching
                      </span>
                    </li>
                  </ul>
                  <button className="px-6 py-3 bg-[#7A7A3F] text-white rounded-full font-semibold hover:bg-[#6A6A35] transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
            {/* Pastoral Care */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="grid md:grid-cols-2">
                <div className="p-12">
                  <div className="w-16 h-16 bg-[#8B2332]/10 rounded-full flex items-center justify-center mb-6">
                    <HeartIcon size={32} className="text-[#8B2332]" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#8B2332] mb-4">
                    Pastoral Care & Counseling
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Professional training in pastoral care, counseling
                    techniques, and spiritual guidance to help clergy
                    effectively minister to their congregations.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#7A7A3F] mt-1">✓</span>
                      <span className="text-gray-700">
                        Biblical Counseling Certification
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#7A7A3F] mt-1">✓</span>
                      <span className="text-gray-700">
                        Crisis Intervention Training
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#7A7A3F] mt-1">✓</span>
                      <span className="text-gray-700">
                        Marriage & Family Counseling
                      </span>
                    </li>
                  </ul>
                  <button className="px-6 py-3 bg-[#8B2332] text-white rounded-full font-semibold hover:bg-[#6B1A28] transition-colors">
                    Learn More
                  </button>
                </div>
                <div className="relative h-64 md:h-auto">
                  <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800" alt="Pastoral care" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Additional Programs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#8B2332] mb-4">
              Additional Programs
            </h2>
            <p className="text-gray-600 text-lg">
              Specialized training for specific ministry areas
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-[#8B2332]/10 rounded-full flex items-center justify-center mb-4">
                <UsersIcon size={24} className="text-[#8B2332]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Youth Ministry
              </h3>
              <p className="text-gray-600 mb-4">
                Specialized training for effective youth and young adult
                ministry
              </p>
              <p className="text-sm text-[#7A7A3F] font-semibold">
                3-month program
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-[#7A7A3F]/10 rounded-full flex items-center justify-center mb-4">
                <GraduationCapIcon size={24} className="text-[#7A7A3F]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Children's Ministry
              </h3>
              <p className="text-gray-600 mb-4">
                Training for impactful children's ministry and Sunday school
                programs
              </p>
              <p className="text-sm text-[#7A7A3F] font-semibold">
                2-month program
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-[#8B2332]/10 rounded-full flex items-center justify-center mb-4">
                <BookOpenIcon size={24} className="text-[#8B2332]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Worship & Music
              </h3>
              <p className="text-gray-600 mb-4">
                Comprehensive worship leading and church music ministry training
              </p>
              <p className="text-sm text-[#7A7A3F] font-semibold">
                4-month program
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-[#7A7A3F]/10 rounded-full flex items-center justify-center mb-4">
                <HeartIcon size={24} className="text-[#7A7A3F]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Missions & Evangelism
              </h3>
              <p className="text-gray-600 mb-4">
                Equipping clergy for effective evangelism and missions work
              </p>
              <p className="text-sm text-[#7A7A3F] font-semibold">
                3-month program
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-[#8B2332]/10 rounded-full flex items-center justify-center mb-4">
                <AwardIcon size={24} className="text-[#8B2332]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Church Administration
              </h3>
              <p className="text-gray-600 mb-4">
                Practical training in church management and administration
              </p>
              <p className="text-sm text-[#7A7A3F] font-semibold">
                2-month program
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-[#7A7A3F]/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUpIcon size={24} className="text-[#7A7A3F]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B2332] mb-3">
                Media & Communications
              </h3>
              <p className="text-gray-600 mb-4">
                Modern ministry tools for digital age evangelism and
                communication
              </p>
              <p className="text-sm text-[#7A7A3F] font-semibold">
                3-month program
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Program Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#8B2332] mb-4">
              Program Features
            </h2>
            <p className="text-gray-600 text-lg">
              What makes our programs exceptional
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#8B2332]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCapIcon size={32} className="text-[#8B2332]" />
              </div>
              <h3 className="text-lg font-semibold text-[#8B2332] mb-2">
                Expert Instructors
              </h3>
              <p className="text-gray-600 text-sm">
                Learn from experienced ministry leaders and theologians
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#7A7A3F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpenIcon size={32} className="text-[#7A7A3F]" />
              </div>
              <h3 className="text-lg font-semibold text-[#8B2332] mb-2">
                Practical Training
              </h3>
              <p className="text-gray-600 text-sm">
                Hands-on experience and real-world ministry applications
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#8B2332]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AwardIcon size={32} className="text-[#8B2332]" />
              </div>
              <h3 className="text-lg font-semibold text-[#8B2332] mb-2">
                Certification
              </h3>
              <p className="text-gray-600 text-sm">
                Receive recognized certificates upon program completion
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#7A7A3F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon size={32} className="text-[#7A7A3F]" />
              </div>
              <h3 className="text-lg font-semibold text-[#8B2332] mb-2">
                Community
              </h3>
              <p className="text-gray-600 text-sm">
                Connect with fellow clergy and build lasting relationships
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Grow in Your Ministry?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Enroll in one of our programs and take your ministry to the next
            level
          </p>
          <button className="px-8 py-4 bg-white text-[#8B2332] rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Enroll Now
          </button>
        </div>
      </section>
    </div>;
}