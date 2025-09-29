import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'
import App from './App.tsx'
import ServicesApp from './ServicesApp.tsx'

function AkApp() {
  const [isPhone, setIsPhone] = useState(window.innerWidth < 640)
  const [akLightbox, setAkLightbox] = useState<{ title: string, content: string } | null>(null)
  const [akSection, setAkSection] = useState<'ak-aurikinetics' | 'ak-what' | 'ak-how' | 'ak-root' | 'ak-method'>('ak-aurikinetics')
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [navLinePosition, setNavLinePosition] = useState({ x: 0, width: 0 })

  useEffect(() => {
    const checkResponsive = () => {
      setIsPhone(window.innerWidth < 640)
    }
    checkResponsive()
    window.addEventListener('resize', checkResponsive)
    return () => window.removeEventListener('resize', checkResponsive)
  }, [])

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
  }

  // Robust section detection: IntersectionObserver with sentinels and top-of-page override
  useEffect(() => {
    const ids = ['ak-aurikinetics', 'ak-what', 'ak-how', 'ak-root', 'ak-method'] as const
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the greatest intersection ratio
        let best: { id: typeof ids[number], ratio: number } | null = null
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id.replace('-sentinel', '') as typeof ids[number]
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { id, ratio: entry.intersectionRatio }
          }
        }
        if (best && best.ratio > 0.45 && best.id !== akSection) {
          setAkSection(best.id)
        }
      },
      {
        // Focus the middle band of the viewport to avoid header influence
        root: null,
        rootMargin: '-30% 0px -30% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    )

    for (const id of ids) {
      const el = document.getElementById(`${id}-sentinel`)
      if (el) observer.observe(el)
    }

    const topOverride = () => {
      if (window.scrollY < 80 && akSection !== 'ak-aurikinetics') setAkSection('ak-aurikinetics')
    }
    window.addEventListener('scroll', topOverride, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', topOverride)
    }
  }, [akSection])

  useEffect(() => {
    const updateNavLinePosition = () => {
      // Map sections to nav indices for reliable positioning
      const sectionToIndex = {
        'ak-aurikinetics': 0, // Aurikinetics
        'ak-what': 1, // What
        'ak-how': 2, // How
        'ak-root': 3, // Root
        'ak-method': 4  // Method
      };
      
      const activeIndex = sectionToIndex[akSection as keyof typeof sectionToIndex];
      if (activeIndex === undefined) return;
      
      // Find the nav container and get all nav items
      const navContainer = document.querySelector('nav');
      if (!navContainer) return;
      
      const navItems = navContainer.querySelectorAll('a');
      const activeNavItem = navItems[activeIndex];
      
      if (activeNavItem && navContainer) {
        const navRect = navContainer.getBoundingClientRect();
        const itemRect = activeNavItem.getBoundingClientRect();
        
        setNavLinePosition({
          x: itemRect.left - navRect.left,
          width: itemRect.width
        });
      }
    };

    // Update immediately and on resize
    updateNavLinePosition();
    window.addEventListener('resize', updateNavLinePosition);
    
    return () => {
      window.removeEventListener('resize', updateNavLinePosition);
    };
  }, [akSection]);

  const getAkBackground = (section: typeof akSection) => {
    const map: Record<typeof akSection, string> = {
      'ak-aurikinetics': "url(/ak-1.jpg)",
      'ak-what': "url(/muscle+testing.jpg)",
      'ak-how': "url(/DSC09936.jpeg)",
      'ak-root': "url(/supliful-supplements-on-demand-UTPZnnEVW4E-unsplash.jpg)",
      'ak-method': "url(/herbs.jpeg)"
    }
    return map[section]
  }

  const getAkMobileSrc = (section: typeof akSection) => {
    const map: Record<typeof akSection, string> = {
      'ak-aurikinetics': "/ak-1.jpg",
      'ak-what': "/muscle+testing.jpg",
      'ak-how': "/DSC09936.jpeg",
      'ak-root': "/supliful-supplements-on-demand-UTPZnnEVW4E-unsplash.jpg",
      'ak-method': "/herbs.jpeg"
    }
    return map[section]
  }

  return (
    <div className="ak-root font-futuristic relative bg-cover bg-center bg-no-repeat">
      {/* Background layer - desktop/tablet uses CSS background; phones use dedicated <img> */}
      {!isPhone ? (
        <div
          key={akSection}
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: getAkBackground(akSection),
            backgroundSize: isPhone ? undefined : 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      ) : (
        <img
          key={akSection}
          src={getAkMobileSrc(akSection)}
          alt=""
          className="fixed inset-0 z-0 w-full h-[100vh] object-cover object-center pointer-events-none select-none"
          decoding="async"
          loading="eager"
        />
      )}

      <div className="fixed inset-0 z-10 pointer-events-none bg-black/50"></div>

      <header className="sticky top-0 z-50 transition-all duration-1000 ease-in-out bg-transparent relative" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="relative flex h-16 items-center justify-between px-4 sm:h-24 sm:block sm:px-0">
          <a href="/">
            <div className="text-lg sm:text-xl font-ivymode font-light sm:absolute sm:top-8 sm:left-8 transition-colors duration-300 text-white uppercase tracking-wide">
              Syntropy.Institute
            </div>
          </a>
          <nav className="hidden sm:flex sm:absolute sm:top-8 sm:right-4 items-center space-x-8 text-lg font-medium transition-colors duration-300 text-white relative">
            {[
              { id: 'ak-aurikinetics', label: 'Aurikinetics' },
              { id: 'ak-what', label: 'What' },
              { id: 'ak-how', label: 'How' },
              { id: 'ak-root', label: 'Root' },
              { id: 'ak-method', label: 'Method' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleAnchor(e, item.id)}
                className="cursor-pointer transition-colors relative hover:text-gray-300"
              >
                {item.label}
              </a>
            ))}
            
            {/* Desktop menu button */}
            <motion.button
              className="z-50 flex h-8 w-8 flex-col items-center justify-center ml-4"
              onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
            >
              <motion.span className="mb-1 h-0.5 w-6 transition-colors duration-300 bg-white" animate={{ rotate: desktopMenuOpen ? 45 : 0, y: desktopMenuOpen ? 6 : 0 }} />
              <motion.span className="mb-1 h-0.5 w-6 transition-colors duration-300 bg-white" animate={{ opacity: desktopMenuOpen ? 0 : 1 }} />
              <motion.span className="h-0.5 w-6 transition-colors duration-300 bg-white" animate={{ rotate: desktopMenuOpen ? -45 : 0, y: desktopMenuOpen ? -6 : 0 }} />
            </motion.button>
            
            <motion.div
              className="absolute bottom-0 h-0.5 bg-white transition-colors duration-300"
              initial={false}
              animate={{
                x: navLinePosition.x,
                width: navLinePosition.width
              }}
              transition={{ type: 'tween', duration: 0.15, ease: 'easeOut' }}
              style={{ bottom: '-8px', willChange: 'transform, width' }}
            />
          </nav>

          <motion.button
            className="z-50 flex h-8 w-8 flex-col items-center justify-center sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <motion.span className="mb-1 h-0.5 w-6 transition-colors duration-300 bg-white" animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 6 : 0 }} />
            <motion.span className="mb-1 h-0.5 w-6 transition-colors duration-300 bg-white" animate={{ opacity: mobileMenuOpen ? 0 : 1 }} />
            <motion.span className="h-0.5 w-6 transition-colors duration-300 bg-white" animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -6 : 0 }} />
          </motion.button>
        </div>
      </header>

      {/* Desktop Menu Overlay */}
      <AnimatePresence>
        {desktopMenuOpen && (
          <motion.div
            className="hidden sm:flex fixed inset-0 z-40 flex-col items-center justify-center bg-black/90 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[
              { label: 'Syntropy', href: '/' },
              { label: 'AuraKinetics', href: '/aurakinetics' },
              { label: 'About Our Services', href: '/services' },
              { label: 'Book a Session', href: '#', onClick: () => setAkLightbox({
                title: 'Book a Session',
                content: 'Contact us to schedule your personalized Syntropy session and begin your journey to optimal health and wellness.'
              }) },
              { label: 'About Yunasai Ministry', href: '#', onClick: () => setAkLightbox({
                title: 'About Yunasai Ministry',
                content: 'Yunasai Ministry is a Private Ministerial Association operating within the private domain under Ecclesiastical Law. Our services are for spiritual and educational purposes only.'
              }) },
              { label: 'Member Disclosure & Agreement', href: '#', onClick: () => setAkLightbox({
                title: 'Member Disclosure & Agreement',
                content: 'By engaging with our services, you automatically join our Private Membership Association. Please review our terms and membership agreement.'
              }) }
            ].map((item, itemIndex) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    setDesktopMenuOpen(false);
                    item.onClick();
                  } else {
                    setDesktopMenuOpen(false);
                  }
                }}
                className="text-2xl font-medium mb-8 cursor-pointer transition-colors text-white hover:text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: itemIndex * 0.1 }}
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="sm:hidden fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/90 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[
              { label: 'Syntropy', href: '/' },
              { label: 'AuraKinetics', href: '/aurakinetics' },
              { label: 'About Our Services', href: '/services' },
              { label: 'Book a Session', href: '#', onClick: () => setAkLightbox({
                title: 'Book a Session',
                content: 'Contact us to schedule your personalized Syntropy session and begin your journey to optimal health and wellness.'
              }) },
              { label: 'About Yunasai Ministry', href: '#', onClick: () => setAkLightbox({
                title: 'About Yunasai Ministry',
                content: 'Yunasai Ministry is a Private Ministerial Association operating within the private domain under Ecclesiastical Law. Our services are for spiritual and educational purposes only.'
              }) },
              { label: 'Member Disclosure & Agreement', href: '#', onClick: () => setAkLightbox({
                title: 'Member Disclosure & Agreement',
                content: 'By engaging with our services, you automatically join our Private Membership Association. Please review our terms and membership agreement.'
              }) }
            ].map((item, itemIndex) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    item.onClick();
                  } else {
                    setMobileMenuOpen(false);
                  }
                }}
                className="text-2xl font-medium mb-8 cursor-pointer transition-colors text-white hover:text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: itemIndex * 0.1 }}
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="-mt-16 sm:-mt-24 relative">
        <section id="ak-aurikinetics" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="ak-aurikinetics-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-kudryashev text-white drop-shadow-xl tracking-wide uppercase whitespace-nowrap mb-4">
                AuraKinetics
              </div>
              <div className="text-base sm:text-xl md:text-2xl lg:text-3xl tracking-widest text-white/90 uppercase font-ivymode mb-2">
                A Revolutionary Approach to Body Assessment
              </div>
              <div className="text-sm sm:text-lg md:text-xl text-white/90 font-ivymode">
                Offered through Yunasai Ministries
              </div>
            </div>
          </div>
        </section>

        <section id="ak-what" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="ak-what-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <p className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[18px] sm:text-2xl lg:text-4xl">
                Aurakinetics is a non-invasive, integrative art that combines facial analysis, iridology, and advanced muscle testing to identify the best healing path for your body.
              </p>
            </div>
          </div>
        </section>

        <section id="ak-how" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="ak-how-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <p className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[18px] sm:text-2xl lg:text-4xl">
                We assess the body’s electrical circuitry in real time–  No guesswork, just pure bio-intelligence.
              </p>
            </div>
          </div>
        </section>

        <section id="ak-root" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="ak-root-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <p className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[18px] sm:text-2xl lg:text-4xl">
                We go beyond “fixing” symptoms to get to the root of what is ailing you.
              </p>
            </div>
          </div>
        </section>

        <section id="ak-method" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="ak-method-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-kudryashev font-light text-white drop-shadow-xl tracking-wide uppercase mx-auto text-center">
                The AuraKinetics® Method
              </h2>
              <p className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[18px] sm:text-2xl lg:text-3xl">
                "Discover the root causes of imbalances in your body and the exact steps to bring it back into alignment."
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[{
                  icon: '/ak-icon-1.webp',
                  title: 'Manual Kinetic Assessment',
                  content: 'Aurakinetics involves a two-part assessment. First, we scan vitamin and mineral levels, as well as identify ALL organ and gland imbalances or congestion. Next, using our cutting-edge Kinesiological Tracing Method® to pinpoint exactly what your body needs to restore balance.'
                }, {
                  icon: '/ak-icon-2.webp',
                  title: 'Herbs & Supplementation',
                  content: 'Personalized herb and supplement recommendations to support your body\'s healing based on your unique assessment.'
                }, {
                  icon: '/ak-icon-3.webp',
                  title: 'Personal Wellness Plan',
                  content: 'After your session, you’ll receive a full protocol with your recommended herbs and supplements, as well as a daily regimen of other practices and suggestions.'
                }].map((item) => (
                  <div key={item.title} className="flex flex-col items-center text-center">
                    <img src={item.icon} alt="" className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-3 select-none pointer-events-none" />
                    <motion.button
                      onClick={() => setAkLightbox({ title: item.title, content: item.content })}
                      className="px-4 py-2 text-base sm:text-lg font-medium border-2 border-white/80 rounded-full transition-all duration-300 hover:bg-white/20 text-white/90 hover:text-white bg-transparent backdrop-blur-sm w-full sm:w-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.title}
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Back Button */}
      {akSection !== 'ak-aurikinetics' && (
      <motion.button
        onClick={(e) => {
          const sections = ['ak-aurikinetics', 'ak-what', 'ak-how', 'ak-root', 'ak-method'];
          const currentIndex = sections.indexOf(akSection);
          const prevIndex = currentIndex - 1;
          
          if (prevIndex >= 0) {
            const prevSection = sections[prevIndex];
            e.preventDefault();
            const el = document.getElementById(prevSection);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
          }
        }}
        className={`fixed bottom-8 z-50 flex items-center justify-center shadow-lg transition-all duration-300 ${
          isPhone 
            ? 'right-24 w-14 h-14 rounded-full border-2' 
            : 'right-40 px-6 py-3 rounded-full border-2 min-w-[120px]'
        } bg-white border-white text-black hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] font-medium`}
        whileHover={{ boxShadow: "0 0 25px rgba(255,255,255,0.8)" }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        title="Go to previous section"
      >
          <svg 
            width="24" 
            height="24"
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="sm:mr-2"
          >
            <path 
              d="M19 12H5M12 19l-7-7 7-7" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        <span className="hidden sm:inline text-sm font-semibold">Back</span>
      </motion.button>
      )}

      {/* Floating Next Button */}
      {akSection !== 'ak-method' && (
      <motion.button
        onClick={(e) => {
          const sections = ['ak-aurikinetics', 'ak-what', 'ak-how', 'ak-root', 'ak-method'];
          const currentIndex = sections.indexOf(akSection);
          const nextIndex = currentIndex + 1;
          
          if (nextIndex < sections.length) {
            const nextSection = sections[nextIndex];
            e.preventDefault();
            const el = document.getElementById(nextSection);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
          }
        }}
        className={`fixed bottom-8 right-8 z-50 flex items-center justify-center shadow-lg transition-all duration-300 ${
          isPhone 
            ? 'w-14 h-14 rounded-full border-2' 
            : 'px-6 py-3 rounded-full border-2 min-w-[120px]'
        } border-white bg-transparent text-white hover:bg-gray-800 hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] font-medium`}
        whileHover={{ boxShadow: "0 0 25px rgba(255,255,255,0.8)" }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        title="Go to next section"
      >
        <span className="hidden sm:inline text-sm font-semibold">Next</span>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="sm:ml-2"
          >
            <path 
              d="M5 12h14M12 5l7 7-7 7" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
      </motion.button>
      )}

      {/* Floating End Button for Last Section */}
      {akSection === 'ak-method' && (
      <motion.button
        onClick={() => {
          // Scroll to top or show end message
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`fixed bottom-8 right-8 z-50 flex items-center justify-center shadow-lg transition-all duration-300 ${
          isPhone 
            ? 'w-14 h-14 rounded-full border-2' 
            : 'px-6 py-3 rounded-full border-2 min-w-[120px]'
        } border-white bg-transparent text-white hover:bg-gray-800 hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] font-medium`}
        whileHover={{ boxShadow: "0 0 25px rgba(255,255,255,0.8)" }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        title="Return to beginning"
      >
        <span className="hidden sm:inline text-sm font-semibold">End</span>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="sm:ml-2"
          >
            <path 
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
      </motion.button>
      )}

      <AnimatePresence>
        {akLightbox && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAkLightbox(null)}
            style={{ backgroundImage: 'url(/syntropy.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/60"></div>

            <motion.div
              className="relative max-w-4xl max-h[85vh] mx-4 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-3xl"></div>

              <button
                onClick={() => setAkLightbox(null)}
                className="absolute -top-14 right-2 text-white/80 hover:text-white transition-all duration-300 hover:scale-110 z-20"
                aria-label="Close modal"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
              </button>

              <motion.div className="p-10 sm:p-14 text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                <motion.h3 className="text-3xl sm:text-4xl lg:text-5xl font-ivymode font-light text-white mb-3 tracking-wider drop-shadow-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
                  {akLightbox.title}
                </motion.h3>
                <motion.p className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-white/95 max-w-3xl mx-auto drop-shadow-lg font-rajdhani" style={{ lineHeight: '1.8' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
                  {akLightbox.content}
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const isAk = window.location.pathname === '/aurakinetics'
const isServices = window.location.pathname === '/services'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAk ? <AkApp /> : isServices ? <ServicesApp /> : <App />}
  </StrictMode>,
)

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}
