import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { ScrollToTopButton } from './components/ScrollToTopButton';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Programs = lazy(() => import('./pages/Programs').then(module => ({ default: module.Programs })));
const ProgramDetail = lazy(() => import('./pages/ProgramDetail').then(module => ({ default: module.ProgramDetail })));
const Membership = lazy(() => import('./pages/Membership').then(module => ({ default: module.Membership })));
const News = lazy(() => import('./pages/News').then(module => ({ default: module.News })));
const NewsDetail = lazy(() => import('./pages/NewsDetail').then(module => ({ default: module.NewsDetail })));
const Gallery = lazy(() => import('./pages/Gallery').then(module => ({ default: module.Gallery })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B2332]"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

export function App() {
  return <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Navigation />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:programId" element={<ProgramDetail />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:newsId" element={<NewsDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
        <Footer />
        <ScrollToTopButton />
      </div>
    </BrowserRouter>;
}