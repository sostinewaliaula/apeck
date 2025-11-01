import React, { useState } from 'react';
export function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = [{
    id: 'all',
    label: 'All Photos'
  }, {
    id: 'conferences',
    label: 'Conferences'
  }, {
    id: 'training',
    label: 'Training'
  }, {
    id: 'outreach',
    label: 'Outreach'
  }, {
    id: 'leadership',
    label: 'Leadership'
  }];
  const photos = [{
    id: 1,
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
    category: 'conferences',
    title: 'Annual Leadership Conference 2024'
  }, {
    id: 2,
    url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800',
    category: 'training',
    title: 'Pastoral Training Session'
  }, {
    id: 3,
    url: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800',
    category: 'outreach',
    title: 'Community Outreach Program'
  }, {
    id: 4,
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    category: 'leadership',
    title: 'Leadership Development Workshop'
  }, {
    id: 5,
    url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800',
    category: 'training',
    title: 'Theological Studies Program'
  }, {
    id: 6,
    url: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=800',
    category: 'conferences',
    title: 'Youth Ministry Conference'
  }, {
    id: 7,
    url: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800',
    category: 'leadership',
    title: 'Regional Leaders Meeting'
  }, {
    id: 8,
    url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
    category: 'conferences',
    title: 'National Clergy Gathering'
  }, {
    id: 9,
    url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800',
    category: 'outreach',
    title: 'Humanitarian Initiative'
  }, {
    id: 10,
    url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
    category: 'training',
    title: 'Counseling Certification Program'
  }, {
    id: 11,
    url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
    category: 'training',
    title: 'Biblical Studies Workshop'
  }, {
    id: 12,
    url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800',
    category: 'leadership',
    title: 'Strategic Planning Session'
  }];
  const filteredPhotos = selectedCategory === 'all' ? photos : photos.filter(photo => photo.category === selectedCategory);
  return <div className="w-full bg-white pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Gallery</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Capturing moments of faith, fellowship, and transformation across
            our ministry
          </p>
        </div>
      </section>
      {/* Filter Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map(category => <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-6 py-3 rounded-full font-semibold transition-all ${selectedCategory === category.id ? 'bg-[#8B2332] text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100 shadow'}`}>
                {category.label}
              </button>)}
          </div>
        </div>
      </section>
      {/* Gallery Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPhotos.map(photo => <div key={photo.id} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer">
                <img src={photo.url} alt={photo.title} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-semibold text-lg">
                      {photo.title}
                    </h3>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#8B2332] mb-4">
              Our Impact in Pictures
            </h2>
            <p className="text-gray-600 text-lg">
              Documenting our journey of faith and service
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-[#8B2332] mb-2">500+</div>
              <div className="text-gray-600">Events Documented</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#7A7A3F] mb-2">
                10,000+
              </div>
              <div className="text-gray-600">Photos Captured</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#8B2332] mb-2">47</div>
              <div className="text-gray-600">Counties Covered</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#7A7A3F] mb-2">15</div>
              <div className="text-gray-600">Years of Memories</div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#8B2332] to-[#6B1A28] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Want to Share Your Photos?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            If you have photos from APECK events, we would love to feature them
            in our gallery
          </p>
          <button className="px-8 py-4 bg-white text-[#8B2332] rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Submit Photos
          </button>
        </div>
      </section>
    </div>;
}