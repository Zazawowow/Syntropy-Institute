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
  const [currentSection, setCurrentSection] = useState('anatomy');
  const [modalOpen, setModalOpen] = useState(false);
  const [rhodopsinProgress, setRhodopsinProgress] = useState(0);
  const [footnoteVisible, setFootnoteVisible] = useState(false);
  const [footnoteTextChanged, setFootnoteTextChanged] = useState(false);
  const [rhodopsinModalOpen, setRhodopsinModalOpen] = useState(false);
  const [dismissedLoaders, setDismissedLoaders] = useState<string[]>([]);
  const [questionAnswer, setQuestionAnswer] = useState<'yes' | 'no' | null>(null);
  const [show404, setShow404] = useState(false);
  const [show404Button, setShow404Button] = useState(false);
  const [returnedFrom404, setReturnedFrom404] = useState(false);
  const [ergonomicsState, setErgonomicsState] = useState<'button' | 'moved' | 'revealed'>('button');
  const [thumbFlowStage, setThumbFlowStage] = useState(0); // 0 = none, 1-4 = layer by layer
  const [thumbFlowProgress, setThumbFlowProgress] = useState(0);
  
  const slides = [
    { type: 'image', src: '/screen-1.png', alt: 'Proux application screenshot 1' },
    { type: 'quote', text: 'Utilise habituated patterns, basically the user’s unconscious behavior, to make the app a breeze to use' },
    { type: 'image', src: '/screen-2.png', alt: 'Proux application screenshot 2' },
    { type: 'quote', text: 'Just like the doorway effect, people forget information as they move from screen to screen. Don\'t make them think' },
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

  const navItems = ['Anatomy', 'Question', 'Research', 'Testing', 'Ergonomics', 'Prediction'];

  // Detect if mobile for button text  
  const [isMobile, setIsMobile] = useState(false);

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
    
    // Use appropriate scroll behavior - auto on mobile for better snap behavior, smooth on desktop
    document.getElementById(targetId)?.scrollIntoView({ 
      behavior: isMobile ? 'auto' : 'smooth',
      block: 'start'
    });
    
    setMobileMenuOpen(false);
  };

  // Determine if current section should have inverted nav colors
  const shouldInvertNav = () => {
    const blackSections = ['question', 'testing', 'prediction']; // These are the black sections (even indexed sections from navItems.slice(1))
    return blackSections.includes(currentSection);
  };

  // Handle rhodopsin modal dismissal
  const handleRhodopsinModalClose = () => {
    setRhodopsinModalOpen(false);
    // Add current section to dismissed loaders list
    if (currentSection && !dismissedLoaders.includes(currentSection)) {
      setDismissedLoaders(prev => [...prev, currentSection]);
    }
  };

  // Handle question answer
  const handleQuestionAnswer = (answer: 'yes' | 'no') => {
    if (answer === 'no') {
      setShow404(true);
    } else {
      setQuestionAnswer(answer);
    }
  };

  // Handle return from 404
  const handleReturnFrom404 = () => {
    setShow404(false);
    setQuestionAnswer(null);
    setReturnedFrom404(true);
  };

  // Handle ergonomics button interaction
  const handleErgonomicsHover = () => {
    if (ergonomicsState === 'button') {
      setErgonomicsState('moved');
    }
  };

  const handleErgonomicsClick = () => {
    if (ergonomicsState === 'button') {
      // On mobile (first tap), move the button
      setErgonomicsState('moved');
    } else if (ergonomicsState === 'moved') {
      // Second tap (or desktop click after hover), reveal content
      setErgonomicsState('revealed');
      // Start thumb flow animation on both mobile and desktop
      setTimeout(() => setThumbFlowStage(1), 1000);
    }
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
      const sections = ['anatomy', 'question', 'research', 'testing', 'ergonomics', 'prediction'];
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
              const blackSections = ['question', 'testing', 'prediction'];
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
    if (currentSection === 'question' || currentSection === 'research') {
      setRhodopsinProgress(0);
      const interval = setInterval(() => {
        setRhodopsinProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100; // Keep at 100% instead of hiding
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
      
      // Change text after 6 seconds total (2s + 4s)
      const changeTimer = setTimeout(() => {
        setFootnoteTextChanged(true);
      }, 6000);
      
      return () => {
        clearTimeout(showTimer);
        clearTimeout(changeTimer);
      };
    } else {
      setFootnoteVisible(false);
      setFootnoteTextChanged(false);
    }
  }, [step, slideIndex]);

  // 404 button timer
  useEffect(() => {
    if (show404) {
      setShow404Button(false);
      const timer = setTimeout(() => {
        setShow404Button(true);
      }, 2500);
      
      return () => clearTimeout(timer);
    } else {
      setShow404Button(false);
    }
  }, [show404]);

  // Thumb flow overlay animation
  useEffect(() => {
    if (thumbFlowStage > 0 && thumbFlowStage < 4) {
      const timer = setTimeout(() => {
        setThumbFlowStage(prev => prev + 1);
      }, 1500); // Each layer appears after 1.5 seconds
      
      return () => clearTimeout(timer);
    } else if (thumbFlowStage === 4) {
      // Hide loader after red overlay completes
      const timer = setTimeout(() => {
        setThumbFlowStage(5); // Stage 5 = completed (loader hidden)
      }, 2000); // Give red overlay 2 seconds to complete
      
      return () => clearTimeout(timer);
    }
  }, [thumbFlowStage]);

  // Thumb flow progress based on overlay stages
  useEffect(() => {
    if (thumbFlowStage === 0) {
      setThumbFlowProgress(0);
    } else {
      // Each stage represents 25% completion (4 stages total)
      const targetProgress = thumbFlowStage * 25;
      setThumbFlowProgress(targetProgress);
    }
  }, [thumbFlowStage]);

  return (
    <div className="bg-white font-orbitron">
      {/* --- 404 Page --- */}
      {show404 && (
        <div className="fixed inset-0 bg-white z-[100]">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="text-8xl sm:text-9xl font-bold text-black mb-8">404</h1>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-md mx-auto leading-relaxed">
                You're reason to be here couldn't be found
              </p>
            </div>
          </div>
          <AnimatePresence>
            {show404Button && (
              <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <button
                  onClick={handleReturnFrom404}
                  className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300"
                >
                  Ok, I'm Sorry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* --- Sticky Header --- */}
      <header className={`sticky top-0 z-50 transition-colors duration-300 ${
        shouldInvertNav() ? 'bg-black' : 'bg-white'
      }`}>
        <div className="relative flex h-16 items-center justify-between px-4 sm:h-24 sm:block sm:px-0">
          <a href="#anatomy" onClick={(e) => handleLinkClick(e, 'anatomy')}>
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
        {currentSection !== 'anatomy' && (
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
            {currentSection === 'ergonomics' && thumbFlowStage >= 5 ? '😡' : '☹️'}
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
               }`}>
                 {currentSection === 'ergonomics' && thumbFlowStage >= 5 ? 'Thumbflow Key' : 'UX Mistakes on this site'}
               </h2>
               
               <div className="space-y-4 mb-6">
                 {currentSection === 'ergonomics' && thumbFlowStage >= 5 ? (
                   // Thumb Flow Key
                   <>
                     <div className="flex items-center space-x-3">
                       <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgba(34, 197, 94, 0.8)' }}></div>
                       <span className={`text-sm ${shouldInvertNav() ? 'text-white' : 'text-black'}`}>Comfortable</span>
                     </div>
                     <div className="flex items-center space-x-3">
                       <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgba(234, 179, 8, 0.8)' }}></div>
                       <span className={`text-sm ${shouldInvertNav() ? 'text-white' : 'text-black'}`}>Less Comfortable</span>
                     </div>
                     <div className="flex items-center space-x-3">
                       <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgba(249, 115, 22, 0.8)' }}></div>
                       <span className={`text-sm ${shouldInvertNav() ? 'text-white' : 'text-black'}`}>Uncomfortable</span>
                     </div>
                     <div className="flex items-center space-x-3">
                       <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }}></div>
                       <span className={`text-sm ${shouldInvertNav() ? 'text-white' : 'text-black'}`}>Fatiguing</span>
                     </div>
                     <div className="mt-4 pt-4 border-t border-gray-300">
                       <h4 className={`text-sm font-bold mb-2 ${
                         shouldInvertNav() ? 'text-white' : 'text-black'
                       }`}>Takeaway</h4>
                       <p className={`text-sm leading-relaxed ${
                         shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                       }`}>
                         Prioritise primary and regular actions in comfortable areas where possible and relegate infrequent ones to the harder places.
                       </p>
                     </div>
                   </>
                 ) : (
                   // UX Mistakes
                   <>
                 <div>
                   <h3 className={`text-lg font-bold mb-2 ${
                     shouldInvertNav() ? 'text-white' : 'text-black'
                   }`}>Hijacked Scroll</h3>
                   <p className={`text-sm leading-relaxed ${
                     shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                   }`}>
                     Never hijack the users scroll, it's annoying, and largely an unexpected behaviour.
                   </p>
                 </div>
                 
                 <div>
                   <h3 className={`text-lg font-bold mb-2 ${
                     shouldInvertNav() ? 'text-white' : 'text-black'
                   }`}>Light to Dark Transitions</h3>
                   <p className={`text-sm leading-relaxed ${
                     shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                   }`}>
                         This makes a user's eyes either generate or decay rhodopsin pigments and it takes time to adjust while they find it hard to consume your content.
                   </p>
                 </div>
                 
                 <div>
                   <h3 className={`text-lg font-bold mb-2 ${
                     shouldInvertNav() ? 'text-white' : 'text-black'
                       }`}>Halation</h3>
                   <p className={`text-sm leading-relaxed ${
                     shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                   }`}>
                     Pure white on pure black or vice versa causes halation, which is a glow behind the text making it hard to read.
                   </p>
                 </div>
                   </>
                 )}
               </div>
               
               <div className="flex flex-col space-y-3">
                 {currentSection === 'ergonomics' && thumbFlowStage >= 5 ? (
                   // Thumb Flow Key Modal Button
                   <button 
                     onClick={() => setModalOpen(false)}
                     className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                       shouldInvertNav() 
                         ? 'bg-white text-black hover:bg-gray-200' 
                         : 'bg-black text-white hover:bg-gray-800'
                     }`}
                   >
                     I will never forget this, or you
                   </button>
                 ) : (
                   // UX Mistakes Modal Buttons
                   <>
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
                   </>
                 )}
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Rhodopsin Modal --- */}
      <AnimatePresence>
        {rhodopsinModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleRhodopsinModalClose}
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
                onClick={handleRhodopsinModalClose}
                className={`absolute top-4 right-4 text-xl transition-colors ${
                  shouldInvertNav() ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ×
              </button>
              
              <h2 className={`text-2xl font-bold mb-6 ${
                shouldInvertNav() ? 'text-white' : 'text-black'
              }`}>Rhodopsin Effects</h2>
              
                            <div className="space-y-4 mb-6">
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${
                    shouldInvertNav() ? 'text-white' : 'text-black'
                  }`}>
                    {currentSection === 'research' ? 'Dark to Light Transitions' : 'Light to Dark Transitions'}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    This makes a user's eyes {currentSection === 'research' ? 'decay' : 'generate'} rhodopsin pigments and it takes time to adjust while they find it hard to consume your content.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={handleRhodopsinModalClose}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    shouldInvertNav() 
                      ? 'bg-white text-black hover:bg-gray-200' 
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="-mt-16 sm:-mt-24">
        {/* --- App Anatomy Section (First Fold) --- */}
        <section id="anatomy" className="snap-section flex items-center justify-center overflow-hidden relative px-4 sm:px-0 bg-white snap-start">
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
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                      Takeaway
                    </h3>
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
          const loaderTextColor = isEven ? 'text-gray-500' : 'text-gray-400';
          const loaderBgColor = isEven ? 'bg-gray-800' : 'bg-gray-200';
          const loaderFillColor = isEven ? 'bg-gray-600' : 'bg-gray-500';
          
          // Determine rhodopsin message
          const getRhodopsinMessage = () => {
            if (targetId === 'question') {
              return rhodopsinProgress >= 100 
                ? 'Rhodopsin Pigments Generated' 
                : 'Rhodopsin Pigments Generating';
            }
            if (targetId === 'research') {
              return rhodopsinProgress >= 100 
                ? 'Rhodopsin Pigments Decayed' 
                : 'Rhodopsin Pigments Decaying';
            }
            return null;
          };
          
          const rhodopsinMessage = getRhodopsinMessage();
          
          return (
            <section key={targetId} id={targetId} className={`snap-section flex flex-col snap-start ${bgColor} relative`}>
              {/* Thumb Flow Loader - Top Position for Better Visibility */}
              {targetId === 'ergonomics' && isMobile && thumbFlowStage > 0 && thumbFlowStage <= 4 && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
                  <motion.div
                    className={`px-6 py-4 rounded-lg backdrop-blur-sm transition-all duration-300`}
                    style={{
                      backgroundColor: isEven 
                        ? `rgba(255, 255, 255, ${0.03 + (thumbFlowProgress / 100) * 0.15})` 
                        : `rgba(0, 0, 0, ${0.03 + (thumbFlowProgress / 100) * 0.15})`,
                    }}
                    initial={{ opacity: 0.3, scale: 0.9 }}
                    animate={{ 
                      opacity: 0.4 + (thumbFlowProgress / 100) * 0.6,
                      scale: 0.9 + (thumbFlowProgress / 100) * 0.1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col items-center">
                      <motion.div 
                        className={`text-sm mb-2`}
                        style={{
                          color: isEven 
                            ? `rgba(156, 163, 175, ${0.4 + (thumbFlowProgress / 100) * 0.6})` 
                            : `rgba(55, 65, 81, ${0.6 + (thumbFlowProgress / 100) * 0.4})`
                        }}
                        animate={{ 
                          opacity: [1, 0.6, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                                             >
                         {thumbFlowStage === 1 ? 'Thumb Flow Map Loading'
                          : thumbFlowStage === 2 ? 'Loading easy'
                          : thumbFlowStage === 3 ? 'Loading hard'
                          : thumbFlowStage === 4 ? 'Loading Painful'
                          : 'Thumb Flow Map Loading'}
                       </motion.div>
                      <div 
                        className={`w-32 h-2 rounded-full overflow-hidden`}
                        style={{
                          backgroundColor: isEven 
                            ? `rgba(17, 24, 39, ${0.5 + (thumbFlowProgress / 100) * 0.5})` 
                            : `rgba(229, 231, 235, ${0.7 + (thumbFlowProgress / 100) * 0.3})`
                        }}
                      >
                        <motion.div
                          className={`h-full rounded-full`}
                          style={{
                            backgroundColor: isEven 
                              ? `rgba(75, 85, 99, ${0.6 + (thumbFlowProgress / 100) * 0.4})` 
                              : `rgba(75, 85, 99, ${0.7 + (thumbFlowProgress / 100) * 0.3})`
                          }}
                          initial={{ width: '0%' }}
                          animate={{ width: `${Math.max(0, thumbFlowProgress)}%` }}
                          transition={{ duration: 0.1, ease: 'linear' }}
                        />
                      </div>
                      <motion.div 
                        className={`text-xs mt-1`}
                        style={{
                          color: isEven 
                            ? `rgba(156, 163, 175, ${0.4 + (thumbFlowProgress / 100) * 0.6})` 
                            : `rgba(55, 65, 81, ${0.6 + (thumbFlowProgress / 100) * 0.4})`
                        }}
                        animate={{ 
                          opacity: [1, 0.7, 1]
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {Math.round(Math.max(0, thumbFlowProgress))}% Complete
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              )}

              <div className={`flex-1 flex items-center justify-center min-h-0 relative z-10`}>
                <div className={`text-center max-w-2xl px-4 ${textColor}`}>
                {/* Hide title for Ergonomics on desktop since it's now on the left */}
                {!(item === 'Ergonomics' && !isMobile) && (
                <h2 className="text-3xl sm:text-4xl font-bold">
                      {item === 'Question' ? 
                        (returnedFrom404 ? 'Oh, so it does matter? 🙂' : 'Does UX matter for Bitcoin & Nostr?') : 
                       item === 'Ergonomics' && ergonomicsState === 'revealed' ? 'That second onewas annoying huh?' : 
                       item}
                </h2>
                )}
                {item === 'Question' && (
                  <>
                    {questionAnswer === null ? (
                      <div className="mt-6 flex flex-row gap-4 items-center justify-center">
                        <button
                          onClick={() => handleQuestionAnswer('yes')}
                          className="px-8 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300 min-w-[100px]"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => handleQuestionAnswer('no')}
                          className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300 min-w-[100px]"
                        >
                          No
                        </button>
                      </div>
                    ) : questionAnswer === 'yes' ? (
                  <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                        That's a lovely answer. I'm here for the people who answer yes and want to get a head start with the UX for their websites and applications rather than having to fix things retroactively. Though I'm more than happy to do that too.
                  </p>
                    ) : null}
                  </>
                )}
                {item === 'Research' && (
                  <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                    Deep interviews with target and non target archetypes. Day in the life and affinity mapping, and most simply, understanding the user before they even use your product so it's tuned to their habits, unconciouss interactions, interface knowledge, and expectations.
                  </p>
                )}
                {item === 'Testing' && (
                  <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                    UX testing is more than presenting a product to a random person and asking what they think, though there are some uses for guerilla testing, it all starts with a carefully crafted test to rule out known biases and simulate as real world situations as possible, with well written testing scripts.
                  </p>
                )}
                {item === 'Ergonomics' && (
                  <>
                    {isMobile ? (
                      // Mobile Layout - Original behavior
                      <>
                        {/* Always show paragraph when revealed */}
                        {ergonomicsState === 'revealed' && (
                  <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                            Utilise thumb flow, habituated interactions, and best practices to make sure that your app is performant and isn't causing fatigue due to poor, unvalidated interface choices.
                  </p>
                )}
                        
                        {/* Show button when not revealed, or when revealed on mobile */}
                        {(ergonomicsState !== 'revealed' || isMobile) && (
                          <div className="mt-4 flex justify-center relative">
                            <motion.button
                              onMouseEnter={handleErgonomicsHover}
                              onClick={handleErgonomicsClick}
                              className={`px-8 py-3 rounded-lg font-medium transition-colors duration-300 ${
                                isEven ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800'
                              }`}
                              animate={{
                                y: ergonomicsState === 'moved' ? -(typeof window !== 'undefined' ? window.innerHeight * 0.3 : 250) : 0
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                              }}
                              style={{
                                zIndex: ergonomicsState === 'moved' ? 60 : 'auto'
                              }}
                            >
                              {ergonomicsState === 'revealed' && isMobile
                                ? 'Mmm, Comfortable 😊'
                                : ergonomicsState === 'moved' 
                                  ? 'Ok, Now Tap Me'
                                  : 'Tap me'
                              }
                            </motion.button>
                          </div>
                        )}
                      </>
                    ) : (
                      // Desktop Layout - Side-by-side with phone mockup
                      <div className="flex items-center justify-center gap-12 mt-8 w-full max-w-6xl mx-auto">
                        <div className="flex-1 max-w-md">
                          <h2 className={`text-3xl sm:text-4xl font-bold mb-6 text-left ${textColor}`}>
                            Ergonomics
                          </h2>
                          {ergonomicsState === 'revealed' && (
                            <p className={`text-base lg:text-lg leading-relaxed text-left ${subTextColor}`}>
                              Utilise thumb flow, habituated interactions, and best practices to make sure that your app is performant and isn't causing fatigue due to poor, unvalidated interface choices.
                            </p>
                          )}
                          {ergonomicsState !== 'revealed' && (
                            <p className={`text-base lg:text-lg leading-relaxed text-left ${subTextColor}`}>
                              Try clicking the button in the phone to experience mobile thumb flow mapping.
                            </p>
                          )}
                          
                          {/* Desktop Thumb Flow Loader */}
                          {thumbFlowStage > 0 && thumbFlowStage <= 4 && (
                            <div className="mt-6">
                              <motion.div
                                className={`px-6 py-4 rounded-lg backdrop-blur-sm transition-all duration-300`}
                                style={{
                                  backgroundColor: isEven 
                                    ? `rgba(255, 255, 255, ${0.03 + (thumbFlowProgress / 100) * 0.15})` 
                                    : `rgba(0, 0, 0, ${0.03 + (thumbFlowProgress / 100) * 0.15})`,
                                }}
                                initial={{ opacity: 0.3, scale: 0.9 }}
                                animate={{ 
                                  opacity: 0.4 + (thumbFlowProgress / 100) * 0.6,
                                  scale: 0.9 + (thumbFlowProgress / 100) * 0.1,
                                }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="flex flex-col items-center">
                                  <motion.div 
                                    className={`text-sm mb-2`}
                                    style={{
                                      color: isEven 
                                        ? `rgba(156, 163, 175, ${0.4 + (thumbFlowProgress / 100) * 0.6})` 
                                        : `rgba(55, 65, 81, ${0.6 + (thumbFlowProgress / 100) * 0.4})`
                                    }}
                                    animate={{ 
                                      opacity: [1, 0.6, 1]
                                    }}
                                    transition={{ 
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                  >
                                    {thumbFlowStage === 1 ? 'Thumb Flow Map Loading'
                                     : thumbFlowStage === 2 ? 'Loading easy'
                                     : thumbFlowStage === 3 ? 'Loading hard'
                                     : thumbFlowStage === 4 ? 'Loading Painful'
                                     : 'Thumb Flow Map Loading'}
                                  </motion.div>
                                  <div 
                                    className={`w-32 h-2 rounded-full overflow-hidden`}
                                    style={{
                                      backgroundColor: isEven 
                                        ? `rgba(17, 24, 39, ${0.5 + (thumbFlowProgress / 100) * 0.5})` 
                                        : `rgba(229, 231, 235, ${0.7 + (thumbFlowProgress / 100) * 0.3})`
                                    }}
                                  >
                                    <motion.div
                                      className={`h-full rounded-full`}
                                      style={{
                                        backgroundColor: isEven 
                                          ? `rgba(75, 85, 99, ${0.6 + (thumbFlowProgress / 100) * 0.4})` 
                                          : `rgba(75, 85, 99, ${0.7 + (thumbFlowProgress / 100) * 0.3})`
                                      }}
                                      initial={{ width: '0%' }}
                                      animate={{ width: `${Math.max(0, thumbFlowProgress)}%` }}
                                      transition={{ duration: 0.1, ease: 'linear' }}
                                    />
                                  </div>
                                  <motion.div 
                                    className={`text-xs mt-1`}
                                    style={{
                                      color: isEven 
                                        ? `rgba(156, 163, 175, ${0.4 + (thumbFlowProgress / 100) * 0.6})` 
                                        : `rgba(55, 65, 81, ${0.6 + (thumbFlowProgress / 100) * 0.4})`
                                    }}
                                    animate={{ 
                                      opacity: [1, 0.7, 1]
                                    }}
                                    transition={{ 
                                      duration: 1.5,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                  >
                                    {Math.round(Math.max(0, thumbFlowProgress))}% Complete
                                  </motion.div>
                                </div>
                              </motion.div>
                            </div>
                          )}
                        </div>
                        
                        {/* Phone Mockup */}
                        <div className="relative">
                          {/* Phone Frame */}
                          <div className="relative w-64 h-[520px] bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                            {/* Screen */}
                            <div className="relative w-full h-full bg-white rounded-[2rem] overflow-hidden">
                              {/* Phone Content */}
                              <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
                                {/* Show paragraph when revealed */}
                                {ergonomicsState === 'revealed' && (
                                  <p className="text-sm text-gray-800 px-6 text-center mb-4 relative z-10">
                                    That second one was annoying huh?
                                  </p>
                                )}
                                
                                {/* Phone Button */}
                                <div className="relative z-10">
                                  <motion.button
                                    onMouseEnter={handleErgonomicsHover}
                                    onClick={handleErgonomicsClick}
                                    className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300 text-sm relative z-10"
                                    animate={{
                                      y: ergonomicsState === 'moved' ? -180 : 0
                                    }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 300,
                                      damping: 30
                                    }}
                                    style={{
                                      zIndex: ergonomicsState === 'moved' ? 60 : 10
                                    }}
                                  >
                                    {ergonomicsState === 'revealed'
                                      ? 'Mmm, Comfortable 😊'
                                      : ergonomicsState === 'moved' 
                                        ? 'Ok, Now Click Me'
                                        : 'Click me'
                                    }
                                  </motion.button>
                                </div>
                              </div>
                              
                              {/* Thumb Flow Overlays in Phone */}
                              {thumbFlowStage > 0 && (
                                <div className="absolute inset-0 pointer-events-none">
                                  {/* Green Zone - Easiest area (bottom right) */}
                                  <AnimatePresence>
                                    {thumbFlowStage >= 1 && (
                                      <motion.div
                                        className="absolute"
                                        style={{
                                          bottom: '10%',
                                          right: '20%',
                                          width: '45%',
                                          height: '35%',
                                          backgroundColor: 'rgba(34, 197, 94, 0.3)',
                                          borderRadius: '60% 40% 50% 70%',
                                          transform: 'rotate(-15deg)',
                                        }}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8 }}
                                      />
                                    )}
                                  </AnimatePresence>
                                  
                                  {/* Yellow Zone - Less easy (middle areas) */}
                                  <AnimatePresence>
                                    {thumbFlowStage >= 2 && (
                                      <motion.div
                                        className="absolute"
                                        style={{
                                          top: '40%',
                                          right: '15%',
                                          width: '55%',
                                          height: '40%',
                                          backgroundColor: 'rgba(234, 179, 8, 0.3)',
                                          borderRadius: '50% 60% 40% 70%',
                                          transform: 'rotate(-10deg)',
                                        }}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8 }}
                                      />
                                    )}
                                  </AnimatePresence>

                                  {/* Orange Zone - Uncomfortable (upper areas) */}
                                  <AnimatePresence>
                                    {thumbFlowStage >= 3 && (
                                      <motion.div
                                        className="absolute"
                                        style={{
                                          top: '15%',
                                          left: '10%',
                                          width: '60%',
                                          height: '35%',
                                          backgroundColor: 'rgba(249, 115, 22, 0.3)',
                                          borderRadius: '70% 50% 60% 40%',
                                          transform: 'rotate(10deg)',
                                        }}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8 }}
                                      />
                                    )}
                                  </AnimatePresence>

                                  {/* Red Zone - Hard (top corners and edges) */}
                                  <AnimatePresence>
                                    {thumbFlowStage >= 4 && (
                                      <>
                                        <motion.div
                                          className="absolute"
                                          style={{
                                            top: '5%',
                                            left: '5%',
                                            width: '35%',
                                            height: '25%',
                                            backgroundColor: 'rgba(239, 68, 68, 0.4)',
                                            borderRadius: '80% 60% 40% 70%',
                                            transform: 'rotate(25deg)',
                                          }}
                                          initial={{ opacity: 0, scale: 0.5 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ duration: 0.8 }}
                                        />
                                        <motion.div
                                          className="absolute"
                                          style={{
                                            top: '5%',
                                            right: '5%',
                                            width: '30%',
                                            height: '20%',
                                            backgroundColor: 'rgba(239, 68, 68, 0.4)',
                                            borderRadius: '60% 80% 70% 40%',
                                            transform: 'rotate(-25deg)',
                                          }}
                                          initial={{ opacity: 0, scale: 0.5 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ duration: 0.8, delay: 0.2 }}
                                        />
                                        <motion.div
                                          className="absolute"
                                          style={{
                                            top: '40%',
                                            left: '5%',
                                            width: '25%',
                                            height: '30%',
                                            backgroundColor: 'rgba(239, 68, 68, 0.3)',
                                            borderRadius: '40% 70% 80% 50%',
                                            transform: 'rotate(35deg)',
                                          }}
                                          initial={{ opacity: 0, scale: 0.5 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ duration: 0.8, delay: 0.4 }}
                                        />
                                      </>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {item === 'Prediction' && (
                  <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                    Use Baysian-like theory to more accurately estimate the real word effect of user interface changes, new features, and more. Start a database of insights and provenance of decision making that can work based on value to you and your users.
                  </p>
                )}
                </div>
              </div>

              {/* Thumb Flow Overlay - Mobile Only */}
              {targetId === 'ergonomics' && isMobile && thumbFlowStage > 0 && (
                <div className="absolute inset-0 pointer-events-none z-0">
                  {/* Green Zone - Easiest area (bottom right) */}
                  <AnimatePresence>
                    {thumbFlowStage >= 1 && (
                      <motion.div
                        className="absolute"
                        style={{
                          bottom: '10%',
                          right: '20%',
                          width: '45%',
                          height: '35%',
                          backgroundColor: 'rgba(34, 197, 94, 0.3)',
                          borderRadius: '60% 40% 50% 70%',
                          transform: 'rotate(-15deg)',
                        }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Yellow Zone - Less easy (middle areas) */}
                  <AnimatePresence>
                    {thumbFlowStage >= 2 && (
                      <motion.div
                        className="absolute"
                        style={{
                          top: '40%',
                          right: '15%',
                          width: '55%',
                          height: '40%',
                          backgroundColor: 'rgba(234, 179, 8, 0.3)',
                          borderRadius: '50% 60% 40% 70%',
                          transform: 'rotate(-10deg)',
                        }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Orange Zone - Uncomfortable (upper areas) */}
                  <AnimatePresence>
                    {thumbFlowStage >= 3 && (
                      <motion.div
                        className="absolute"
                        style={{
                          top: '15%',
                          left: '10%',
                          width: '60%',
                          height: '35%',
                          backgroundColor: 'rgba(249, 115, 22, 0.3)',
                          borderRadius: '70% 50% 60% 40%',
                          transform: 'rotate(10deg)',
                        }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Red Zone - Hard (top corners and edges) */}
                  <AnimatePresence>
                    {thumbFlowStage >= 4 && (
                      <>
                        <motion.div
                          className="absolute"
                          style={{
                            top: '5%',
                            left: '5%',
                            width: '35%',
                            height: '25%',
                            backgroundColor: 'rgba(239, 68, 68, 0.4)',
                            borderRadius: '80% 60% 40% 70%',
                            transform: 'rotate(25deg)',
                          }}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.8 }}
                        />
                        <motion.div
                          className="absolute"
                          style={{
                            top: '5%',
                            right: '5%',
                            width: '30%',
                            height: '20%',
                            backgroundColor: 'rgba(239, 68, 68, 0.4)',
                            borderRadius: '60% 80% 70% 40%',
                            transform: 'rotate(-25deg)',
                          }}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        />
                        <motion.div
                          className="absolute"
                          style={{
                            top: '40%',
                            left: '5%',
                            width: '25%',
                            height: '30%',
                            backgroundColor: 'rgba(239, 68, 68, 0.3)',
                            borderRadius: '40% 70% 80% 50%',
                            transform: 'rotate(35deg)',
                          }}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.8, delay: 0.4 }}
                        />
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
                            {/* Bottom Container - For consistent spacing across all sections */}
              <div className="pb-8 flex justify-center relative z-10">
                <div className="h-24 flex items-center">
                  {rhodopsinMessage && !dismissedLoaders.includes(targetId) ? (
                      <motion.button
                        onClick={() => setRhodopsinModalOpen(true)}
                      className={`px-6 py-4 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer`}
                      style={{
                        backgroundColor: isEven 
                          ? `rgba(255, 255, 255, ${0.03 + (rhodopsinProgress / 100) * 0.15})` 
                          : `rgba(0, 0, 0, ${0.03 + (rhodopsinProgress / 100) * 0.15})`,
                      }}
                      initial={{ opacity: 0.3, scale: 0.9 }}
                      animate={{ 
                        opacity: 0.4 + (rhodopsinProgress / 100) * 0.6,
                        scale: 0.9 + (rhodopsinProgress / 100) * 0.1,
                      }}
                      transition={{ duration: 0.3 }}
                      whileHover={{
                        backgroundColor: isEven 
                          ? `rgba(255, 255, 255, ${0.05 + (rhodopsinProgress / 100) * 0.2})` 
                          : `rgba(0, 0, 0, ${0.05 + (rhodopsinProgress / 100) * 0.2})`,
                        scale: (0.9 + (rhodopsinProgress / 100) * 0.1) * 1.05,
                      }}
                      >
                        <div className="flex flex-col items-center">
                          <motion.div 
                          className={`text-sm mb-2`}
                          style={{
                            color: isEven 
                              ? `rgba(156, 163, 175, ${0.4 + (rhodopsinProgress / 100) * 0.6})` 
                              : `rgba(55, 65, 81, ${0.6 + (rhodopsinProgress / 100) * 0.4})`
                          }}
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
                        <div 
                          className={`w-32 h-2 rounded-full overflow-hidden`}
                          style={{
                            backgroundColor: isEven 
                              ? `rgba(17, 24, 39, ${0.5 + (rhodopsinProgress / 100) * 0.5})` 
                              : `rgba(229, 231, 235, ${0.7 + (rhodopsinProgress / 100) * 0.3})`
                          }}
                        >
                            <motion.div
                            className={`h-full rounded-full`}
                            style={{
                              backgroundColor: isEven 
                                ? `rgba(75, 85, 99, ${0.6 + (rhodopsinProgress / 100) * 0.4})` 
                                : `rgba(75, 85, 99, ${0.7 + (rhodopsinProgress / 100) * 0.3})`
                            }}
                              initial={{ width: '0%' }}
                              animate={{ width: `${Math.max(0, rhodopsinProgress)}%` }}
                              transition={{ duration: 0.1, ease: 'linear' }}
                            />
                          </div>
                          <motion.div 
                          className={`text-xs mt-1`}
                          style={{
                            color: isEven 
                              ? `rgba(156, 163, 175, ${0.4 + (rhodopsinProgress / 100) * 0.6})` 
                              : `rgba(55, 65, 81, ${0.6 + (rhodopsinProgress / 100) * 0.4})`
                          }}
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
                        </div>
                      </motion.button>
                  ) : (
                    // Empty space to maintain consistent layout across all sections
                    <div className="h-full w-full"></div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

export default App;
