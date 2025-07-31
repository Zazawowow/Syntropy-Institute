import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ParticleLogo from './components/ParticleLogo';

import './App.css';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('siop');
  const [navLinePosition, setNavLinePosition] = useState({ x: 0, width: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isExporting, setIsExporting] = useState(false);
  const [showUnity, setShowUnity] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{src: string, name: string} | null>(null);
  const [lightboxText, setLightboxText] = useState<{title: string, content: string} | null>(null);
  
  // Helper functions for colors
  const getLightGrayBg = () => 'bg-light-gray';
  const getBlackText = () => 'text-black';
  const getGrayText = () => 'text-gray-700';

  const navItems = ['Money', 'Identity', 'Networks', 'Syntropy', 'Vehicles', 'Work', 'Community'];

  // PDF Export Function
  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      console.log('Starting PDF export...');
      
      // Create PDF with 1920x1080 pixel dimensions (landscape)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1920, 1080]
      });

      const sections = ['siop', 'money', 'identity', 'networks', 'syntropy', 'vehicles', 'work', 'community'];
      
      // Store original scroll position
      const originalScrollY = window.scrollY;
      
      for (let i = 0; i < sections.length; i++) {
        const sectionId = sections[i];
        console.log(`Processing section ${i + 1}/${sections.length}: ${sectionId}`);
        
        const element = document.getElementById(sectionId);
        
        if (!element) {
          console.error(`Element with ID '${sectionId}' not found`);
          continue;
        }

        // Scroll to the section
        element.scrollIntoView({ behavior: 'auto', block: 'start' });
        
        // Wait for scroll and rendering
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          console.log(`Capturing ${sectionId}...`);
          
          // Wait for fonts to fully load
          await document.fonts.ready;
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Temporarily modify the section for better capture
          const originalStyles = {
            width: element.style.width,
            height: element.style.height,
            position: element.style.position,
            top: element.style.top,
            left: element.style.left,
            transform: element.style.transform,
            overflow: element.style.overflow
          };
          
          // Set section to exact dimensions
          element.style.width = '1920px';
          element.style.height = '1080px';
          element.style.position = 'fixed';
          element.style.top = '0';
          element.style.left = '0';
          element.style.transform = 'none';
          element.style.overflow = 'hidden';
          
          // Wait for styles to apply
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Capture the section directly
          const canvas = await html2canvas(element, {
            width: 1920,
            height: 1080,
            scale: 1,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            logging: true,
            foreignObjectRendering: false,
            ignoreElements: (el) => {
              return el.id === 'export-button' || el.closest('#export-button') !== null;
            }
          });
          
          // Restore original styles
          Object.keys(originalStyles).forEach(key => {
            const styleKey = key as keyof typeof originalStyles;
            element.style[styleKey] = originalStyles[styleKey];
          });
          
          console.log(`Canvas created for ${sectionId}:`, canvas.width, 'x', canvas.height);
          
          // Convert canvas to image
          const imgData = canvas.toDataURL('image/png', 1.0);
          
          if (!imgData || imgData === 'data:,') {
            throw new Error(`Failed to generate image data for section: ${sectionId}`);
          }
          
          console.log(`Image data generated for ${sectionId}, size: ${imgData.length} chars`);
          
          // Add page (except for first page)
          if (i > 0) {
            pdf.addPage([1920, 1080], 'landscape');
            console.log(`Added new page ${i + 1}`);
          }
          
          // Add image to PDF
          pdf.addImage(imgData, 'PNG', 0, 0, 1920, 1080);
          console.log(`Added ${sectionId} to PDF (page ${i + 1}/${sections.length})`);
          
        } catch (sectionError) {
          console.error(`Error processing section ${sectionId}:`, sectionError);
          // Add a blank page if section fails
          if (i > 0) {
            pdf.addPage([1920, 1080], 'landscape');
          }
          pdf.setFontSize(20);
          pdf.text(`Error capturing section: ${sectionId}`, 100, 100);
        }
      }
      
      // Restore original scroll position
      window.scrollTo(0, originalScrollY);
      
      console.log('Saving PDF...');
      
      // Save the PDF
      pdf.save('SiOP-Portfolio.pdf');
      console.log('PDF saved successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // More specific error message
      let errorMessage = 'Error generating PDF. ';
      if (error instanceof Error && error.message) {
        errorMessage += `Details: ${error.message}`;
      } else {
        errorMessage += 'Please check the console for more details and try again.';
      }
      
      alert(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    e.preventDefault();
    
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ 
          behavior: 'auto',
          block: 'start'
        });
      }, 300);
    } else {
      document.getElementById(targetId)?.scrollIntoView({ 
        behavior: isMobile ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  };

  // Navigation styling based on current section
  const shouldInvertNav = () => {
    // Syntropy section uses white text on dark background
    return currentSection === 'syntropy';
  };

  // Register service worker for PWA
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

  // Scroll listener to detect current section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['siop', 'money', 'identity', 'networks', 'syntropy', 'vehicles', 'work', 'community'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;

          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setCurrentSection(sectionId);
            
            // Close mobile menu when on siop section
            if (sectionId === 'siop' && mobileMenuOpen) {
              setMobileMenuOpen(false);
            }
            
            // Update theme color for mobile status bar - always light gray
            const metaThemeColor = document.getElementById('theme-color-meta') as HTMLMetaElement;
            if (metaThemeColor) {
              metaThemeColor.setAttribute('content', '#FAFAFA');
            }
            
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen, navItems]);

  // Update navigation line position when current section changes
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

  return (
    <div className={`${
      currentSection === 'syntropy' 
        ? 'bg-cover bg-center bg-no-repeat font-futuristic relative' 
        : getLightGrayBg() + ' font-futuristic'
    } transition-all duration-1000 ease-in-out bg-transition`} style={currentSection === 'syntropy' ? { backgroundImage: 'url(/syntropy.jpg)' } : {}}>
      {/* Dark overlay for Syntropy page with smooth fade */}
      <div className={`fixed inset-0 z-10 pointer-events-none transition-all duration-1000 ease-in-out ${
        currentSection === 'syntropy' ? 'bg-black/40 opacity-100' : 'bg-black/0 opacity-0'
      }`}></div>
      
      {/* --- Sticky Header --- */}
      <header className={`sticky top-0 z-50 transition-all duration-1000 ease-in-out ${
        currentSection === 'syntropy' ? 'bg-transparent' : getLightGrayBg()
      } relative`} style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="relative flex h-16 items-center justify-between px-4 sm:h-24 sm:block sm:px-0">
          {/* Logo - Only show from second section onward */}
          {currentSection !== 'siop' && (
            <a href="#siop" onClick={(e) => handleLinkClick(e, 'siop')}>
              <div
                className={`text-lg font-bold sm:absolute sm:top-8 sm:left-8 sm:text-2xl transition-colors duration-300 ${
                  shouldInvertNav() ? 'text-white' : getBlackText()
                }`}
              >
                L484
              </div>
            </a>
          )}

          {/* Desktop Navigation - Only show from second section onward */}
          {currentSection !== 'siop' && (
            <nav className={`hidden sm:flex sm:absolute sm:top-8 sm:right-8 items-center space-x-8 text-lg font-medium transition-colors duration-300 ${
              shouldInvertNav() ? 'text-white' : getBlackText()
            } relative`}>
              {navItems.map((item, index) => {
                const targetId = item.toLowerCase().replace(/\s+/g, '-');
                return (
                  <motion.a
                    key={item}
                    href={`#${targetId}`}
                    onClick={(e) => handleLinkClick(e, targetId)}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`cursor-pointer transition-colors relative ${
                      shouldInvertNav() ? 'hover:text-gray-300' : 'hover:text-gray-600'
                    }`}
                    id={`nav-${targetId}`}
                  >
                    {item}
                  </motion.a>
                );
              })}
              
              {/* Animated underline */}
              <motion.div
                className={`absolute bottom-0 h-0.5 transition-colors duration-300 ${
                  shouldInvertNav() ? 'bg-white' : 'bg-black'
                }`}
                initial={{ opacity: 0, width: 0 }}
                animate={{
                  opacity: 1,
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
          )}

          {/* Mobile Hamburger Button - Only show from second section onward */}
          {currentSection !== 'siop' && (
            <motion.button
              className="z-50 flex h-8 w-8 flex-col items-center justify-center sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span className={`mb-1 h-0.5 w-6 transition-colors duration-300 ${
                shouldInvertNav() ? 'bg-white' : 'bg-black'
              }`} animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 6 : 0 }} />
              <motion.span className={`mb-1 h-0.5 w-6 transition-colors duration-300 ${
                shouldInvertNav() ? 'bg-white' : 'bg-black'
              }`} animate={{ opacity: mobileMenuOpen ? 0 : 1 }} />
              <motion.span className={`h-0.5 w-6 transition-colors duration-300 ${
                shouldInvertNav() ? 'bg-white' : 'bg-black'
              }`} animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -6 : 0 }} />
            </motion.button>
          )}
        </div>
              </header>
        
        {/* --- Mobile Menu Overlay --- */}
      <AnimatePresence>
        {mobileMenuOpen && currentSection !== 'siop' && (
          <motion.div
            className={`sm:hidden fixed inset-0 z-40 flex flex-col items-center justify-center transition-colors duration-300 ${
              shouldInvertNav() ? 'bg-black/90 backdrop-blur-md' : getLightGrayBg()
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {navItems.map((item, index) => {
              const targetId = item.toLowerCase().replace(/\s+/g, '-');
              return (
                <motion.a
                  key={item}
                  href={`#${targetId}`}
                  onClick={(e) => handleLinkClick(e, targetId)}
                  className={`text-2xl font-medium mb-8 cursor-pointer transition-colors ${
                    shouldInvertNav() ? 'text-white hover:text-gray-300' : getBlackText() + ' hover:text-gray-600'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="-mt-16 sm:-mt-24">
        {/* --- SiOP Section (First Fold) --- */}
        <section id="siop" className={`snap-section flex items-center justify-center overflow-hidden relative px-4 sm:px-0 ${getLightGrayBg()} snap-start`}>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Particle Logo Container - Optimized for SOVEREIGN readability */}
            <div className="w-full max-w-7xl h-72 sm:h-80 md:h-96 lg:h-[28rem] relative">
              <ParticleLogo className="absolute inset-0" showUnity={showUnity} />
            </div>
          </div>
          
          {/* Distribute Button - Only for L484 animation */}
          {currentSection === 'siop' && (
            <motion.button
              onClick={() => setShowUnity(!showUnity)}
              className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 px-8 py-3 rounded-full border-2 font-medium text-lg transition-all duration-300 ${
                showUnity 
                  ? 'bg-black text-white border-black hover:bg-gray-800' 
                  : 'bg-white text-black border-black hover:bg-gray-100'
              } hover:scale-105 z-10`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 6, duration: 0.5 }} // Appear after cube formation
            >
              {showUnity ? 'Reset' : 'Distribute'}
            </motion.button>
          )}
        </section>

        {/* --- Navigation Sections --- */}
        {navItems.map((item, index) => {
          const targetId = item.toLowerCase().replace(/\s+/g, '-');
          const bgColor = getLightGrayBg();
          const textColor = getBlackText();
          const subTextColor = getGrayText();
          
          return (
            <section key={targetId} id={targetId} className={`snap-section flex flex-col snap-start min-h-screen ${
              item === 'Syntropy' ? 'bg-transparent relative' : bgColor + ' relative'
            }`}>
              <div className={`flex-1 flex items-center justify-center min-h-0 relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4`}>
                <div className={`text-center max-w-2xl w-full mx-auto ${textColor}`}>
                  {item === 'Vehicles' ? (
                    <motion.h2 
                      className="text-3xl sm:text-4xl font-rajdhani font-bold tracking-wide uppercase"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 4.0, ease: "easeOut" }}
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      {item}
                    </motion.h2>
                  ) : (
                    <h2 className={`${
                      item === 'Syntropy' 
                        ? 'text-6xl sm:text-7xl font-ivymode font-light text-white drop-shadow-xl relative z-20' 
                        : 'text-3xl sm:text-4xl font-rajdhani font-bold'
                    } tracking-wide uppercase`}>
                      {item}
                    </h2>
                  )}
                  
                {item === 'Money' && (
                  <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                    Digital currencies, financial systems, and the evolution of value exchange. Exploring how blockchain technology, cryptocurrencies, and fintech innovations are reshaping global economics.
                  </p>
                )}

                {item === 'Identity' && (
                  <p className={`mt-4 text-base sm:text-lg leading-relaxed text-center mx-auto ${subTextColor}`}>
                    Digital identity and personal data management in the modern age. How we represent ourselves online and control our digital footprint across platforms and services.
                  </p>
                )}

                {item === 'Networks' && (
                  <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                    The infrastructure and protocols that connect our world. Understanding how information flows and the systems that enable global communication and commerce.
                  </p>
                )}

                {item === 'Syntropy' && (
                  <div className="font-ivymode relative z-20">
                    <p className="text-xl sm:text-2xl font-semibold text-white mt-2 mb-4 drop-shadow-lg">
                      Medicine Reimagined
                    </p>
                    <p className="mt-4 text-base sm:text-lg leading-relaxed font-light text-white/90 drop-shadow-lg">
                    We’ve been taught that the universe and the body inevitably slip toward entropy: decay, disorder, decline.
                    Yet life itself is inherently syntropic—conscious, intelligent, self-healing..
                    </p>
                    
                    {/* Syntropy Service Badges */}
                    <motion.div 
                      className="flex flex-wrap justify-center gap-3 mt-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      <motion.button
                        onClick={() => setLightboxText({
                          title: 'Manual Kinetics', 
                          content: 'Syntropy Manual Kinetics is the science of biological optimization, integrating advanced muscle testing, facial analysis, iridology, and manual field diagnostics to assess the body\'s structural and functional condition.'
                        })}
                        className="px-4 py-2 text-sm font-medium border-2 border-white/80 rounded-full transition-all duration-300 hover:bg-white/20 hover:border-white text-white/90 hover:text-white bg-transparent backdrop-blur-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Manual Kinetics
                      </motion.button>
                      
                      <motion.button
                        onClick={() => setLightboxText({
                          title: 'Frequency Analysis-Therapy', 
                          content: 'Syntropy Frequency Analysis-Therapy represents the leading edge of frequency-based healing in the United States, specializing in individualized frequency protocols and digital homeopathy. Using advanced Swiss-German technology, we identify and address the root causes of cellular energy loss, leveraging over 200 million trackable data points.'
                        })}
                        className="px-4 py-2 text-sm font-medium border-2 border-white/80 rounded-full transition-all duration-300 hover:bg-white/20 hover:border-white text-white/90 hover:text-white bg-transparent backdrop-blur-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Frequency Analysis-Therapy
                      </motion.button>
                      
                      <motion.button
                        onClick={() => setLightboxText({
                          title: 'Syntropy Concierge', 
                          content: 'The individualized protocol developed through Kinetic assessment and frequency analysis will be seamlessly integrated into your daily lifestyle—including nutrition, supplementation, herbal support, and movement practices tailored to your unique needs and goals.'
                        })}
                        className="px-4 py-2 text-sm font-medium border-2 border-white/80 rounded-full transition-all duration-300 hover:bg-white/20 hover:border-white text-white/90 hover:text-white bg-transparent backdrop-blur-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Syntropy Concierge
                      </motion.button>
                    </motion.div>
                  </div>
                )}

                {item === 'Vehicles' && (
                  <div className="w-full relative">
                    {/* Background Vehicle Images */}
                    <div className="absolute inset-0 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 z-0">
                      {/* im-climber */}
                      <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        whileInView={{ 
                          opacity: [0, 1, 1, 0.15],
                          y: [50, 0, 0, 0],
                          scale: [0.8, 1, 1, 1]
                        }}
                        transition={{ 
                          duration: 3.5, 
                          delay: 0.2, 
                          ease: "easeOut",
                          times: [0, 0.3, 0.7, 1]
                        }}
                        viewport={{ once: true, amount: 0.3 }}
                      >
                        <img 
                          src="/im-climber.png" 
                          alt="Inmotion Climber"
                          className="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-xl"
                        />
                      </motion.div>
                      
                      {/* im-air-pro */}
                      <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        whileInView={{ 
                          opacity: [0, 1, 1, 0.15],
                          y: [50, 0, 0, 0],
                          scale: [0.8, 1, 1, 1]
                        }}
                        transition={{ 
                          duration: 3.5, 
                          delay: 0.4, 
                          ease: "easeOut",
                          times: [0, 0.3, 0.7, 1]
                        }}
                        viewport={{ once: true, amount: 0.3 }}
                      >
                        <img 
                          src="/im-air-pro.png" 
                          alt="Inmotion Air Pro"
                          className="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-xl"
                        />
                      </motion.div>
                      
                      {/* im-rs */}
                      <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        whileInView={{ 
                          opacity: [0, 1, 1, 0.15],
                          y: [50, 0, 0, 0],
                          scale: [0.8, 1, 1, 1]
                        }}
                        transition={{ 
                          duration: 3.5, 
                          delay: 0.6, 
                          ease: "easeOut",
                          times: [0, 0.3, 0.7, 1]
                        }}
                        viewport={{ once: true, amount: 0.3 }}
                      >
                        <img 
                          src="/im-rs.png" 
                          alt="Inmotion RS"
                          className="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-xl"
                        />
                      </motion.div>
                    </div>
                    
                    {/* Foreground Text Content */}
                    <motion.div 
                      className="relative z-20"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 4.0, ease: "easeOut" }}
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                        Transportation innovation and autonomous systems. The future of mobility, from electric vehicles to smart infrastructure and connected transportation networks.
                      </p>
                      
                      {/* Vehicle Name Badges */}
                      <motion.div 
                        className="flex flex-wrap justify-center gap-3 mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 4.6, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.3 }}
                      >
                        <motion.button
                          onClick={() => setLightboxImage({src: '/im-climber.png', name: 'Inmotion Climber'})}
                          className={`px-4 py-2 text-sm font-medium border-2 border-black rounded-full transition-all duration-300 hover:bg-black hover:text-white ${getBlackText()} bg-transparent`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Inmotion Climber
                        </motion.button>
                        
                        <motion.button
                          onClick={() => setLightboxImage({src: '/im-air-pro.png', name: 'Inmotion Air Pro'})}
                          className={`px-4 py-2 text-sm font-medium border-2 border-black rounded-full transition-all duration-300 hover:bg-black hover:text-white ${getBlackText()} bg-transparent`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Inmotion Air Pro
                        </motion.button>
                        
                        <motion.button
                          onClick={() => setLightboxImage({src: '/im-rs.png', name: 'Inmotion RS'})}
                          className={`px-4 py-2 text-sm font-medium border-2 border-black rounded-full transition-all duration-300 hover:bg-black hover:text-white ${getBlackText()} bg-transparent`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Inmotion RS
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </div>
                )}
                        
                {item === 'Work' && (
                  <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                    The evolution of work in the digital era. Remote collaboration, automation, and the changing nature of employment in a technology-driven economy.
                  </p>
                )}
                          
                {item === 'Community' && (
                  <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                    Building connections and fostering collaboration. How technology can strengthen communities, enable collective action, and create meaningful social impact.
                  </p>
                )}
                                </div>
                                      </div>
            </section>
          );
        })}
      </main>

      {/* Floating PDF Export Button */}
      <motion.button
        id="export-button"
        onClick={exportToPDF}
        disabled={isExporting}
        className={`fixed bottom-8 left-8 z-50 flex items-center justify-center w-14 h-14 rounded-full border-2 border-black shadow-lg transition-all duration-300 ${
          isExporting 
            ? 'bg-gray-400 cursor-not-allowed border-gray-400' 
            : 'bg-transparent hover:bg-gray-100 hover:scale-110'
        } ${
          isExporting 
            ? 'text-white' 
            : 'text-black'
        } font-medium`}
        whileHover={!isExporting ? { scale: 1.1 } : {}}
        whileTap={!isExporting ? { scale: 0.95 } : {}}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        title="Export to PDF"
      >
        {isExporting ? (
          <motion.div
            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path 
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <polyline 
              points="14,2 14,8 20,8" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <line 
              x1="16" 
              y1="13" 
              x2="8" 
              y2="13" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <line 
              x1="16" 
              y1="17" 
              x2="8" 
              y2="17" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <polyline 
              points="10,9 9,9 8,9" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        )}
      </motion.button>

      {/* Floating Back Button */}
      <motion.button
        onClick={(e) => {
          const sections = ['siop', 'money', 'identity', 'networks', 'syntropy', 'vehicles', 'work', 'community'];
          const currentIndex = sections.indexOf(currentSection);
          const prevIndex = currentIndex - 1;
          
          if (prevIndex >= 0) {
            const prevSection = sections[prevIndex];
            // Do exactly what the nav items do
            handleLinkClick(e as any, prevSection);
          }
        }}
        className={`fixed bottom-8 right-40 z-50 flex items-center justify-center px-6 py-3 rounded-full border-2 shadow-lg transition-all duration-300 min-w-[120px] ${
          currentSection === 'siop' 
            ? 'bg-transparent border-gray-300 text-gray-400 cursor-not-allowed opacity-50' 
            : currentSection === 'syntropy'
              ? 'bg-white border-white text-black hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]'
              : 'bg-transparent border-black text-black hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]'
        } font-medium`}
        whileHover={currentSection !== 'siop' ? { 
          boxShadow: currentSection === 'syntropy' 
            ? "0 0 25px rgba(255,255,255,0.8)" 
            : "0 0 25px rgba(0,0,0,0.4)"
        } : {}}
        whileTap={currentSection !== 'siop' ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        disabled={currentSection === 'siop'}
        title={currentSection === 'siop' ? 'First section' : 'Go to previous section'}
      >
        {currentSection !== 'siop' && (
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path 
              d="M19 12H5M12 19l-7-7 7-7" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        )}
        <span className="text-sm font-semibold">
          {currentSection === 'siop' ? 'Start' : 'Back'}
        </span>
      </motion.button>

      {/* Floating Next Button */}
      <motion.button
        onClick={(e) => {
          // Direct mapping to exactly what works
          if (currentSection === 'siop') {
            handleLinkClick(e as any, 'money');
          } else if (currentSection === 'money') {
            handleLinkClick(e as any, 'identity');
          } else if (currentSection === 'identity') {
            handleLinkClick(e as any, 'networks');
          } else if (currentSection === 'networks') {
            handleLinkClick(e as any, 'syntropy');
          } else if (currentSection === 'syntropy') {
            handleLinkClick(e as any, 'vehicles');
          } else if (currentSection === 'vehicles') {
            handleLinkClick(e as any, 'work');
          } else if (currentSection === 'work') {
            // This should work exactly like clicking the Community nav item
            handleLinkClick(e as any, 'community');
          }
        }}
        className={`fixed bottom-8 right-8 z-50 flex items-center justify-center px-6 py-3 rounded-full border-2 shadow-lg transition-all duration-300 min-w-[120px] ${
          currentSection === 'community' 
            ? 'bg-gray-400 border-gray-400 cursor-not-allowed opacity-50 text-white' 
            : currentSection === 'syntropy'
              ? 'border-white bg-black text-white hover:bg-gray-800 hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]'
              : 'border-black bg-black text-white hover:bg-gray-800 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]'
        } font-medium`}
        whileHover={currentSection !== 'community' ? { 
          boxShadow: currentSection === 'syntropy' 
            ? "0 0 25px rgba(255,255,255,0.8)" 
            : "0 0 25px rgba(0,0,0,0.4)"
        } : {}}
        whileTap={currentSection !== 'community' ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        disabled={currentSection === 'community'}
        title={currentSection === 'community' ? 'Last section' : 'Go to next section'}
      >
        <span className="text-sm font-semibold">
          {currentSection === 'community' ? 'End' : 'Next'}
        </span>
        {currentSection !== 'community' && (
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2"
          >
            <path 
              d="M5 12h14M12 5l7 7-7 7" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        )}
      </motion.button>

      {/* Export Progress Indicator */}
      <AnimatePresence>
        {isExporting && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-8 text-center max-w-sm mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <motion.div
                className="w-12 h-12 border-4 border-nostr-purple border-t-transparent rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Generating PDF</h3>
              <p className="text-gray-600">Capturing sections and creating your portfolio...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vehicle Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-white/95 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -top-14 right-2 text-black/80 hover:text-black transition-all duration-300 hover:scale-110 z-20"
                aria-label="Close lightbox"
              >
                <div className="w-10 h-10 rounded-full bg-black/5 backdrop-blur-sm border border-black/10 flex items-center justify-center hover:bg-black/10 transition-all duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
              </button>
              
              {/* Image */}
              <motion.img
                src={lightboxImage.src}
                alt={lightboxImage.name}
                className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

             {/* Syntropy Text Lightbox Modal */}
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
             {/* Background overlay matching main page */}
             <div className="absolute inset-0 bg-black/60"></div>
             
             <motion.div
               className="relative max-w-4xl max-h-[85vh] mx-4 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10"
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               transition={{ type: "spring", damping: 30, stiffness: 400 }}
               onClick={(e) => e.stopPropagation()}
             >
               {/* Elegant glow effect */}
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-3xl"></div>
               
               {/* Close Button */}
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
               
               {/* Content */}
               <motion.div
                 className="p-10 sm:p-14 text-center"
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2, duration: 0.6 }}
               >
                 {/* Title with luxury styling */}
                 <motion.h3
                   className="text-4xl sm:text-5xl lg:text-6xl font-ivymode font-light text-white mb-3 tracking-wider drop-shadow-2xl"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3, duration: 0.8 }}
                 >
                   {lightboxText.title}
                 </motion.h3>
                 
                 {/* Decorative line */}
                 <motion.div
                   className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-8"
                   initial={{ scaleX: 0 }}
                   animate={{ scaleX: 1 }}
                   transition={{ delay: 0.5, duration: 0.8 }}
                 ></motion.div>
                 
                 {/* Description with enhanced typography */}
                 <motion.p
                   className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-white/95 font-light max-w-3xl mx-auto drop-shadow-lg font-ivymode"
                   style={{ lineHeight: '1.8' }}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.6, duration: 0.8 }}
                 >
                   {lightboxText.content}
                 </motion.p>
               </motion.div>
               
               {/* Bottom elegant border */}
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
