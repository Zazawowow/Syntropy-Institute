import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
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
    // Skip animation if user has already visited
    if (typeof window !== 'undefined' && localStorage.getItem('hasVisited')) {
      return 11; // Jump to the final step
    }
    return 0; // Start animation for first-time visitors
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sequence timings (0.5x speed = half the original durations)
  const durations = [
    1000, // 0: BITCOIN
    1000, // 1: NOSTR
    2000, // 2: PROTOCOLS + USER EXPERIENCE typed
    1000, // 3: USER EXPERIENCE -> UX
    1500, // 4: -> PROUX transition
    1000, // 5: -> PROUX fades to top left logo
    500,  // 6: Research appears
    500,  // 7: Testing appears
    500,  // 8: Ergonomics appears
    500,  // 9: Product appears
  ];

  const navItems = ['Research', 'Testing', 'Ergonomics', 'Product'];

  useEffect(() => {
    // If it's the first visit, run the animation and mark as visited
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

  return (
    <div className="bg-white h-screen flex items-center justify-center overflow-hidden font-orbitron relative px-4 sm:px-0">
      {/* Top left logo - appears in step 5 */}
      <motion.div
        id="proux-logo"
        className="absolute top-4 left-4 sm:top-8 sm:left-8 text-lg sm:text-2xl font-bold text-black z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: step >= 5 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        PROUX
      </motion.div>

      {/* Desktop Navigation - horizontal layout */}
      <motion.nav
        className="hidden sm:flex absolute top-4 right-4 sm:top-8 sm:right-8 items-center space-x-8 text-lg font-medium text-black z-20"
      >
        {navItems.map((item, index) => {
          const appearStep = 6 + index;
          return (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: step >= appearStep ? 1 : 0,
                y: step >= appearStep ? 0 : -20
              }}
              transition={{ duration: 0.3 }}
              className="cursor-pointer hover:text-gray-600 transition-colors"
            >
              {item}
            </motion.div>
          );
        })}
      </motion.nav>

      {/* Mobile Hamburger Menu Button */}
      <motion.button
        className="sm:hidden absolute top-4 right-4 z-30 w-8 h-8 flex flex-col justify-center items-center"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        initial={{ opacity: 0 }}
        animate={{ opacity: step >= 6 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.span
          className="w-6 h-0.5 bg-black mb-1"
          animate={{
            rotate: mobileMenuOpen ? 45 : 0,
            y: mobileMenuOpen ? 6 : 0,
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="w-6 h-0.5 bg-black mb-1"
          animate={{
            opacity: mobileMenuOpen ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="w-6 h-0.5 bg-black"
          animate={{
            rotate: mobileMenuOpen ? -45 : 0,
            y: mobileMenuOpen ? -6 : 0,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="sm:hidden fixed inset-0 bg-white z-25 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item}
                className="text-2xl font-medium text-black mb-8 cursor-pointer hover:text-gray-600 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen image - appears at the end */}
      <motion.div
        className="absolute inset-0 w-full h-full flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: step >= 6 ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative w-full h-full">
          <img
            src="/screen-1.png"
            alt="Proux application screenshot"
            className="w-full h-full object-contain scale-75"
          />
        </div>
      </motion.div>

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

          {/* Step 2: Show PROTOCOLS and USER EXPERIENCE with typing animation */}
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

          {/* Step 3: Reduce to UX */}
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

          {/* Step 4: PROUX center */}
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

          {/* Step 5: PROUX fades out as top left logo appears */}
          {step === 5 && (
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
  );
}

export default App;
