from pathlib import Path
path = Path('src/pages/Programs.tsx')
text = path.read_text()
start = text.index('      {/* Hero Section */}')
end = text.index('      {/* Section Divider */}', start)
block = text[start:end]
lines = block.splitlines()
decor = '\n'.join(lines[1:])
hero_lines = [
    '      {/* Hero Section */}',
    '      <section className="relative py-24 md:py-32 text-white overflow-hidden">',
    '        <div',
    '          className="absolute inset-0 bg-cover bg-center bg-no-repeat"',
    "          style={{ backgroundImage: url(), willChange: 'background-image' }}",
    '        ></div>',
    '        <div className="absolute inset-0 bg-gradient-to-br from-[#8B2332]/85 via-[#8B2332]/80 to-[#6B1A28]/85"></div>',
    '        <DottedPattern opacity={0.08} size="32px" />',
    '        <DottedPattern opacity={0.05} size="48px" />',
    '        <GeometricPattern opacity={0.04} />',
    '        <div className="absolute top-1/4 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>',
    '        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>',
    '        <AbstractShape position="top" color="#ffffff" />',
    '        <AbstractShape position="bottom" color="#ffffff" />',
]
hero_lines.append(decor)
hero_lines.extend([
    '        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">',
    '          <div className="transform transition-all duration-700" data-animate-id="programs-hero">',
    "            <div className={${isVisible['programs-hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}}">",
    '              <div className="inline-block mb-6">',
    '                <span className="inline-block px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-lg border border-white/20">',
    '                  {heroBadgeLabel}',
    '                </span>',
    '              </div>',
    '              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">{heroTitle}</h1>',
    '              <p className="text-sm md:text-base text-white/95 max-w-3xl leading-relaxed">{heroDescription}</p>',
    '            </div>',
    '          </div>',
    '        </div>',
    '      </section>',
])
hero = '\n'.join(hero_lines) + '\n'
path.write_text(text[:start] + hero + text[end:])
