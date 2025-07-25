import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ParticleLogo from './components/ParticleLogo';
import SoundwaveParticles from './components/SoundwaveParticles';
import './App.css';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('siop');
  const [navLinePosition, setNavLinePosition] = useState({ x: 0, width: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isExporting, setIsExporting] = useState(false);
  
  // Helper functions for colors
  const getBlackBg = () => 'bg-black';
  const getWhiteBg = () => 'bg-white';
  const getBlackText = () => 'text-black';
  const getWhiteText = () => 'text-white';

  const navItems = ['Money', 'Identity', 'Networks', 'Health', 'Vehicles', 'Work', 'Community'];

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

      const sections = ['siop', 'money', 'identity', 'networks', 'health', 'vehicles', 'work', 'community'];
      
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

  // Determine if current section should have inverted nav colors
  const shouldInvertNav = () => {
    // SiOP (white page) = white header, black text = false
    if (currentSection === 'siop') return false;
    
    // Get the index of the current section in navItems
    const sectionIndex = navItems.findIndex(item => 
      item.toLowerCase().replace(/\s+/g, '-') === currentSection
    );
    
    // Even indexes (0,2,4,6) = black pages = black header, white text = true
    // Odd indexes (1,3,5) = white pages = white header, black text = false
    return sectionIndex !== -1 && sectionIndex % 2 === 0;
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
      const sections = ['siop', 'money', 'identity', 'networks', 'health', 'vehicles', 'work', 'community'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;

          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setCurrentSection(sectionId);
            
            // Update theme color for mobile status bar
            const metaThemeColor = document.getElementById('theme-color-meta') as HTMLMetaElement;
            if (metaThemeColor) {
              // Use same logic as shouldInvertNav to determine if section is black
              let isBlackSection = false;
              if (sectionId !== 'siop') {
                const sectionIndex = navItems.findIndex(item => 
                  item.toLowerCase().replace(/\s+/g, '-') === sectionId
                );
                isBlackSection = sectionIndex !== -1 && sectionIndex % 2 === 0;
              }
              metaThemeColor.setAttribute('content', isBlackSection ? '#000000' : '#ffffff');
            }
            
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className={`${getWhiteBg()} font-futuristic`}>
      {/* --- Sticky Header --- */}
      <header className={`sticky top-0 z-50 transition-colors duration-300 ${
        shouldInvertNav() ? getBlackBg() : getWhiteBg()
      }`} style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="relative flex h-16 items-center justify-between px-4 sm:h-24 sm:block sm:px-0">
          <a href="#siop" onClick={(e) => handleLinkClick(e, 'siop')}>
            <div
              className={`text-lg font-bold sm:absolute sm:top-8 sm:left-8 sm:text-2xl transition-colors duration-300 ${
                shouldInvertNav() ? getWhiteText() : getBlackText()
              }`}
            >
              SiOP
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className={`hidden sm:flex sm:absolute sm:top-8 sm:right-8 items-center space-x-8 text-lg font-medium transition-colors duration-300 ${
            shouldInvertNav() ? getWhiteText() : getBlackText()
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

          {/* Mobile Hamburger Button */}
            <motion.button
              className="z-50 flex h-8 w-8 flex-col items-center justify-center sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            >
              <motion.span className={`mb-1 h-0.5 w-6 transition-colors duration-300 ${
                shouldInvertNav() ? getWhiteBg() : getBlackBg()
              }`} animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 6 : 0 }} />
              <motion.span className={`mb-1 h-0.5 w-6 transition-colors duration-300 ${
                shouldInvertNav() ? getWhiteBg() : getBlackBg()
              }`} animate={{ opacity: mobileMenuOpen ? 0 : 1 }} />
              <motion.span className={`h-0.5 w-6 transition-colors duration-300 ${
                shouldInvertNav() ? getWhiteBg() : getBlackBg()
              }`} animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -6 : 0 }} />
            </motion.button>
        </div>
              </header>
        
        {/* --- Mobile Menu Overlay --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={`sm:hidden fixed inset-0 z-40 flex flex-col items-center justify-center transition-colors duration-300 ${
              shouldInvertNav() ? getBlackBg() : getWhiteBg()
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
                    shouldInvertNav() 
                      ? `${getWhiteText()} hover:text-gray-300` 
                      : `${getBlackText()} hover:text-gray-600`
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
        <section id="siop" className={`snap-section flex items-center justify-center overflow-hidden relative px-4 sm:px-0 ${getWhiteBg()} snap-start`}>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Particle Logo Container - Optimized for SOVEREIGN readability */}
            <div className="w-full max-w-7xl h-72 sm:h-80 md:h-96 lg:h-[28rem] relative">
              <ParticleLogo className="absolute inset-0" />
            </div>
          </div>
        </section>

        {/* --- Navigation Sections --- */}
        {navItems.map((item, index) => {
          const targetId = item.toLowerCase().replace(/\s+/g, '-');
          const isEven = index % 2 === 0;
          const bgColor = isEven ? getBlackBg() : getWhiteBg();
                      const textColor = isEven ? getWhiteText() : getBlackText();
          const subTextColor = isEven ? 'text-gray-300' : 'text-gray-700';
          
          return (
            <section key={targetId} id={targetId} className={`snap-section flex flex-col snap-start ${bgColor} relative`}>
              {/* Soundwave Particles for Money section */}
              {item === 'Money' && (
                <div className="absolute inset-0 -top-16 sm:-top-24 z-0">
                  <SoundwaveParticles className="w-full h-[calc(100%+4rem)] sm:h-[calc(100%+6rem)]" />
                </div>
              )}
              
              <div className={`flex-1 flex items-center justify-center min-h-0 relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4`}>
                <div className={`text-center max-w-2xl w-full mx-auto ${textColor}`}>
                  <h2 className="text-3xl sm:text-4xl font-bold font-rajdhani tracking-wide">
                    {item}
                  </h2>
                  
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

                {item === 'Health' && (
                  <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                    Digital health solutions and wellness technologies. Exploring how technology can improve healthcare delivery, patient outcomes, and personal health management.
                  </p>
                )}

                {item === 'Vehicles' && (
                  <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                    Transportation innovation and autonomous systems. The future of mobility, from electric vehicles to smart infrastructure and connected transportation networks.
                  </p>
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
        className={`fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isExporting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : shouldInvertNav() 
              ? 'bg-white hover:bg-gray-100 hover:scale-110' 
              : 'bg-black hover:bg-gray-800 hover:scale-110'
        } ${
          isExporting 
            ? 'text-white' 
            : shouldInvertNav() 
              ? 'text-black' 
              : 'text-white'
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
    </div>
  );
}

export default App;
