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
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
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

  return (
    <div className="bg-white font-orbitron">
      {/* --- Sticky Header --- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="relative flex h-16 items-center justify-between px-4 sm:h-24 sm:block sm:px-0">
          <a href="#app-anatomy" onClick={(e) => handleLinkClick(e, 'app-anatomy')}>
            <motion.div
              className="text-lg font-bold text-black sm:absolute sm:top-8 sm:left-8 sm:text-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 5 ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              PROUX
            </motion.div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex sm:absolute sm:top-8 sm:right-8 items-center space-x-8 text-lg font-medium text-black">
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
                  className="cursor-pointer hover:text-gray-600 transition-colors"
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
            <motion.span className="mb-1 h-0.5 w-6 bg-black" animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 6 : 0 }} />
            <motion.span className="mb-1 h-0.5 w-6 bg-black" animate={{ opacity: mobileMenuOpen ? 0 : 1 }} />
            <motion.span className="h-0.5 w-6 bg-black" animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -6 : 0 }} />
          </motion.button>
        </div>
      </header>
      
      {/* --- Mobile Menu Overlay --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="sm:hidden fixed inset-0 bg-white z-40 flex flex-col items-center justify-center"
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
                  className="text-2xl font-medium text-black mb-8 cursor-pointer hover:text-gray-600 transition-colors"
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
        {/* --- App Anatomy Section (First Fold) --- */}
        <section id="app-anatomy" className="h-dvh sm:h-screen flex items-center justify-center overflow-hidden relative px-4 sm:px-0">
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
            className="absolute inset-0 w-full h-full flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 z-0"
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
                    className="w-full h-full object-contain scale-75"
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

          {/* --- Carousel Controls --- */}
          <motion.div
            className="absolute inset-x-0 bottom-8 z-10 flex justify-center space-x-4"
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
        {navItems.slice(1).map((item) => {
          const targetId = item.toLowerCase().replace(/\s+/g, '-');
          return (
            <section key={targetId} id={targetId} className="h-dvh sm:h-screen flex items-center justify-center">
              <div className="text-center max-w-2xl px-4 -translate-y-8 sm:-translate-y-12">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  {item === 'Hey' ? 'Does UX matter in Bitcoin and Nostr?' : item}
                </h2>
                {item === 'Hey' && (
                  <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-700">
                    I'm here for the people who answer yes and want to get a head start with the UX for their websites and applications rather than having to fix things retroactively. Though I'm more than happy to do that too.
                  </p>
                )}
                {item === 'Research' && (
                  <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-700">
                    Deep interviews with target and non target archetypes. Day in the life and affinity mapping, and most simply, understanding the user before they even use your product so it's tuned to their habits, interface knowledge, and expectations.
                  </p>
                )}
                {item === 'Testing' && (
                  <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-700">
                    Testing isn't presenting a random product to a random person and asking what they think, though there are some uses for guerilla testing, it all starts with a carefully crafted test to rule out known biases and simulate as real world situations as possible, with well written testing scripts.
                  </p>
                )}
                {item === 'Ergonomics' && (
                  <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-700">
                    Utilise habituated interactions, thumb flow, and best practices to make sure that your app is performant and isn't causing fatigue due to bad, unvalidated interface choices.
                  </p>
                )}
                {item === 'Predict Efficacy' && (
                  <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-700">
                    Use Baysian like theory to estimate the efficacy of user interface changes, new features, and more, with a better accuracy between concept to real world results. Start a database of insights and provenance of decision making that can work based on value to you and your users.
                  </p>
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
