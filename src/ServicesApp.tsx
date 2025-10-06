import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'

function ServicesApp() {
  const [isPhone, setIsPhone] = useState(window.innerWidth < 640)
  const [servicesLightbox, setServicesLightbox] = useState<{ title: string, content: string } | null>(null)
  const [servicesSection, setServicesSection] = useState<'services-frequency' | 'services-kinetics' | 'services-concierge' | 'services-membership' | 'services-timeframes' | 'services-disclaimer'>('services-frequency')
  const [isLongTermModalOpen, setIsLongTermModalOpen] = useState(false)
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false)
  const [isPrecisionModalOpen, setIsPrecisionModalOpen] = useState(false)
  const [isCoachingModalOpen, setIsCoachingModalOpen] = useState(false)
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [navLinePosition, setNavLinePosition] = useState({ x: 0, width: 0 })

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (servicesLightbox || isLongTermModalOpen || isIntroModalOpen || isPrecisionModalOpen || isCoachingModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [servicesLightbox, isLongTermModalOpen, isIntroModalOpen, isPrecisionModalOpen, isCoachingModalOpen])

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
    const ids = ['services-frequency', 'services-kinetics', 'services-concierge', 'services-membership', 'services-timeframes', 'services-disclaimer'] as const
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
        if (best && best.ratio > 0.45 && best.id !== servicesSection) {
          setServicesSection(best.id)
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
      if (window.scrollY < 80 && servicesSection !== 'services-frequency') setServicesSection('services-frequency')
    }
    window.addEventListener('scroll', topOverride, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', topOverride)
    }
  }, [servicesSection])

  useEffect(() => {
    const updateNavLinePosition = () => {
      // Map sections to nav indices for reliable positioning
      const sectionToIndex = {
        'services-frequency': 0, // What it is
        'services-kinetics': 1, // Plans
        'services-concierge': 2, // Go All In
        'services-membership': 3, // Coaching
        'services-timeframes': 4, // Timeframes
        'services-disclaimer': 5  // Hours
      };
      
      const activeIndex = sectionToIndex[servicesSection as keyof typeof sectionToIndex];
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
  }, [servicesSection]);

  const getServicesBackground = (section: typeof servicesSection) => {
    const map: Record<typeof servicesSection, string> = {
      'services-frequency': "url(/services-2.jpg)",
      'services-kinetics': "url(/vitalfield-1.jpg)",
      'services-concierge': "url(/5.jpg)",
      'services-membership': "url(/6.jpg)",
      'services-timeframes': "url(/1.jpg)",
      'services-disclaimer': "url(/2.jpg)"
    }
    return map[section]
  }

  const getServicesMobileSrc = (section: typeof servicesSection) => {
    const map: Record<typeof servicesSection, string> = {
      'services-frequency': "/services-2.jpg",
      'services-kinetics': "/vitalfield-1.jpg",
      'services-concierge': "/mobile-5.jpg",
      'services-membership': "/mobile-6.jpg",
      'services-timeframes': "/mobile-1.jpg",
      'services-disclaimer': "/mobile-2.jpg"
    }
    return map[section]
  }

  return (
    <div className="services-root font-futuristic relative bg-cover bg-center bg-no-repeat">
      {/* Background layer - desktop/tablet uses CSS background; phones use dedicated <img> */}
      {!isPhone ? (
        <div
          key={servicesSection}
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: getServicesBackground(servicesSection),
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      ) : (
        <img
          key={servicesSection}
          src={getServicesMobileSrc(servicesSection)}
          alt=""
          className="fixed inset-0 z-0 w-full h-[100vh] object-cover object-center pointer-events-none select-none"
          decoding="async"
          loading="eager"
        />
      )}

      <div className={`fixed inset-0 z-10 pointer-events-none ${servicesSection === 'services-frequency' || servicesSection === 'services-kinetics' ? 'bg-black/80' : 'bg-black/50'}`}></div>

      <header className="sticky top-0 z-50 transition-all duration-1000 ease-in-out bg-transparent relative" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="relative flex h-16 items-center justify-between px-4 sm:h-24 sm:block sm:px-0">
          <a href="/">
            <div className="text-lg sm:text-xl font-ivymode font-light sm:absolute sm:top-8 sm:left-8 transition-colors duration-300 text-white uppercase tracking-wide">
              Syntropy.Institute
            </div>
          </a>
        <nav className="hidden sm:flex sm:absolute sm:top-8 sm:right-4 items-center space-x-8 text-lg font-medium transition-colors duration-300 text-white relative">
          {[
            { id: 'services-frequency', label: 'What it is' },
            { id: 'services-kinetics', label: 'Plans' },
            { id: 'services-concierge', label: 'Go All In' },
            { id: 'services-membership', label: 'Coaching' },
            { id: 'services-timeframes', label: 'Timeframes' },
            { id: 'services-disclaimer', label: 'Hours' },
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
              { label: 'Our Services', href: '/services' },
              { label: 'Yunasai Ministry', href: '/yunasai' },
              { label: 'Book a Session', href: '#', onClick: () => setServicesLightbox({
                title: 'Book a Session',
                content: 'Contact us to schedule your personalized Syntropy session and begin your journey to optimal health and wellness.'
              }) },
              { label: 'Member Disclosure & Agreement', href: '#', onClick: () => setServicesLightbox({
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
              { label: 'Our Services', href: '/services' },
              { label: 'Yunasai Ministry', href: '/yunasai' },
              { label: 'Book a Session', href: '#', onClick: () => setServicesLightbox({
                title: 'Book a Session',
                content: 'Contact us to schedule your personalized Syntropy session and begin your journey to optimal health and wellness.'
              }) },
              { label: 'Member Disclosure & Agreement', href: '#', onClick: () => setServicesLightbox({
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
        <section id="services-frequency" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="services-frequency-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-kudryashev font-light text-white drop-shadow-xl tracking-wide uppercase mx-auto text-center mb-6">
                What it is
              </h2>
              <div className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[16px] sm:text-lg lg:text-xl">
                <p className="mb-4">
                  This advanced integrative service combines AuraKinetics® and Frequency Analysis-Therapy to provide deep insights into the root causes of imbalance and chronic dysfunction—bridging manual diagnostics with frequency-based healing.
                </p>
                <p>
                  Using cutting-edge, non-invasive techniques, we analyze the human biofield to identify core blockages and inefficiencies. Then, through precise energetic frequencies, we guide the body toward optimal function, self-regulation, and accelerated healing.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="services-kinetics" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative overflow-hidden">
          <div id="services-kinetics-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              
              {/* Introductory Precision Scan */}
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-kudryashev font-light text-white drop-shadow-xl tracking-wide uppercase mb-6">
                Introductory Precision Scan
              </h3>
              <p className="text-xl sm:text-2xl text-white/90 font-playfair font-light mb-6">
                Your introduction into Syntropy
              </p>
              <div className="text-4xl sm:text-5xl font-kudryashev text-white mb-6">$500</div>
              <div className="text-white/95 font-playfair font-light text-lg sm:text-xl leading-relaxed mb-8">
                <p className="mb-3">A comprehensive AuraKinetics® Assessment</p>
                <p className="mb-3">• One personalized Syntropy Frequency Analysis-Therapy</p>
                <p className="text-base text-white/80 italic">Note: Herbal formulas are not included</p>
              </div>

              {/* Buttons to open modals */}
              <div className="flex justify-center gap-3 sm:gap-4">
                <motion.button
                  onClick={() => setIsIntroModalOpen(true)}
                  className="px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg lg:text-xl font-medium border-2 border-white/80 rounded-full transition-all duration-300 hover:bg-white/20 text-white/90 hover:text-white bg-transparent backdrop-blur-sm flex-1 sm:flex-none max-w-[140px] sm:max-w-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Introductory
                </motion.button>
                <motion.button
                  onClick={() => setIsLongTermModalOpen(true)}
                  className="px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg lg:text-xl font-medium border-2 border-white/80 rounded-full transition-all duration-300 hover:bg-white/20 text-white/90 hover:text-white bg-transparent backdrop-blur-sm flex-1 sm:flex-none max-w-[140px] sm:max-w-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Long Term
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        <section id="services-concierge" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="services-concierge-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-kudryashev font-light text-white drop-shadow-xl tracking-wide uppercase mx-auto text-center mb-6">
                Go All In?
              </h2>
              <div className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[16px] sm:text-lg lg:text-xl space-y-4">
                <p>You've had a taste of what's possible. Now it's time to go deeper.</p>
                <p>If your intro session brought relief, insight, or clarity—this is your path forward. The Precision Healing Packages are customized 3–12 month journeys combining physical, mental, emotional and spiritual healing through guided integration, subconscious work, and herbal support.</p>
                <p>This is where true healing happens—complete recalibration across all levels.</p>
              </div>

              {/* Button to open precision modal */}
              <div className="mt-8">
                <motion.button
                  onClick={() => setIsPrecisionModalOpen(true)}
                  className="px-8 py-4 text-lg sm:text-xl font-medium border-2 border-white/80 rounded-full transition-all duration-300 hover:bg-white/20 text-white/90 hover:text-white bg-transparent backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Precision Plan
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        <section id="services-membership" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="services-membership-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-kudryashev font-light text-white drop-shadow-xl tracking-wide uppercase mx-auto text-center mb-6">
                Coaching-Inclusive Packages
              </h2>
              <div className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[16px] sm:text-lg lg:text-xl space-y-4">
                <p>For those ready to go deeper, select plans also include Kaleb's coaching and therapeutic guidance.</p>
              </div>

              {/* Button to open coaching modal */}
              <div className="mt-8">
                <motion.button
                  onClick={() => setIsCoachingModalOpen(true)}
                  className="px-8 py-4 text-lg sm:text-xl font-medium border-2 border-white/80 rounded-full transition-all duration-300 hover:bg-white/20 text-white/90 hover:text-white bg-transparent backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  See Details
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        <section id="services-timeframes" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="services-timeframes-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-kudryashev font-light text-white drop-shadow-xl tracking-wide uppercase mx-auto text-center mb-6">
                Flexible Timeframes
              </h2>
              <div className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[16px] sm:text-lg lg:text-xl space-y-4">
                <p>Whether you prefer a 3-month foundation, a 6-month deep healing journey, or a 12-month mastery experience, your plan is fully customized. Instead of preset pricing, each package is individually tailored based on your needs, your goals, and the depth of coaching desired.</p>
                <p>This leaves room for flexibility—ensuring that your healing journey is not only effective, but aligned with your personal path and investment comfort.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="services-disclaimer" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="services-disclaimer-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="max-w-xs sm:max-w-4xl md:max-w-5xl lg:max-w-6xl w-full mx-auto px-2 sm:px-4">
              
              {/* Two column layout for desktop, stacked for mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                
                {/* Disclaimer - Takes up 2 columns on desktop */}
                <div className="lg:col-span-2">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-kudryashev font-light text-white drop-shadow-xl tracking-wide uppercase mb-6">
                    Disclaimer
                  </h3>
                  <div className="text-white/90 font-playfair font-light text-sm sm:text-base leading-relaxed">
                    <p>
                      Yunasai Ministry is a Private Ministerial Association operating within the private domain under Ecclesiastical Law. The information and services provided by Yunasai Ministry are for spiritual and educational purposes only. All content, services, and communications provided are intended exclusively for members of the Ministry and are not subject to public jurisdiction or regulatory oversight.
                    </p>
                    <p className="mt-4">
                      We do not diagnose, treat, or prevent disease. Nothing presented by the Ministry or its trustees is intended to be a substitute for medical advice, diagnosis, or treatment from a licensed healthcare provider.
                    </p>
                  </div>
                </div>

                {/* Location & Hours - Takes up 1 column on desktop */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:space-y-8 lg:grid-cols-1">
                  {/* Location */}
                  <div>
                    <h3 className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-kudryashev font-light text-white drop-shadow-xl tracking-wide uppercase mb-3 lg:mb-4">
                      Location
                    </h3>
                    <div className="text-white/90 font-playfair font-light text-xs sm:text-sm lg:text-base leading-relaxed">
                      <p>7904 FM-969</p>
                      <p>Austin, TX 78724</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div>
                    <h3 className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-kudryashev font-light text-white drop-shadow-xl tracking-wide uppercase mb-3 lg:mb-4">
                      Hours
                    </h3>
                    <div className="text-white/90 font-playfair font-light text-xs sm:text-sm lg:text-base leading-relaxed space-y-1 lg:space-y-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span>Monday — Saturday</span>
                        <span>11am — 6pm</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span>Sunday</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Back Button */}
      {servicesSection !== 'services-frequency' && (
      <motion.button
        onClick={(e) => {
          const sections = ['services-frequency', 'services-kinetics', 'services-concierge', 'services-membership', 'services-timeframes', 'services-disclaimer'];
          const currentIndex = sections.indexOf(servicesSection);
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
      {servicesSection !== 'services-disclaimer' && (
      <motion.button
        onClick={(e) => {
          const sections = ['services-frequency', 'services-kinetics', 'services-concierge', 'services-membership', 'services-timeframes', 'services-disclaimer'];
          const currentIndex = sections.indexOf(servicesSection);
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
      {servicesSection === 'services-disclaimer' && (
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
        {servicesLightbox && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-xl p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setServicesLightbox(null)}
            style={{ backgroundImage: 'url(/syntropy.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/60"></div>

            <motion.div
              className={`relative ${servicesLightbox.title === 'Book a Session' ? 'max-w-5xl w-full h-[85vh]' : 'max-w-4xl max-h-[85vh]'} mx-4 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-3xl pointer-events-none"></div>

              <button
                onClick={() => setServicesLightbox(null)}
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

                {servicesLightbox.title === 'Book a Session' ? (
                  <motion.div
                    className="h-full flex flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <div className="p-6 sm:p-8 text-center border-b border-white/10 flex-shrink-0">
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-ivymode font-light text-white tracking-wider drop-shadow-2xl">
                        Book a Session
                      </h3>
                    </div>
                    <div className="flex-1 min-h-0">
                      <iframe
                        src="https://cal.com/syntropy"
                        className="w-full h-full border-0"
                        title="Book a Session"
                      />
                    </div>
                  </motion.div>
                ) : (
                <motion.div className="p-10 sm:p-14 text-center overflow-y-auto max-h-full" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                  <motion.h3 className="text-3xl sm:text-4xl lg:text-5xl font-ivymode font-light text-white mb-3 tracking-wider drop-shadow-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
                    {servicesLightbox.title}
                  </motion.h3>
                  <motion.p className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-white/95 max-w-3xl mx-auto drop-shadow-lg font-rajdhani" style={{ lineHeight: '1.8' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
                    {servicesLightbox.content}
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Long-Term Plans Modal */}
      <AnimatePresence>
        {isLongTermModalOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLongTermModalOpen(false)}
            />
            
            <motion.div
              className="relative bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Close button */}
              <button
                onClick={() => setIsLongTermModalOpen(false)}
                className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <path d="M6 6l12 12M6 18L18 6"/>
                  </svg>
                </div>
              </button>

              <div className="p-8 sm:p-12">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-kudryashev font-light text-white drop-shadow-xl tracking-wide uppercase mb-6 text-center">
                  Long-Term Healing Plans
                </h3>
                <p className="text-xl sm:text-2xl text-white/90 font-playfair font-light mb-8 text-center">
                  Individualized 3–12 Month Healing Protocols
                </p>
                
                <div className="space-y-6 text-white/95 font-playfair font-light text-base sm:text-lg leading-relaxed">
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="text-xl font-semibold text-white mb-3">3-Month Foundations</h4>
                    <p>Includes 8 Precision Frequency Scans + Personalized Herbal Protocols.</p>
                  </div>
                  
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="text-xl font-semibold text-white mb-3">3-Month with Coaching</h4>
                    <p>Everything in the Foundations plan, plus Kaleb's personal guidance using Parts Work, Body Talk Therapy, and metaphysical root-cause healing.</p>
                  </div>
                  
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="text-xl font-semibold text-white mb-3">6-Month Deep Healing</h4>
                    <p>An extended version of the coaching-inclusive package for sustained recalibration, expanded support, and deeper transformation.</p>
                  </div>
                  
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="text-xl font-semibold text-white mb-3">12-Month Mastery</h4>
                    <p>A full year of the coaching-inclusive package—the most complete and immersive option for total realignment across physical, mental, emotional, and spiritual levels.</p>
                  </div>
                  
                  <div className="mt-8 p-6 bg-white/10 rounded-xl border border-white/20">
                    <p className="text-sm sm:text-base text-white/90 italic text-center">
                      Note: Pricing is fully customized to your needs and level of support. Your introductory scan serves as the gateway to determine the most aligned path forward.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Introductory Plan Modal */}
      <AnimatePresence>
        {isIntroModalOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsIntroModalOpen(false)}
            />
            
            <motion.div
              className="relative bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Close button */}
              <button
                onClick={() => setIsIntroModalOpen(false)}
                className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <path d="M6 6l12 12M6 18L18 6"/>
                  </svg>
                </div>
              </button>

              <div className="p-8 sm:p-12">
                <div className="text-center mb-8">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-kudryashev font-light text-white drop-shadow-xl tracking-wide uppercase mb-4">
                    $500 Introductory Precision Scan
                  </h3>
                </div>
                
                <div className="space-y-6 text-white/95 font-playfair font-light text-base sm:text-lg leading-relaxed">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-4">Includes:</h4>
                    
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div className="flex-1">
                          <p className="font-semibold text-white">• AuraKinetics® Assessment</p>
                          <p className="text-white/80 text-sm sm:text-base mt-1">
                            A full-body diagnostic using iridology, facial mapping, and refined muscle testing to identify root imbalances and assess your body's energetic circuitry.
                          </p>
                        </div>
                        <div className="text-white/70 text-sm font-medium whitespace-nowrap">
                          (Value: $250)
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div className="flex-1">
                          <p className="font-semibold text-white">• Syntropy Frequency Analysis-Therapy</p>
                          <p className="text-white/80 text-sm sm:text-base mt-1">
                            A personalized frequency scan to detect blockages and deliver a digital remedy tailored to your biofield in real-time.
                          </p>
                        </div>
                        <div className="text-white/70 text-sm font-medium whitespace-nowrap">
                          (Value: $250)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-sm text-white/90 italic">
                      Note: Herbal formulas are not included in this intro package, but may be recommended based on findings.
                    </p>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-xl font-semibold text-white mb-3">Why Start Here?</h4>
                    <p className="text-white/90">
                      This $500 entry point gives you a real experience of the precision and impact of our work—with zero guesswork. It's ideal if you're curious, committed, or need proof before investing deeper.
                    </p>
                  </div>

                  <div className="mt-8 p-6 bg-white/10 rounded-xl border border-white/20">
                    <h4 className="text-xl font-semibold text-white mb-3">Love the Results? Upgrade to Full Healing Plan</h4>
                    <p className="text-white/90">
                      Your $500 intro rolls directly into your chosen long-term package—just pay the difference.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Precision Plan Modal */}
      <AnimatePresence>
        {isPrecisionModalOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrecisionModalOpen(false)}
            />
            
            <motion.div
              className="relative bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl max-w-5xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Close button */}
              <button
                onClick={() => setIsPrecisionModalOpen(false)}
                className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <path d="M6 6l12 12M6 18L18 6"/>
                  </svg>
                </div>
              </button>

              <div className="p-8 sm:p-12">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-kudryashev font-light text-white drop-shadow-xl tracking-wide uppercase mb-6 text-center">
                  The Precision Healing Packages
                </h3>
                <div className="space-y-6 text-white/95 font-playfair font-light text-base sm:text-lg leading-relaxed">
                  <p>
                    Healing is not one-size-fits-all. After your Introductory Precision Scan, we'll design a personalized plan tailored to your unique needs and goals.
                  </p>
                  <p>
                    Every package is built around the four pillars of health—physical, emotional, mental, and spiritual—so healing happens on every level.
                  </p>
                  
                  <div className="mt-8">
                    <h4 className="text-2xl font-semibold text-white mb-6 text-center">What's Included in Every Healing Journey:</h4>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <h5 className="text-lg font-semibold text-white mb-2">Precision Care</h5>
                        <p>Structured sessions designed around your unique YOU.</p>
                      </div>
                      
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <h5 className="text-lg font-semibold text-white mb-2">Individualized Syntropy Frequency Sessions</h5>
                        <p>Regular recalibration to support sustained healing—typically 8 sessions every 3 months.</p>
                      </div>
                      
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <h5 className="text-lg font-semibold text-white mb-2">Herbal Formulas</h5>
                        <p>Time-tested for over 40 years and precision-formulated to address the underlying root causes of imbalance.</p>
                      </div>
                      
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <h5 className="text-lg font-semibold text-white mb-2">VitalField Frequencell™ Wearable Patch</h5>
                        <p>Customized to your frequency profile for ongoing support.</p>
                      </div>
                      
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <h5 className="text-lg font-semibold text-white mb-2">Ongoing Assessment & Adjustments</h5>
                        <p>Real-time refinements as your body evolves.</p>
                      </div>
                      
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <h5 className="text-lg font-semibold text-white mb-2">Concierge Hotline</h5>
                        <p>Direct access for questions and guidance between sessions.</p>
                      </div>
                      
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <h5 className="text-lg font-semibold text-white mb-2">Progress Tracking & Data Insights</h5>
                        <p>Shareable logs, practitioner notes, and scan data for ongoing clarity.</p>
                      </div>
                      
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <h5 className="text-lg font-semibold text-white mb-2">Full Support from Our Healing Team</h5>
                        <p>A dedicated team walking with you every step of the way.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coaching Details Modal */}
      <AnimatePresence>
        {isCoachingModalOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCoachingModalOpen(false)}
            />
            
            <motion.div
              className="relative bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Close button */}
              <button
                onClick={() => setIsCoachingModalOpen(false)}
                className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <path d="M6 6l12 12M6 18L18 6"/>
                  </svg>
                </div>
              </button>

              <div className="p-8 sm:p-12">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-kudryashev font-light text-white drop-shadow-xl tracking-wide uppercase mb-6 text-center">
                  Coaching & Therapeutic Guidance
                </h3>
                
                <div className="space-y-6 text-white/95 font-playfair font-light text-base sm:text-lg leading-relaxed">
                  <p className="text-center mb-8">
                    For those ready to go deeper, select plans also include Kaleb's coaching and therapeutic guidance, such as:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h5 className="text-lg font-semibold text-white mb-2">Parts Work</h5>
                      <p>Integrating the inner self for wholeness</p>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h5 className="text-lg font-semibold text-white mb-2">Body Talk Therapy</h5>
                      <p>Connecting body, mind, and energy systems</p>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h5 className="text-lg font-semibold text-white mb-2">Dialoguing with Your Dis-ease</h5>
                      <p>Uncovering the messages behind symptoms</p>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h5 className="text-lg font-semibold text-white mb-2">Metaphysical Exploration of Root Causes</h5>
                      <p>Grief, anger, trauma, past experiences, and more</p>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h5 className="text-lg font-semibold text-white mb-2">Emotional Release Work</h5>
                      <p>Transforming unresolved trauma into healing</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ServicesApp
