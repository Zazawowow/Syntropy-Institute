import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Letter-by-letter typing animation component
const TypingText = ({ text, delay = 0, duration = 5 }: { text: string; delay?: number; duration?: number }) => {
  const letters = text.split('');
  const letterDelay = duration / letters.length;

  return (
    <>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: delay + (index * letterDelay),
            duration: 0.1,
            ease: 'easeInOut'
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </>
  );
};

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('syntropy-1');
  const [navLinePosition, setNavLinePosition] = useState({ x: 0, width: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [lightboxText, setLightboxText] = useState<{title: string, content: string} | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [introUnlocked, setIntroUnlocked] = useState(false);
  const [headerShownOnce, setHeaderShownOnce] = useState(false);


  const navItems = useMemo(() => ['What?', 'Our Goal', 'Frequency', 'Experience', 'Together', 'Why?'], []);







  useEffect(() => {
    // Unlock header/nav after the intro finishes on section 1, or immediately if the user scrolls away
    const introTimer = setTimeout(() => setIntroUnlocked(true), 24000);
    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    if (currentSection !== 'syntropy-1') {
      setIntroUnlocked(true);
    }
  }, [currentSection]);

  // If the user scrolls during the intro, snap the intro elements to their final state
  useEffect(() => {
    if (currentSection !== 'syntropy-1') {
      // Force-complete any time-based reveals by enabling the unlocked state
      setIntroUnlocked(true);
    }
  }, [currentSection]);

  const navStaggerSeconds = 0.15;
  const shouldShowHeaderNow = currentSection !== 'syntropy-1' || introUnlocked;
  useEffect(() => {
    if (shouldShowHeaderNow && !headerShownOnce) setHeaderShownOnce(true);
  }, [shouldShowHeaderNow, headerShownOnce]);
  // If unlocked due to time (end of intro), keep the original delays; if unlocked due to scroll, show instantly
  const headerDelayBase = headerShownOnce ? 0 : (introUnlocked ? 24.0 : 0.0);
  const navDelayBase = headerShownOnce ? 0 : (introUnlocked ? 24.1 : 0.0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLElement, MouseEvent>, targetId: string) => {
    e.preventDefault();
    
    const scrollToTarget = () => {
      const element = document.getElementById(targetId);
      if (element) {
        setIsNavigating(true);
        
        setCurrentSection(targetId);
        
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
        
        setTimeout(() => {
          setIsNavigating(false);
        }, 1000);
      }
    };
    
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      setTimeout(scrollToTarget, 300);
    } else {
      scrollToTarget();
    }
  };



  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isNavigating) return;
      
      const sections = ['syntropy-1', 'syntropy-2', 'syntropy-3', 'syntropy-4', 'syntropy-5', 'syntropy-6'];
      let newCurrentSection = currentSection;
      let maxVisibleArea = 0;
      const threshold = 100; // Minimum visible pixels to consider
      
      // Debug info
      const debugInfo: { id: string; visible: number; rect: DOMRect }[] = [];
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          // Calculate visible area of this section
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(viewportHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          
          debugInfo.push({ id: sectionId, visible: visibleHeight, rect });
          
          // Only consider sections with meaningful visibility
          if (visibleHeight > threshold && visibleHeight > maxVisibleArea) {
            maxVisibleArea = visibleHeight;
            newCurrentSection = sectionId;
          }
        }
      }
      
      // Fallback: if no section has enough visibility, use position-based detection
      if (maxVisibleArea < threshold) {
        const scrollY = window.scrollY;
        const viewportCenter = scrollY + window.innerHeight / 2;
        
        for (const sectionId of sections) {
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const elementBottom = elementTop + rect.height;
            
            if (viewportCenter >= elementTop && viewportCenter <= elementBottom) {
              newCurrentSection = sectionId;
              break;
            }
          }
        }
      }
      
      // Log debug info occasionally
      if (Math.random() < 0.1) {
        console.log('Scroll debug:', {
          current: currentSection,
          new: newCurrentSection,
          maxVisible: maxVisibleArea,
          scrollY: window.scrollY,
          sections: debugInfo.map(s => ({ id: s.id, visible: Math.round(s.visible), top: Math.round(s.rect.top) }))
        });
      }
      
      // Update current section if it changed
      if (newCurrentSection !== currentSection) {
        setCurrentSection(newCurrentSection);
        console.log('Section changed:', currentSection, '->', newCurrentSection);
        
        const metaThemeColor = document.getElementById('theme-color-meta') as HTMLMetaElement;
        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', '#000000');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen, navItems, isNavigating]);

  useEffect(() => {
    const updateNavLinePosition = () => {
      const activeNavItem = document.getElementById(`nav-${currentSection}`);
      const navContainer = activeNavItem?.parentElement;
      
      if (activeNavItem && navContainer) {
        const navRect = navContainer.getBoundingClientRect();
        const itemRect = activeNavItem.getBoundingClientRect();
        
        setNavLinePosition({
          x: itemRect.left - navRect.left,
          width: itemRect.width
        });
      }
    };

    const timer = setTimeout(updateNavLinePosition, 50);
    window.addEventListener('resize', updateNavLinePosition);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateNavLinePosition);
    };
  }, [currentSection]);

  useEffect(() => {
    const urls = [
      '/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg', '/5.jpg', '/6.jpg',
      '/mobile-1.jpg', '/mobile-2.jpg', '/mobile-3.jpg', '/mobile-4.jpg', '/mobile-5.jpg', '/mobile-6.jpg'
    ];
    urls.forEach((src) => {
      const img = new Image();
      img.src = src;
      // Try decode for smoother ready-state without blocking
      if ((img as any).decode) {
        (img as any).decode().catch(() => void 0);
      }
    });
  }, []);

  const getBackgroundImage = (section: string) => {
    const imageMap = {
      'syntropy-1': isMobile ? 'url(/mobile-1.jpg)' : 'url(/1.jpg)',  // What?
      'syntropy-2': isMobile ? 'url(/mobile-2.jpg)' : 'url(/2.jpg)',  // Our Goal
      'syntropy-3': isMobile ? 'url(/mobile-3.jpg)' : 'url(/3.jpg)',  // Frequency
      'syntropy-4': isMobile ? 'url(/mobile-4.jpg)' : 'url(/4.jpg)',  // Experience
      'syntropy-5': isMobile ? 'url(/mobile-5.jpg)' : 'url(/5.jpg)',  // Together
      'syntropy-6': isMobile ? 'url(/mobile-6.jpg)' : 'url(/6.jpg)',  // Why?
    };
    return imageMap[section as keyof typeof imageMap] || (isMobile ? 'url(/mobile-1.jpg)' : 'url(/1.jpg)');
  };

  return (
        <div 
      className="font-futuristic relative bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: getBackgroundImage(currentSection),
        backgroundSize: isMobile ? 'cover' : '100% auto',
        backgroundPosition: 'center center',
        backgroundAttachment: isMobile ? 'scroll' : 'fixed'
      }}
    >
      <div className="fixed inset-0 z-10 pointer-events-none bg-black/40"></div>
      
      {/* Additional overlay for last section */}
      {currentSection === 'syntropy-6' && (
        <div className="fixed inset-0 z-15 pointer-events-none bg-black/50"></div>
      )}
      
      <header className="sticky top-0 z-50 transition-all duration-1000 ease-in-out bg-transparent relative" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="relative flex h-16 items-center justify-between px-4 sm:h-24 sm:block sm:px-0">
                    <a href="#syntropy-1" onClick={(e) => handleLinkClick(e, 'syntropy-1')}>
            <motion.div
              className="text-lg sm:text-xl font-ivymode font-light sm:absolute sm:top-8 sm:left-8 transition-colors duration-300 text-white uppercase tracking-wide"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: shouldShowHeaderNow ? 1 : 0, y: shouldShowHeaderNow ? 0 : -10 }}
              transition={{ delay: headerDelayBase, duration: 0.6, ease: 'easeOut' }}
            >
              Syntropy.Institute
            </motion.div>
          </a>

          <nav className={`hidden sm:flex sm:absolute sm:top-8 sm:right-8 items-center space-x-8 text-lg font-medium transition-colors duration-300 text-white relative`}>
              {navItems.map((item, index) => {
                const targetId = `syntropy-${index + 1}`;
                return (
                  <motion.a
                    key={item}
                    href={`#${targetId}`}
                    onClick={(e) => handleLinkClick(e, targetId)}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: shouldShowHeaderNow ? 1 : 0, y: shouldShowHeaderNow ? 0 : -20 }}
                    transition={{ duration: 0.6, delay: navDelayBase + index * navStaggerSeconds, ease: 'easeOut' }}
                    className="cursor-pointer transition-colors relative hover:text-gray-300"
                    id={`nav-${targetId}`}
                  >
                    {item}
                  </motion.a>
                );
              })}
              
              <motion.div
                className="absolute bottom-0 h-0.5 bg-white transition-colors duration-300"
                initial={{ opacity: 0, width: 0 }}
                animate={{
                  opacity: shouldShowHeaderNow ? 1 : 0,
                  x: navLinePosition.x,
                  width: navLinePosition.width
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  opacity: { duration: 0.3 }
                }}
                style={{ bottom: '-8px' }}
              />
            </nav>

            <motion.button
              className="z-50 flex h-8 w-8 flex-col items-center justify-center sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
            <motion.span className="mb-1 h-0.5 w-6 transition-colors duration-300 bg-white" animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 6 : 0 }} />
            <motion.span className="mb-1 h-0.5 w-6 transition-colors duration-300 bg-white" animate={{ opacity: mobileMenuOpen ? 0 : 1 }} />
            <motion.span className="h-0.5 w-6 transition-colors duration-300 bg-white" animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -6 : 0 }} />
            </motion.button>
        </div>
              </header>
        
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="sm:hidden fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/90 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {navItems.map((item, itemIndex) => {
              const targetId = `syntropy-${itemIndex + 1}`;
              return (
                <motion.a
                  key={item}
                  href={`#${targetId}`}
                  onClick={(e) => handleLinkClick(e, targetId)}
                  className="text-2xl font-medium mb-8 cursor-pointer transition-colors text-white hover:text-gray-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: itemIndex * 0.1 }}
                >
                  {item}
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="-mt-16 sm:-mt-24">
        {[1, 2, 3, 4, 5, 6].map((sectionNumber) => {
          const targetId = `syntropy-${sectionNumber}`;
          
          return (
            <section key={targetId} id={targetId} className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">

              <div className="flex-1 flex items-center justify-center min-h-0 relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
                                <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
                  {sectionNumber === 1 ? (
                    <motion.div className="relative z-20 min-h-[16rem] flex items-center justify-center">
                      {/* Vertically centered container that shows title then paragraph in same place */}
                      <div className="relative min-h-[10rem] w-full flex items-center justify-center">
                        {/* Title with Medicine using clipPath and Reimagined using fade */}
                        <div className="absolute text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-kudryashev text-white drop-shadow-xl tracking-wide uppercase flex flex-col items-center gap-1 sm:block sm:whitespace-nowrap">
                          {/* Medicine with original clipPath animation, holds 1 second after full text */}
                          <motion.span
                            className="inline-block"
                            initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
                            animate={{
                              opacity: [0, 1, 1, 0],
                              clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)', 'inset(0 0% 0 0)', 'inset(0 0 0 100%)']
                            }}
                            transition={{ duration: 4.2, delay: 0.5, ease: 'easeInOut', times: [0, 0.17, 0.81, 1] }}
                            style={{ willChange: 'clip-path, opacity' }}
                          >
                            Medicine
                          </motion.span>
                          {/* Space between words (desktop only) */}
                          <span className="hidden sm:inline"> </span>
                          {/* Reimagined with fade animation, holds 1 second after fully visible */}
                          <motion.span
                            className="inline-block"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 3.5, delay: 1.2, ease: 'easeInOut', times: [0, 0.57, 0.86, 1] }}
                          >
                            Reimagined
                          </motion.span>
                        </div>

                        {/* Paragraph sequence inline: start only after title fully exits, then fade out before SYNTROPY */}
                        <motion.p
                          className="absolute text-[24px] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-relaxed text-white/95 drop-shadow-lg font-playfair font-normal text-center px-8 sm:px-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 1, 0] }}
                          transition={{ delay: 4.7, duration: 18.8, ease: 'easeInOut', times: [0, 0.02, 0.93, 1] }}
                          style={{ maxWidth: '95vw', lineHeight: '1.5', wordWrap: 'break-word' }}
                        >
                          {/* first text uses letter-by-letter typing effect, starts after title fades out */}
                          <motion.span
                            initial={{ opacity: 1 }}
                            animate={{ opacity: [1, 1, 0.3, 0.3, 0.3, 0.3, 0.3] }}
                            transition={{ duration: 15.0, delay: 4.7, times: [0, 0.45, 0.46, 0.6, 0.75, 0.87, 1] }}
                          >
                            <TypingText 
                              text="We've been taught that the universe and the body are destined for entropy:" 
                              delay={4.7} 
                              duration={4.0} 
                            />
                          </motion.span>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 1, 0.3, 0.3, 0.3, 0.3] }}
                            transition={{ duration: 10.0, delay: 9.2, times: [0, 0.2, 0.4, 0.45, 0.6, 0.8, 1] }}
                          >
                            {' '}
                            decay, disorder, decline.
                            {' '}
                          </motion.span>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 1, 0.3, 0.3, 0.3] }}
                            transition={{ duration: 8.0, delay: 11.2, times: [0, 0.25, 0.5, 0.56, 0.75, 1] }}
                          >
                            Yet life itself is
                          </motion.span>
                          <motion.span
                            className="italic"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 1, 0.3, 0.3] }}
                            transition={{ duration: 6.0, delay: 13.2, times: [0, 0.33, 0.67, 0.75, 1] }}
                          >
                            {' '}
                            inherently syntropic
                          </motion.span>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 1, 0.3] }}
                            transition={{ duration: 2.5, delay: 15.2, times: [0, 0.6, 0.8, 1], ease: 'easeInOut' }}
                          >
                            —conscious,
                          </motion.span>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0.3] }}
                            transition={{ duration: 3.0, delay: 15.7, times: [0, 0.6, 1], ease: 'easeInOut' }}
                          >
                            {' '}intelligent,{' '}
                          </motion.span>
                          <motion.span
                            className="font-semibold"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 2.0, delay: 17.95, ease: 'easeInOut' }}
                          >
                            self-healing.
                          </motion.span>
                        </motion.p>

                        {/* SYNTROPY headline appears after paragraph fades out */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-kudryashev text-white drop-shadow-xl tracking-wide uppercase whitespace-nowrap">
                            <motion.span
                              className="inline-block"
                              initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
                              animate={{
                                opacity: [0, 1, 1],
                                clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)', 'inset(0 0% 0 0)']
                              }}
                              transition={{ duration: 1.8, delay: 23.0, ease: 'easeInOut', times: [0, 0.3, 1] }}
                              style={{ willChange: 'clip-path, opacity' }}
                            >
                              SYNTROPY
                            </motion.span>
                          </div>
                          <motion.div
                            className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl tracking-widest text-white/90 uppercase font-ivymode"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 24.2, duration: 0.6, ease: 'easeOut' }}
                          >
                            MEDICINE REIMAGINED
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.h2
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-kudryashev font-light text-white drop-shadow-xl relative z-20 tracking-wide uppercase mx-auto text-center"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      {sectionNumber === 2 && 'Our Goal'}
                      {sectionNumber === 3 && 'Frequency'}
                      {sectionNumber === 4 && 'Experience'}
                      {sectionNumber === 5 && (
                        <div className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                          <span className="whitespace-nowrap">Together We Are</span>
                          <br />
                          <span className="font-black whitespace-nowrap">Syntropy</span>
                        </div>
                      )}
                      {sectionNumber === 6 && 'Why?'}
                    </motion.h2>
                  )}
                  
                  {sectionNumber !== 1 && (
                  <motion.div 
                    className="relative z-20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.3 }}
                    style={{ willChange: 'opacity' }}
                  >
                     <p className={`mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 ${
                       sectionNumber === 4 || sectionNumber === 5 || sectionNumber === 6
                         ? 'text-[20px] sm:text-xl lg:text-2xl' 
                         : 'text-[20px] sm:text-2xl lg:text-4xl'
                     }`}>
                       {sectionNumber === 2 ? (
                         <>
                           Is to guide you back to your natural energetic state
                           <br />
                           <motion.span 
                             className="font-semibold"
                             initial={{ opacity: 0 }}
                             whileInView={{ opacity: 1 }}
                             transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                             viewport={{ once: true, amount: 0.3 }}
                           >
                             Syntropy.
                           </motion.span>
                         </>
                       ) : sectionNumber === 3 ? (
                         'Syntropy is the merging of Ancient Wisdom with tomorrow\'s Frequency Technology'
                       ) : sectionNumber === 4 ? (
                         'AuraKinetics + Syntropy Frequency'
                       ) : sectionNumber === 5 ? (
                         'Our services are exclusively available through the Yunasai Ministry. By engaging with us, you automatically join our Private Membership Association. Learn more about membership and terms.'
                       ) : sectionNumber === 6 ? (
                         'Behind the firewall of ecclesiastical law, Syntropy delivers the kind of data the system buries—raw, testable, sacred intel that doesn\'t ask permission to heal. No pharma sponsors. No academic gaslighting. Just measurable truth for your biological revolution.'
                       ) : (
                         'Individualized protocols integrating kinetic assessment, frequency analysis, nutrition, supplementation, and movement practices'
                       )}
                     </p>
                    
                    {sectionNumber === 3 && (
                      <motion.div 
                        className="flex flex-wrap justify-center gap-3 mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.3 }}
                      >
                        <motion.button
                          onClick={() => setLightboxText({
                            title: 'Frequency Analysis-Therapy', 
                            content: 'Syntropy Frequency Analysis-Therapy represents the leading edge of frequency-based healing in the United States, specializing in individualized frequency protocols and digital homeopathy. Using advanced Swiss-German technology, we identify and address the root causes of cellular energy loss, leveraging over 200 million trackable data points.'
                          })}
                          className="px-3 py-2 text-xs sm:text-sm font-medium border-2 border-white/80 rounded-full transition-all duration-300 hover:bg-white/20 hover:border-white text-white/90 hover:text-white bg-transparent backdrop-blur-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Frequency Analysis-Therapy
                        </motion.button>
                        
                        <motion.button
                          onClick={() => setLightboxText({
                            title: 'Manual Kinetics', 
                            content: 'Syntropy Manual Kinetics is the science of biological optimization, integrating advanced muscle testing, facial analysis, iridology, and manual field diagnostics to assess the body\'s structural and functional condition.'
                          })}
                          className="px-3 py-2 text-xs sm:text-sm font-medium border-2 border-white/80 rounded-full transition-all duration-300 hover:bg-white/20 hover:border-white text-white/90 hover:text-white bg-transparent backdrop-blur-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Manual Kinetics
                        </motion.button>
                        
                        <motion.button
                          onClick={() => setLightboxText({
                            title: 'Syntropy Concierge', 
                            content: 'The individualized protocol developed through Kinetic assessment and frequency analysis will be seamlessly integrated into your daily lifestyle—including nutrition, supplementation, herbal support, and movement practices tailored to your unique needs and goals.'
                          })}
                          className="px-3 py-2 text-xs sm:text-sm font-medium border-2 border-white/80 rounded-full transition-all duration-300 hover:bg-white/20 hover:border-white text-white/90 hover:text-white bg-transparent backdrop-blur-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Syntropy Concierge
                        </motion.button>
                      </motion.div>
                    )}

                    {sectionNumber === 6 && (
                      <motion.div 
                        className="flex flex-wrap justify-center gap-3 mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.3 }}
                      >
                        <motion.button
                          onClick={() => setLightboxText({
                            title: 'Book a Session', 
                            content: 'Contact us to schedule your personalized Syntropy session and begin your journey to optimal health and wellness.'
                          })}
                          className="px-6 py-3 text-base sm:text-lg font-medium border-2 rounded-full transition-all duration-300 hover:bg-[#B9A590]/20 text-[#B9A590] hover:text-[#B9A590]/80 bg-transparent backdrop-blur-sm"
                          style={{ borderColor: '#B9A590' }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Book a Session
                        </motion.button>
                      </motion.div>
                    )}

                  </motion.div>
                )}
                                </div>
                                      </div>
            </section>
          );
        })}
      </main>

      {/* Floating Back Button */}
      {currentSection !== 'syntropy-1' && (
      <motion.button
        onClick={(e) => {
          const sections = ['syntropy-1', 'syntropy-2', 'syntropy-3', 'syntropy-4', 'syntropy-5', 'syntropy-6'];
          const currentIndex = sections.indexOf(currentSection);
          const prevIndex = currentIndex - 1;
          
          if (prevIndex >= 0) {
            const prevSection = sections[prevIndex];
            handleLinkClick(e as React.MouseEvent<HTMLButtonElement, MouseEvent>, prevSection);
          }
        }}
        className={`fixed bottom-8 z-50 flex items-center justify-center shadow-lg transition-all duration-300 ${
          isMobile 
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
      {currentSection !== 'syntropy-6' && (
      <motion.button
        onClick={(e) => {
          const sections = ['syntropy-1', 'syntropy-2', 'syntropy-3', 'syntropy-4', 'syntropy-5', 'syntropy-6'];
          const currentIndex = sections.indexOf(currentSection);
          const nextIndex = currentIndex + 1;
          
          if (nextIndex < sections.length) {
            const nextSection = sections[nextIndex];
            handleLinkClick(e as React.MouseEvent<HTMLElement, MouseEvent>, nextSection);
          }
        }}
        className={`fixed bottom-8 right-8 z-50 flex items-center justify-center shadow-lg transition-all duration-300 ${
          isMobile 
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
      {currentSection === 'syntropy-6' && (
      <motion.button
        onClick={() => {
          // Scroll to top or show end message
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`fixed bottom-8 right-8 z-50 flex items-center justify-center shadow-lg transition-all duration-300 ${
          isMobile 
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
         {lightboxText && (
           <motion.div
             className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-xl"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={() => setLightboxText(null)}
             style={{ backgroundImage: 'url(/syntropy.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
           >
             <div className="absolute inset-0 bg-black/60"></div>
             
             <motion.div
               className="relative max-w-4xl max-h-[85vh] mx-4 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10"
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               transition={{ type: "spring", damping: 30, stiffness: 400 }}
               onClick={(e) => e.stopPropagation()}
             >
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-3xl"></div>
               
               <button
                 onClick={() => setLightboxText(null)}
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
               
               <motion.div
                 className="p-10 sm:p-14 text-center"
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2, duration: 0.6 }}
               >
                 <motion.h3
                   className="text-4xl sm:text-5xl lg:text-6xl font-ivymode font-light text-white mb-3 tracking-wider drop-shadow-2xl"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3, duration: 0.8 }}
                 >
                   {lightboxText.title}
                 </motion.h3>
                 
                 <motion.div
                   className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-8"
                   initial={{ scaleX: 0 }}
                   animate={{ scaleX: 1 }}
                   transition={{ delay: 0.5, duration: 0.8 }}
                 ></motion.div>
                 
                 <motion.p
                   className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-white/95 max-w-3xl mx-auto drop-shadow-lg font-rajdhani"
                   style={{ lineHeight: '1.8' }}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.6, duration: 0.8 }}
                 >
                   {lightboxText.content}
                 </motion.p>
               </motion.div>
               
               <motion.div 
                 className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
                 initial={{ scaleX: 0 }}
                 animate={{ scaleX: 1 }}
                 transition={{ delay: 0.8, duration: 1 }}
               ></motion.div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}

export default App;