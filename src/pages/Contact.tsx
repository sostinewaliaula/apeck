import React, { useState } from 'react';
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon, FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from 'lucide-react';
export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return <div className="w-full bg-white pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Get in touch with us. We are here to answer your questions and
            support your ministry
          </p>
        </div>
      </section>
      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-[#8B2332] mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2332]" placeholder="Enter your full name" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2332]" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2332]" placeholder="+254 700 000 000" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2332]">
                    <option value="">Select a subject</option>
                    <option value="membership">Membership Inquiry</option>
                    <option value="programs">Programs & Training</option>
                    <option value="events">Events & Conferences</option>
                    <option value="partnership">
                      Partnership Opportunities
                    </option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2332]" placeholder="Tell us how we can help you..."></textarea>
                </div>
                <button type="submit" className="w-full px-8 py-4 bg-[#8B2332] text-white rounded-full font-semibold hover:bg-[#6B1A28] transition-colors">
                  Send Message
                </button>
              </form>
            </div>
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-[#8B2332] mb-6">
                Contact Information
              </h2>
              <div className="space-y-6 mb-12">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#8B2332]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPinIcon size={24} className="text-[#8B2332]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Office Address
                    </h3>
                    <p className="text-gray-600">
                      APECK Headquarters
                      <br />
                      Nairobi, Kenya
                      <br />
                      P.O. Box 12345-00100
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#7A7A3F]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <PhoneIcon size={24} className="text-[#7A7A3F]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Phone Numbers
                    </h3>
                    <p className="text-gray-600">
                      Main Office: +254 700 000 000
                      <br />
                      Training Dept: +254 700 000 001
                      <br />
                      Membership: +254 700 000 002
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#8B2332]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MailIcon size={24} className="text-[#8B2332]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Email Addresses
                    </h3>
                    <p className="text-gray-600">
                      General: info@apeck.or.ke
                      <br />
                      Programs: programs@apeck.or.ke
                      <br />
                      Membership: membership@apeck.or.ke
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#7A7A3F]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <ClockIcon size={24} className="text-[#7A7A3F]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Office Hours
                    </h3>
                    <p className="text-gray-600">
                      Monday - Friday: 8:00 AM - 5:00 PM
                      <br />
                      Saturday: 9:00 AM - 1:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
              {/* Social Media */}
              <div>
                <h3 className="text-xl font-bold text-[#8B2332] mb-4">
                  Connect With Us
                </h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-12 h-12 bg-[#8B2332] rounded-full flex items-center justify-center text-white hover:bg-[#6B1A28] transition-colors">
                    <FacebookIcon size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 bg-[#7A7A3F] rounded-full flex items-center justify-center text-white hover:bg-[#6A6A35] transition-colors">
                    <TwitterIcon size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 bg-[#8B2332] rounded-full flex items-center justify-center text-white hover:bg-[#6B1A28] transition-colors">
                    <InstagramIcon size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 bg-[#7A7A3F] rounded-full flex items-center justify-center text-white hover:bg-[#6A6A35] transition-colors">
                    <YoutubeIcon size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#8B2332] mb-4">Find Us</h2>
            <p className="text-gray-600 text-lg">Visit our office in Nairobi</p>
          </div>
          <div className="bg-gray-300 rounded-2xl overflow-hidden shadow-xl h-96 flex items-center justify-center">
            <p className="text-gray-600">Map placeholder - Nairobi, Kenya</p>
          </div>
        </div>
      </section>
    </div>;
}