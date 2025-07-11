import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { wrap } from 'popmotion';
import './App.css';

const letter = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 15,
      stiffness: 300,
    },
  },
};

const sentenceLeftToRight = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const sentenceRightToLeft = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      staggerDirection: -1 as const,
    },
  },
};

const letterExit = {
  opacity: 0,
  y: -20,
  transition: {
    ease: 'easeIn' as const,
    duration: 0.3,
  },
};

function App() {
  const [step, setStep] = useState(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('hasVisited')) {
      return 13; // Jump to the final step
    }
    return 0;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('app-anatomy');
  const [modalOpen, setModalOpen] = useState(false);
  const [rhodopsinProgress, setRhodopsinProgress] = useState(0);
  const [footnoteVisible, setFootnoteVisible] = useState(false);
  const [footnoteTextChanged, setFootnoteTextChanged] = useState(false);
  
  const slides = [
    { type: 'image', src: '/screen-1.png', alt: 'Proux application screenshot 1' },
    { type: 'quote', text: 'Utilise habituated patterns, basically the user’s unconscious behavior, to make app use easy' },
    { type: 'image', src: '/screen-2.png', alt: 'Proux application screenshot 2' },
    { type: 'quote', text: 'Just like the doorway effect people forget information as they move screens. Don\'t make them think' },
  ];
  const [[page, direction], setPage] = useState([0, 0]);

  const slideIndex = wrap(0, slides.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  // Sequence timings (0.5x speed = half the original durations)
  const durations = [
    1000, 1000, 2000, 1000, 1500, 1000, 500, 500, 500, 500, 500, 500,
  ];

  const navItems = ['App Anatomy', 'Hey', 'Research', 'Testing', 'Ergonomics', 'Predict Efficacy'];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    e.preventDefault();
    
    // Use smooth scrolling that works with our refined snap behavior
    document.getElementById(targetId)?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    
    setMobileMenuOpen(false);
  };

  // Determine if current section should have inverted nav colors
  const shouldInvertNav = () => {
    const blackSections = ['hey', 'testing', 'predict-efficacy']; // These are the black sections (even indexed sections from navItems.slice(1))
    return blackSections.includes(currentSection);
  };

  useEffect(() => {
    if (step === 0 && typeof window !== 'undefined') {
      localStorage.setItem('hasVisited', 'true');
    }
    if (step < durations.length) {
      const timer = setTimeout(() => {
        setStep((prevStep) => prevStep + 1);
      }, durations[step]);
      return () => clearTimeout(timer);
    }
  }, [step]);

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
      const sections = ['app-anatomy', 'hey', 'research', 'testing', 'ergonomics', 'predict-efficacy'];
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
              const blackSections = ['hey', 'testing', 'predict-efficacy'];
              const isBlackSection = blackSections.includes(sectionId);
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

  // Rhodopsin progress animation
  useEffect(() => {
    if (currentSection === 'hey' || currentSection === 'research') {
      setRhodopsinProgress(0);
      const interval = setInterval(() => {
        setRhodopsinProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // Hide progress bar 1 second after completion
            setTimeout(() => {
              setRhodopsinProgress(-1); // Use -1 to indicate hidden state
            }, 1000);
            return 100;
          }
          return prev + (100 / (20 * 10)); // 20 seconds, 10 updates per second
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setRhodopsinProgress(0);
    }
  }, [currentSection]);

  // Footnote timing for first quote
  useEffect(() => {
    if (step >= 6 && slideIndex === 1) {
      // Reset states when entering first quote
      setFootnoteVisible(false);
      setFootnoteTextChanged(false);
      
      // Show footnote after 2 seconds
      const showTimer = setTimeout(() => {
        setFootnoteVisible(true);
      }, 2000);
      
      // Change text after 4 seconds total (2s + 2s)
      const changeTimer = setTimeout(() => {
        setFootnoteTextChanged(true);
      }, 4000);
      
      return () => {
        clearTimeout(showTimer);
        clearTimeout(changeTimer);
      };
    } else {
      setFootnoteVisible(false);
      setFootnoteTextChanged(false);
    }
  }, [step, slideIndex]);

  return (
    <div className="bg-white font-orbitron">
      {/* --- Sticky Header --- */}
      <header className={`sticky top-0 z-50 transition-colors duration-300 ${
        shouldInvertNav() ? 'bg-black' : 'bg-white'
      }`}>
        <div className="relative flex h-16 items-center justify-between px-4 sm:h-24 sm:block sm:px-0">
          <a href="#app-anatomy" onClick={(e) => handleLinkClick(e, 'app-anatomy')}>
            <motion.div
              className={`text-lg font-bold sm:absolute sm:top-8 sm:left-8 sm:text-2xl transition-colors duration-300 ${
                shouldInvertNav() ? 'text-white' : 'text-black'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 5 ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              PROUX
            </motion.div>
          </a>

          {/* Desktop Navigation */}
          <nav className={`hidden sm:flex sm:absolute sm:top-8 sm:right-8 items-center space-x-8 text-lg font-medium transition-colors duration-300 ${
            shouldInvertNav() ? 'text-white' : 'text-black'
          }`}>
            {navItems.map((item, index) => {
              const appearStep = 6 + index;
              const targetId = item.toLowerCase().replace(/\s+/g, '-');
              return (
                <motion.a
                  key={item}
                  href={`#${targetId}`}
                  onClick={(e) => handleLinkClick(e, targetId)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: step >= appearStep ? 1 : 0, y: step >= appearStep ? 0 : -20 }}
                  transition={{ duration: 0.3 }}
                  className={`cursor-pointer transition-colors ${
                    shouldInvertNav() ? 'hover:text-gray-300' : 'hover:text-gray-600'
                  }`}
                >
                  {item}
                </motion.a>
              );
            })}
          </nav>

          {/* Mobile Hamburger Button */}
          <motion.button
            className="z-30 flex h-8 w-8 flex-col items-center justify-center sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 6 ? 1 : 0 }}
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
        </div>
      </header>
      
      {/* --- Mobile Menu Overlay --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={`sm:hidden fixed inset-0 z-40 flex flex-col items-center justify-center transition-colors duration-300 ${
              shouldInvertNav() ? 'bg-black' : 'bg-white'
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
                      ? 'text-white hover:text-gray-300' 
                      : 'text-black hover:text-gray-600'
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

      {/* --- Sad Face Modal Button --- */}
      <AnimatePresence>
        {currentSection !== 'app-anatomy' && (
          <motion.button
            onClick={() => setModalOpen(true)}
            className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 hover:rotate-12 ${
              shouldInvertNav() ? 'bg-secondary-black text-white shadow-lg' : 'bg-white text-black shadow-lg'
            }`}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            whileHover={{ scale: 1.1, rotate: 12 }}
            whileTap={{ scale: 0.95 }}
          >
            ☹️
          </motion.button>
        )}
      </AnimatePresence>

      {/* --- UX Mistakes Modal --- */}
      <AnimatePresence>
        {modalOpen && (
                     <motion.div
             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={() => setModalOpen(false)}
           >
                         <motion.div
               className={`rounded-lg p-6 max-w-md w-full mx-4 relative ${
                 shouldInvertNav() ? 'bg-secondary-black text-white' : 'bg-white text-black'
               }`}
               initial={{ scale: 0.8, opacity: 0, y: 50 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.8, opacity: 0, y: 50 }}
               transition={{ type: "spring", stiffness: 300, damping: 25 }}
               onClick={(e) => e.stopPropagation()}
             >
               <button
                 onClick={() => setModalOpen(false)}
                 className={`absolute top-4 right-4 text-xl transition-colors ${
                   shouldInvertNav() ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                 }`}
               >
                 ×
               </button>
               
               <h2 className={`text-2xl font-bold mb-6 ${
                 shouldInvertNav() ? 'text-white' : 'text-black'
               }`}>UX Mistakes</h2>
               
               <div className="space-y-4 mb-6">
                 <div>
                   <h3 className={`text-lg font-bold mb-2 ${
                     shouldInvertNav() ? 'text-white' : 'text-black'
                   }`}>Hijacked Scroll</h3>
                   <p className={`text-sm leading-relaxed ${
                     shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                   }`}>
                     Never hijack the users scroll, it's annoying and largely unexpected behaviour
                   </p>
                 </div>
                 
                 <div>
                   <h3 className={`text-lg font-bold mb-2 ${
                     shouldInvertNav() ? 'text-white' : 'text-black'
                   }`}>Light & Dark</h3>
                   <p className={`text-sm leading-relaxed ${
                     shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                   }`}>
                     You're causing the user to either generate or decay rhodopsin pigments in their eyes and it takes time to adjust
                   </p>
                 </div>
                 
                 <div>
                   <h3 className={`text-lg font-bold mb-2 ${
                     shouldInvertNav() ? 'text-white' : 'text-black'
                   }`}>Halation:</h3>
                   <p className={`text-sm leading-relaxed ${
                     shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                   }`}>
                     Pure white on pure black or vice versa causes halation, which is a glow behind the text making it harder to read:
                   </p>
                 </div>
               </div>
               
               <div className="flex flex-col space-y-3">
                 <button 
                   onClick={() => setModalOpen(false)}
                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                     shouldInvertNav() 
                       ? 'bg-white text-black hover:bg-gray-200' 
                       : 'bg-black text-white hover:bg-gray-800'
                   }`}
                 >
                   Fix these issues
                 </button>
                 <button 
                   onClick={() => setModalOpen(false)}
                   className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
                     shouldInvertNav() 
                       ? 'border-white text-white hover:bg-white hover:text-black' 
                       : 'border-black text-black hover:bg-black hover:text-white'
                   }`}
                 >
                   Nah I like them
                 </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="-mt-16 sm:-mt-24">
        {/* --- App Anatomy Section (First Fold) --- */}
        <section id="app-anatomy" className="snap-section flex items-center justify-center overflow-hidden relative px-4 sm:px-0 bg-white snap-start">
          <div className="absolute inset-0 flex items-center justify-center">
            <LayoutGroup>
              <AnimatePresence mode="wait">
                {step <= 1 && (
                  <motion.div
                    key="word-sequence"
                    className="text-3xl sm:text-6xl md:text-8xl font-bold text-black text-center"
                  >
                    {step === 0 && (
                      <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        BITCOIN
                      </motion.span>
                    )}
                    {step === 1 && (
                      <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        NOSTR
                      </motion.span>
                    )}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="source-words-full"
                    className="flex flex-col items-center justify-center text-center w-full"
                  >
                    <motion.div
                      className="text-3xl sm:text-6xl md:text-8xl font-bold text-black flex justify-center w-full tracking-wide md:tracking-wider"
                      variants={sentenceRightToLeft}
                      initial="hidden"
                      animate="visible"
                    >
                      {'PROTOCOLS'.split('').map((char, index) => (
                        <motion.span
                          key={`p-${index}`}
                          layoutId={`char-proux-${index}`}
                          variants={letter}
                          className="inline-block"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.div>
                    <motion.div
                      className="text-2xl sm:text-5xl md:text-7xl font-bold text-black flex flex-wrap justify-center w-full mt-4"
                      variants={sentenceLeftToRight}
                      initial="hidden"
                      animate="visible"
                    >
                      {'USER EXPERIENCE'.split('').map((char, index) => (
                        <motion.span
                          key={`ue-${index}`}
                          layoutId={`ue-${index}`}
                          variants={letter}
                          className="inline-block"
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                      ))}
                    </motion.div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="source-words-reduced"
                    className="flex flex-col items-center justify-center text-center w-full"
                  >
                    <motion.div className="text-3xl sm:text-6xl md:text-8xl font-bold text-black flex justify-center w-full tracking-wide md:tracking-wider">
                      {'PROTOCOLS'.split('').map((char, index) => (
                        <motion.span
                          key={`p-${index}`}
                          layoutId={`char-proux-${index}`}
                          className="inline-block"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.div>
                    <motion.div className="text-2xl sm:text-5xl md:text-7xl font-bold text-black flex flex-wrap justify-center w-full mt-4">
                      <motion.span layoutId="ue-0" className="inline-block">U</motion.span>
                      <motion.span layoutId="ue-13" className="inline-block">X</motion.span>
                    </motion.div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="proux-center"
                    className="text-6xl sm:text-8xl md:text-9xl font-bold flex items-center text-black"
                  >
                    <motion.span layoutId="char-proux-0" transition={{ type: "spring", stiffness: 200, damping: 25 }}>P</motion.span>
                    <motion.span layoutId="char-proux-1" transition={{ type: "spring", stiffness: 200, damping: 25 }}>R</motion.span>
                    <motion.span layoutId="char-proux-2" transition={{ type: "spring", stiffness: 200, damping: 25 }}>O</motion.span>
                    <motion.span layoutId="ue-0" transition={{ type: "spring", stiffness: 200, damping: 25 }}>U</motion.span>
                    <motion.span layoutId="ue-13" transition={{ type: "spring", stiffness: 200, damping: 25 }}>X</motion.span>
                  </motion.div>
                )}
                
                {step >= 5 && (
                  <motion.div
                    key="proux-fade-out"
                    className="text-6xl sm:text-8xl md:text-9xl font-bold text-black"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5 }}
                  >
                    PROUX
                  </motion.div>
                )}

              </AnimatePresence>
            </LayoutGroup>
          </div>

          {/* --- Image Carousel --- */}
          <motion.div
            className="absolute inset-0 w-full h-full flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 z-0 -translate-y-8 sm:-translate-y-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 6 ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute w-full h-full flex items-center justify-center"
              >
                {slides[slideIndex].type === 'image' ? (
                  <img
                    src={(slides[slideIndex] as { src: string }).src}
                    alt={(slides[slideIndex] as { alt: string }).alt}
                    className="w-full h-full object-contain scale-[67.5%] sm:scale-75"
                  />
                ) : (
                  <div className="w-full max-w-2xl text-center px-4">
                    <p className="text-xl sm:text-2xl italic text-gray-800 leading-relaxed">
                      "{(slides[slideIndex] as { text: string }).text}"
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

                    {/* --- Footnote for first quote --- */}
          <motion.div
            className="absolute inset-x-0 bottom-48 sm:bottom-32 z-10 flex justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: footnoteVisible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs sm:text-sm text-gray-600 italic text-center max-w-md">
              It's a successful app, so, does it matter?<br />
              <motion.span
                key={footnoteTextChanged ? 'changed' : 'original'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 4, ease: "easeInOut" }}
              >
                {footnoteTextChanged ? '(is this distracting?)' : '(is this text too small?)'}
              </motion.span>
            </p>
          </motion.div>

          {/* --- Carousel Controls --- */}
          <motion.div
            className="absolute inset-x-0 bottom-24 sm:bottom-8 z-10 flex justify-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 6 ? 1 : 0 }}
          >
            <button
              onClick={() => paginate(-1)}
              className="p-2 bg-white/50 rounded-full hover:bg-white/80 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={() => paginate(1)}
              className="p-2 bg-white/50 rounded-full hover:bg-white/80 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </motion.div>
        </section>

        {/* --- Other Sections --- */}
        {navItems.slice(1).map((item, index) => {
          const targetId = item.toLowerCase().replace(/\s+/g, '-');
          const isEven = index % 2 === 0;
          const bgColor = isEven ? 'bg-black' : 'bg-white';
          const textColor = isEven ? 'text-white' : 'text-black';
          const subTextColor = isEven ? 'text-gray-300' : 'text-gray-700';
          
          // Determine rhodopsin message
          const getRhodopsinMessage = () => {
            if (targetId === 'hey') return 'Rhodopsin Pigments Generating';
            if (targetId === 'research') return 'Rhodopsin Pigments Decaying';
            return null;
          };
          
          const rhodopsinMessage = getRhodopsinMessage();
          
          return (
            <section key={targetId} id={targetId} className={`snap-section flex items-center justify-center snap-start ${bgColor}`}>
              <div className={`text-center max-w-2xl px-4 -translate-y-8 sm:-translate-y-16 ${textColor}`}>
                <h2 className="text-3xl sm:text-4xl font-bold">
                  {item === 'Hey' ? 'Does UX matter in Bitcoin and Nostr?' : item}
                </h2>
                {item === 'Hey' && (
                  <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                    I'm here for the people who answer yes and want to get a head start with the UX for their websites and applications rather than having to fix things retroactively. Though I'm more than happy to do that too.
                  </p>
                )}
                {item === 'Research' && (
                  <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                    Deep interviews with target and non target archetypes. Day in the life and affinity mapping, and most simply, understanding the user before they even use your product so it's tuned to their habits, interface knowledge, and expectations.
                  </p>
                )}
                {item === 'Testing' && (
                  <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                    Testing isn't presenting a random product to a random person and asking what they think, though there are some uses for guerilla testing, it all starts with a carefully crafted test to rule out known biases and simulate as real world situations as possible, with well written testing scripts.
                  </p>
                )}
                {item === 'Ergonomics' && (
                  <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                    Utilise habituated interactions, thumb flow, and best practices to make sure that your app is performant and isn't causing fatigue due to bad, unvalidated interface choices.
                  </p>
                )}
                {item === 'Predict Efficacy' && (
                  <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                    Use Baysian like theory to estimate the efficacy of user interface changes, new features, and more, with a better accuracy between concept to real world results. Start a database of insights and provenance of decision making that can work based on value to you and your users.
                  </p>
                )}
                
                {/* Rhodopsin Progress Bar */}
                {rhodopsinMessage && rhodopsinProgress >= 0 && (
                  <motion.div 
                    className="mt-8 flex flex-col items-center"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: rhodopsinProgress === -1 ? 0 : 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div 
                      className={`text-sm mb-2 ${subTextColor}`}
                      animate={{ 
                        opacity: [1, 0.6, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {rhodopsinMessage}
                    </motion.div>
                    <div className={`w-1/2 h-2 rounded-full overflow-hidden ${
                      isEven ? 'bg-gray-700' : 'bg-gray-300'
                    }`}>
                      <motion.div
                        className={`h-full rounded-full ${
                          isEven ? 'bg-white' : 'bg-black'
                        }`}
                        initial={{ width: '0%' }}
                        animate={{ width: `${Math.max(0, rhodopsinProgress)}%` }}
                        transition={{ duration: 0.1, ease: 'linear' }}
                      />
                    </div>
                    <motion.div 
                      className={`text-xs mt-1 ${subTextColor}`}
                      animate={{ 
                        opacity: [1, 0.7, 1]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {Math.round(Math.max(0, rhodopsinProgress))}% Complete
                    </motion.div>
                  </motion.div>
                )}
                
                {/* "What?" link after progress bar disappears */}
                {rhodopsinMessage && rhodopsinProgress === -1 && (
                  <motion.div 
                    className="mt-8 flex justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <button
                      onClick={() => setModalOpen(true)}
                      className={`text-sm underline transition-colors hover:opacity-70 ${
                        isEven ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      What?
                    </button>
                  </motion.div>
                )}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

export default App;
