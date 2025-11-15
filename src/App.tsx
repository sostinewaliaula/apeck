import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
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
const AdminApp = lazy(() => import('./admin/AdminApp').then(module => ({ default: module.AdminApp })));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B2332]"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {!isAdminRoute && <Navigation />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:programId" element={<ProgramDetail />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Suspense>
      {!isAdminRoute && (
        <>
          <Footer />
          <ScrollToTopButton />
        </>
      )}
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}