import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'

function YunasaiApp() {
  const [isPhone, setIsPhone] = useState(window.innerWidth < 640)
  const [yunasaiLightbox, setYunasaiLightbox] = useState<{ title: string, content: string } | null>(null)
  const [yunasaiSection, setYunasaiSection] = useState<'yunasai-intro' | 'yunasai-who' | 'yunasai-mission' | 'yunasai-what' | 'yunasai-legal' | 'yunasai-minister'>('yunasai-intro')
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [navLinePosition, setNavLinePosition] = useState({ x: 0, width: 0 })

  // Lock body scroll when modal is open
  useEffect(() => {
    if (yunasaiLightbox) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [yunasaiLightbox])

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
    const ids = ['yunasai-intro', 'yunasai-who', 'yunasai-mission', 'yunasai-what', 'yunasai-legal', 'yunasai-minister'] as const
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
        if (best && best.ratio > 0.45 && best.id !== yunasaiSection) {
          setYunasaiSection(best.id)
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
      if (window.scrollY < 80 && yunasaiSection !== 'yunasai-intro') setYunasaiSection('yunasai-intro')
    }
    window.addEventListener('scroll', topOverride, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', topOverride)
    }
  }, [yunasaiSection])

  useEffect(() => {
    const updateNavLinePosition = () => {
      // Map sections to nav indices for reliable positioning
      const sectionToIndex = {
        'yunasai-intro': 0,
        'yunasai-who': 1,
        'yunasai-mission': 2,
        'yunasai-what': 3,
        'yunasai-legal': 4,
        'yunasai-minister': 5
      };
      
      const activeIndex = sectionToIndex[yunasaiSection as keyof typeof sectionToIndex];
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
  }, [yunasaiSection]);

  const getSectionBackground = (section: typeof yunasaiSection) => {
    // Alternating cream backgrounds
    const map: Record<typeof yunasaiSection, string> = {
      'yunasai-intro': '#F5F1E8',      // Light cream
      'yunasai-who': '#E8E0D5',         // Darker cream
      'yunasai-mission': '#F5F1E8',     // Light cream
      'yunasai-what': '#E8E0D5',        // Darker cream
      'yunasai-legal': '#F5F1E8',       // Light cream
      'yunasai-minister': '#E8E0D5'     // Darker cream
    }
    return map[section]
  }

  const getTextColor = () => {
    return '#2C2416' // Dark brown text for all sections
  }

  return (
    <div className="yunasai-root font-futuristic relative">
      {/* Fixed background that changes color */}
      <div
        className="fixed inset-0 z-0 transition-colors duration-700"
        style={{ backgroundColor: getSectionBackground(yunasaiSection) }}
      />

      <header className="sticky top-0 z-50 transition-all duration-1000 ease-in-out bg-transparent relative" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="relative flex h-16 items-center justify-between px-4 sm:h-24 sm:block sm:px-0">
          <a href="/">
            <div className="text-lg sm:text-xl font-ivymode font-light sm:absolute sm:top-8 sm:left-8 transition-colors duration-300 uppercase tracking-wide"
              style={{ color: getTextColor() }}>
              Syntropy.Institute
            </div>
          </a>
        <nav className="hidden sm:flex sm:absolute sm:top-8 sm:right-4 items-center space-x-8 text-lg font-medium transition-colors duration-300 relative"
          style={{ color: getTextColor() }}>
          {[
            { id: 'yunasai-intro', label: 'Intro' },
            { id: 'yunasai-who', label: 'Who We Are' },
            { id: 'yunasai-mission', label: 'Our Mission' },
            { id: 'yunasai-what', label: 'What We Do' },
            { id: 'yunasai-legal', label: 'Legal Standing' },
            { id: 'yunasai-minister', label: 'Minister' },
          ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleAnchor(e, item.id)}
                className="cursor-pointer transition-colors relative hover:opacity-70"
              >
                {item.label}
              </a>
            ))}
            
            {/* Desktop menu button */}
            <motion.button
              className="z-50 flex h-8 w-8 flex-col items-center justify-center ml-4"
              onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
            >
              <motion.span className="mb-1 h-0.5 w-6 transition-colors duration-300" 
                style={{ backgroundColor: getTextColor() }}
                animate={{ rotate: desktopMenuOpen ? 45 : 0, y: desktopMenuOpen ? 6 : 0 }} />
              <motion.span className="mb-1 h-0.5 w-6 transition-colors duration-300"
                style={{ backgroundColor: getTextColor() }}
                animate={{ opacity: desktopMenuOpen ? 0 : 1 }} />
              <motion.span className="h-0.5 w-6 transition-colors duration-300"
                style={{ backgroundColor: getTextColor() }}
                animate={{ rotate: desktopMenuOpen ? -45 : 0, y: desktopMenuOpen ? -6 : 0 }} />
            </motion.button>
            
            <motion.div
              className="absolute bottom-0 h-0.5 transition-colors duration-300"
              initial={false}
              animate={{
                x: navLinePosition.x,
                width: navLinePosition.width
              }}
              transition={{ type: 'tween', duration: 0.15, ease: 'easeOut' }}
              style={{ bottom: '-8px', willChange: 'transform, width', backgroundColor: getTextColor() }}
            />
          </nav>

          <motion.button
            className="z-50 flex h-8 w-8 flex-col items-center justify-center sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <motion.span className="mb-1 h-0.5 w-6 transition-colors duration-300"
              style={{ backgroundColor: getTextColor() }}
              animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 6 : 0 }} />
            <motion.span className="mb-1 h-0.5 w-6 transition-colors duration-300"
              style={{ backgroundColor: getTextColor() }}
              animate={{ opacity: mobileMenuOpen ? 0 : 1 }} />
            <motion.span className="h-0.5 w-6 transition-colors duration-300"
              style={{ backgroundColor: getTextColor() }}
              animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -6 : 0 }} />
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
              { label: 'Book a Session', href: '#', onClick: () => setYunasaiLightbox({
                title: 'Book a Session',
                content: 'Contact us to schedule your personalized Syntropy session and begin your journey to optimal health and wellness.'
              }) },
              { label: 'Member Disclosure & Agreement', href: '#', onClick: () => setYunasaiLightbox({
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
              { label: 'Book a Session', href: '#', onClick: () => setYunasaiLightbox({
                title: 'Book a Session',
                content: 'Contact us to schedule your personalized Syntropy session and begin your journey to optimal health and wellness.'
              }) },
              { label: 'Member Disclosure & Agreement', href: '#', onClick: () => setYunasaiLightbox({
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
        {/* Section 1: Intro with Image */}
        <section id="yunasai-intro" className="snap-section flex flex-col snap-start min-h-screen relative">
          <div id="yunasai-intro-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <img 
                src="/yunasai_ministry.png" 
                alt="Yunasai Ministry" 
                className="mx-auto mb-8 max-w-[280px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]"
              />
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-playfair font-light text-center"
                style={{ color: getTextColor() }}>
                "To be in the world, but not of the world, and to act in accordance with Nature and Nature's God, our Creator, and serve as stewards with dominion over all earthly things, as divinely entrusted."
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Who We Are */}
        <section id="yunasai-who" className="snap-section flex flex-col snap-start min-h-screen relative">
          <div id="yunasai-who-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-kudryashev font-light drop-shadow-xl tracking-wide uppercase mx-auto text-center mb-6"
                style={{ color: getTextColor() }}>
                Who We Are
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl leading-relaxed font-playfair font-light text-center"
                style={{ color: getTextColor() }}>
                Yunasai Ministry is a private, unincorporated faith-based ministerial association founded on the principles of spiritual sovereignty, divine stewardship, and human upliftment. Established under the protection of Ecclesiastical Law and the Universal Declaration of Human Rights, we operate in the private domain — beyond the jurisdiction of public law — offering a sacred platform for ministry, healing, education, and service.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Our Mission */}
        <section id="yunasai-mission" className="snap-section flex flex-col snap-start min-h-screen relative">
          <div id="yunasai-mission-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-kudryashev font-light drop-shadow-xl tracking-wide uppercase mx-auto text-center mb-6"
                style={{ color: getTextColor() }}>
                Our Mission
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl leading-relaxed font-playfair font-light text-center"
                style={{ color: getTextColor() }}>
                To be in the world, but not of the world, and to act in accordance with Nature and Nature's God, our Creator, and serve as stewards with dominion over all earthly things, as divinely entrusted.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: What We Do */}
        <section id="yunasai-what" className="snap-section flex flex-col snap-start min-h-screen relative">
          <div id="yunasai-what-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-kudryashev font-light drop-shadow-xl tracking-wide uppercase mx-auto text-center mb-6"
                style={{ color: getTextColor() }}>
                What We Do
              </h2>
              <div className="text-lg sm:text-xl md:text-2xl leading-relaxed font-playfair font-light text-center max-w-2xl mx-auto space-y-3"
                style={{ color: getTextColor() }}>
                <p>Provide a protected space for ministry, education, and private healing services</p>
                <p>Operate within Ecclesiastical and Common Law</p>
                <p>Offer membership to those aligned with our principles</p>
                <p>Support and empower members through private counsel and resources</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Legal Standing */}
        <section id="yunasai-legal" className="snap-section flex flex-col snap-start min-h-screen relative">
          <div id="yunasai-legal-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-kudryashev font-light drop-shadow-xl tracking-wide uppercase mx-auto text-center mb-6"
                style={{ color: getTextColor() }}>
                Legal Standing
              </h2>
              <div className="text-lg sm:text-xl md:text-2xl leading-relaxed font-playfair font-light space-y-4"
                style={{ color: getTextColor() }}>
                <p className="text-center">Yunasai Ministry operates as a Private Ministerial Association and claims all protections afforded by:</p>
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <p>The U.S. Constitution and Constitutions of the several States</p>
                  <p>The Universal Declaration of Human Rights</p>
                  <p>The Canadian Charter of Rights</p>
                  <p>Ecclesiastical Law and Common Law</p>
                </div>
                <p className="text-center mt-6">We are not subject to public statutory regulation, and all our affairs are conducted privately, under contract between members.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Step into the Ministry */}
        <section id="yunasai-minister" className="snap-section flex flex-col snap-start min-h-screen relative">
          <div id="yunasai-minister-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-kudryashev font-light drop-shadow-xl tracking-wide uppercase mx-auto text-center mb-6"
                style={{ color: getTextColor() }}>
                Step into the Ministry
              </h2>
              <div className="text-lg sm:text-xl md:text-2xl leading-relaxed font-playfair font-light space-y-4 mb-8"
                style={{ color: getTextColor() }}>
                <p>If you feel called to walk with us and align with our mission, simply engage with our offerings.</p>
                <p>All services are provided within our spiritually grounded Private Ecclesiastical Association.</p>
                <p>Participation signifies your agreement as a private member.</p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <motion.button
                  onClick={() => setYunasaiLightbox({
                    title: 'Member Disclosure Agreement',
                    content: 'By engaging with our services, you automatically join our Private Membership Association. Please review our terms and membership agreement.'
                  })}
                  className="px-6 py-3 text-base sm:text-lg font-medium border-2 rounded-full transition-all duration-300 hover:bg-black/10 bg-transparent backdrop-blur-sm"
                  style={{ 
                    borderColor: getTextColor(),
                    color: getTextColor()
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Member Disclosure Agreement
                </motion.button>
                <motion.button
                  onClick={() => setYunasaiLightbox({
                    title: 'Important Notice',
                    content: 'Important: Yunasai Ministry offers its services and communications solely within the private domain to registered members. By participating, you acknowledge your membership and agree to our Terms of Membership.\n\nNotice: Yunasai Ministry, its trustees, ministers, and members do not operate as agents of, or under the jurisdiction of, any local, state, or federal agency. No information shared is intended for public review or use by regulatory authorities.\n\n"Yunasai Ministry is established under ecclesiastical law as a Private Ministerial Association. Our Articles of Association define our mission, governance, and jurisdiction. These foundational documents are available to members upon request or by joining the association."'
                  })}
                  className="px-6 py-3 text-base sm:text-lg font-medium border-2 rounded-full transition-all duration-300 hover:bg-black/10 bg-transparent backdrop-blur-sm"
                  style={{ 
                    borderColor: getTextColor(),
                    color: getTextColor()
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Important
                </motion.button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Back Button */}
      {yunasaiSection !== 'yunasai-intro' && (
      <motion.button
        onClick={(e) => {
          const sections = ['yunasai-intro', 'yunasai-who', 'yunasai-mission', 'yunasai-what', 'yunasai-legal', 'yunasai-minister'];
          const currentIndex = sections.indexOf(yunasaiSection);
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
        } font-medium`}
        style={{
          backgroundColor: getTextColor(),
          borderColor: getTextColor(),
          color: '#F5F1E8'
        }}
        whileHover={{ opacity: 0.8 }}
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
      {yunasaiSection !== 'yunasai-minister' && (
      <motion.button
        onClick={(e) => {
          const sections = ['yunasai-intro', 'yunasai-who', 'yunasai-mission', 'yunasai-what', 'yunasai-legal', 'yunasai-minister'];
          const currentIndex = sections.indexOf(yunasaiSection);
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
        } bg-transparent font-medium`}
        style={{
          borderColor: getTextColor(),
          color: getTextColor()
        }}
        whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
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
      {yunasaiSection === 'yunasai-minister' && (
      <motion.button
        onClick={() => {
          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`fixed bottom-8 right-8 z-50 flex items-center justify-center shadow-lg transition-all duration-300 ${
          isPhone 
            ? 'w-14 h-14 rounded-full border-2' 
            : 'px-6 py-3 rounded-full border-2 min-w-[120px]'
        } bg-transparent font-medium`}
        style={{
          borderColor: getTextColor(),
          color: getTextColor()
        }}
        whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {yunasaiLightbox && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-xl p-4"
            style={{ backgroundColor: 'rgba(44, 36, 22, 0.7)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setYunasaiLightbox(null)}
          >
            <motion.div
              className={`relative ${yunasaiLightbox.title === 'Book a Session' ? 'max-w-5xl w-full h-[85vh]' : 'max-w-4xl max-h-[85vh]'} mx-4 backdrop-blur-2xl border rounded-3xl shadow-2xl overflow-hidden z-10`}
              style={{ 
                backgroundColor: 'rgba(245, 241, 232, 0.95)',
                borderColor: 'rgba(44, 36, 22, 0.2)'
              }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setYunasaiLightbox(null)}
                className="absolute -top-14 right-2 transition-all duration-300 hover:scale-110 z-20"
                style={{ color: getTextColor() }}
                aria-label="Close modal"
              >
                <div className="w-10 h-10 rounded-full backdrop-blur-sm border flex items-center justify-center hover:bg-black/10 transition-all duration-300"
                  style={{ 
                    backgroundColor: 'rgba(245, 241, 232, 0.3)',
                    borderColor: 'rgba(44, 36, 22, 0.3)'
                  }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
              </button>

              {yunasaiLightbox.title === 'Book a Session' ? (
                <motion.div
                  className="h-full flex flex-col"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <div className="p-6 sm:p-8 text-center border-b flex-shrink-0"
                    style={{ borderColor: 'rgba(44, 36, 22, 0.2)' }}>
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-ivymode font-light tracking-wider"
                      style={{ color: getTextColor() }}>
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
                <motion.div className="text-center p-10 sm:p-14 overflow-y-auto max-h-full" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                  <motion.h3 
                    className="text-3xl sm:text-4xl lg:text-5xl font-ivymode font-light mb-6 tracking-wider"
                    style={{ color: getTextColor() }}
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    {yunasaiLightbox.title}
                  </motion.h3>
                  <motion.p 
                    className="text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto font-playfair whitespace-pre-line"
                    style={{ lineHeight: '1.8', color: getTextColor() }}
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    {yunasaiLightbox.content}
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default YunasaiApp

