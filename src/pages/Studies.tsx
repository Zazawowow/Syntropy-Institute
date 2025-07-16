import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StudiesProps {
  isMobile: boolean;
}

const Studies: React.FC<StudiesProps> = ({ isMobile }) => {
  const [unconsciousBehaviorStage, setUnconsciousBehaviorStage] = useState(0);
  const [researchCompleting, setResearchCompleting] = useState(false);
  const [researchTextVisible, setResearchTextVisible] = useState(false);
  const [researchProgress, setResearchProgress] = useState(0);
  const [researchPatternModalOpen, setResearchPatternModalOpen] = useState(false);
  const [selectedResearchPattern, setSelectedResearchPattern] = useState<'f-pattern' | 'scroll' | 'touch' | null>(null);

  const researchPatternContent: { [key: string]: { title: string; content: { subheading: string; text: string; hasLink?: boolean; linkText?: string; linkUrl?: string }[] } } = {
    'f-pattern': {
      title: 'F-Pattern Scanning',
      content: [
        {
          subheading: 'Eye Movement Research',
          text: 'Users typically scan web content in an F-shaped pattern: two horizontal stripes followed by a vertical stripe on the left side.'
        },
        {
          subheading: 'Design Implications',
          text: 'Place important information in these high-attention areas. The most important content should be at the top, with secondary info in the middle horizontal stripe.'
        },
        {
          subheading: 'Jakob Nielsen Study',
          text: 'Originally discovered through eyetracking studies of 232 users looking at thousands of web pages.',
          hasLink: true,
          linkText: 'Jakob Nielsen Study',
          linkUrl: 'https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/'
        }
      ]
    },
    'scroll': {
      title: 'Habitual Scrolling',
      content: [
        {
          subheading: 'Automatic Behavior',
          text: 'Users scroll unconsciously, often without registering content. This behavior is deeply ingrained from years of mobile and web usage.'
        },
        {
          subheading: 'Content Strategy',
          text: 'Design for the scroll. Break content into digestible chunks and use visual cues to encourage engagement at key points.'
        },
        {
          subheading: 'Attention Spans',
          text: 'Users spend 80% of their time looking at information above the fold, but will scroll if initially engaged.'
        }
      ]
    },
    'touch': {
      title: 'Touch & Click Patterns',
      content: [
        {
          subheading: 'Muscle Memory',
          text: 'Users develop muscle memory for common interactions. They tap or click in predictable areas without conscious thought.'
        },
        {
          subheading: 'Heat Mapping',
          text: 'Interaction heatmaps reveal consistent patterns across users, showing preferred zones based on device type, hand position, and screen size.'
        },
        {
          subheading: 'Ergonomic Design',
          text: 'Leverage these patterns to reduce cognitive load and improve user experience through intuitive interface placement for both mobile and desktop.'
        }
      ]
    }
  };

  // Unconscious behavior patterns animation
  useEffect(() => {
    // Reset all states when component mounts
    setUnconsciousBehaviorStage(0);
    setResearchCompleting(false);
    setResearchTextVisible(false);
    setResearchProgress(0);
    
    const timers: NodeJS.Timeout[] = [];
    
    // Start loader immediately
    timers.push(setTimeout(() => setResearchCompleting(true), 100));
    
    // Stage 1: Show F-pattern eye tracking
    timers.push(setTimeout(() => setUnconsciousBehaviorStage(1), 500));
    
    // Stage 1 fade out and Stage 2 fade in: Show scroll behavior
    timers.push(setTimeout(() => setUnconsciousBehaviorStage(2), 3500));
    
    // Stage 2 fade out and Stage 3 fade in: Show touch patterns
    timers.push(setTimeout(() => setUnconsciousBehaviorStage(3), 6500));
    
    // Stage 3 fade out
    timers.push(setTimeout(() => setUnconsciousBehaviorStage(4), 9000));
    
    // Hide loader and show text after all patterns complete
    timers.push(setTimeout(() => {
      setUnconsciousBehaviorStage(0); // Reset stage
      setResearchCompleting(false); // Hide loader
      setResearchTextVisible(true); // Show final text
    }, 10500));
    
    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  // Research progress animation
  useEffect(() => {
    if (researchCompleting) {
      setResearchProgress(0);
      const interval = setInterval(() => {
        setResearchProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + (100 / (10 * 10)); // 10 seconds, 10 updates per second
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [researchCompleting]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Header with back navigation */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 sm:p-8">
        <div className="flex items-center justify-between">
          <a href="/" className="text-lg sm:text-2xl font-bold text-white hover:text-gray-300 transition-colors">
            ← PROUX
          </a>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-screen relative z-10 overflow-hidden pt-16 sm:pt-12">
        <div className="text-center max-w-2xl px-10 sm:px-4 text-white">
          {!researchTextVisible && (
            <h2 className="text-3xl sm:text-4xl font-bold">Studies</h2>
          )}
          
          {researchTextVisible && (
            <>
              <motion.h2 
                className="text-3xl sm:text-4xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
              >
                Studies
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-300">
                  Deep interviews with target and non target archetypes. Day in the life and affinity mapping, and most simply, understanding the user before they even use your product so it's tuned to their habits, unconciouss interactions, and expectations.
                </p>
                
                {/* Research Pattern Badges */}
                <motion.div 
                  className="flex flex-wrap justify-center gap-3 mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <button
                    onClick={() => {
                      setSelectedResearchPattern('f-pattern');
                      setResearchPatternModalOpen(true);
                    }}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  >
                    F-Pattern Scanning
                  </button>
                  <button
                    onClick={() => {
                      setSelectedResearchPattern('scroll');
                      setResearchPatternModalOpen(true);
                    }}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  >
                    Habitual Scrolling
                  </button>
                  <button
                    onClick={() => {
                      setSelectedResearchPattern('touch');
                      setResearchPatternModalOpen(true);
                    }}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  >
                    {isMobile ? 'Touch' : 'Click'} Patterns
                  </button>
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Research Progress Loader - Center Overlay */}
      {researchCompleting && (
        <div className={`absolute z-10 pointer-events-none ${
          isMobile 
            ? 'inset-x-0 flex items-center justify-center' 
            : 'inset-0 flex items-center justify-center'
        }`} style={isMobile ? { top: '100px', height: 'calc(50% - 50px)' } : {}}>
          <motion.div
            className="px-6 py-4 rounded-lg backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0,
            }}
          >
            <div className="flex flex-col items-center">
              {/* Dynamic Pattern Label */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={unconsciousBehaviorStage}
                  className="text-white text-sm font-medium mb-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {unconsciousBehaviorStage === 1 && "Researching F-Pattern Scanning"}
                  {unconsciousBehaviorStage === 2 && "Researching Habitual Scrolling"}
                  {unconsciousBehaviorStage === 3 && `Researching ${isMobile ? 'Touch' : 'Click'} Patterns`}
                  {unconsciousBehaviorStage === 4 && "Research Complete"}
                  {unconsciousBehaviorStage === 0 && "Research in progress..."}
                </motion.div>
              </AnimatePresence>
              
              <motion.div 
                className="text-sm mb-2 text-gray-400"
                animate={{ 
                  opacity: [1, 0.6, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Desktop Research
              </motion.div>
              <div className="w-32 h-2 rounded-full overflow-hidden bg-gray-700">
                <motion.div
                  className="h-full rounded-full bg-gray-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.max(0, researchProgress)}%` }}
                  transition={{ duration: 0.1, ease: 'linear' }}
                />
              </div>
              <motion.div 
                className="text-xs mt-1 text-gray-400"
                animate={{ 
                  opacity: [1, 0.7, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {Math.round(Math.max(0, researchProgress))}% Complete
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Unconscious Behavior Patterns Visualization */}
      {unconsciousBehaviorStage > 0 && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* F-Pattern Eye Tracking */}
          <AnimatePresence>
            {unconsciousBehaviorStage === 1 && (
              <>
                {/* F-Pattern horizontal lines */}
                <motion.div
                  className="absolute top-16 left-8 right-8 sm:left-16 sm:right-16 md:left-24 md:right-24 lg:left-32 lg:right-32 h-1"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 60%, rgba(255, 255, 255, 0) 100%)',
                    borderRadius: '2px',
                    transformOrigin: 'left'
                  }}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ duration: 1 }}
                />
                <motion.div
                  className="absolute top-32 left-8 right-16 sm:left-16 sm:right-24 md:left-24 md:right-32 lg:left-32 lg:right-40 h-1"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 100%)',
                    borderRadius: '2px',
                    transformOrigin: 'left'
                  }}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                {/* F-Pattern vertical line */}
                <motion.div
                  className="absolute top-16 left-8 sm:left-16 md:left-24 lg:left-32 w-1 h-40"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.3) 80%, rgba(255, 255, 255, 0) 100%)',
                    borderRadius: '2px',
                    transformOrigin: 'top'
                  }}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0 }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </>
            )}
          </AnimatePresence>

          {/* Scroll Behavior */}
          <AnimatePresence>
            {unconsciousBehaviorStage === 2 && (
              <>
                {/* Scroll indicator track */}
                <motion.div
                  className="absolute right-4 sm:right-12 md:right-20 lg:right-28 top-20 bottom-20 w-1 bg-white/20 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
                {/* Animated scroll thumb */}
                <motion.div
                  className="absolute right-3 sm:right-11 md:right-19 lg:right-27 w-3 h-8 bg-white/60 rounded-full"
                  style={{ top: '20%' }}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    y: [0, 100, 200, 100, 0]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    opacity: { duration: 0.6 },
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              </>
            )}
          </AnimatePresence>

          {/* Touch Patterns */}
          <AnimatePresence>
            {unconsciousBehaviorStage === 3 && (
              <>
                {/* Primary touch zone */}
                <motion.div
                  className={`absolute flex items-start space-x-3 ${
                    isMobile 
                      ? 'left-1/2 transform -translate-x-1/2' 
                      : 'right-8 sm:right-16 md:right-24 lg:right-32'
                  }`}
                  style={{ 
                    bottom: isMobile 
                      ? 'calc(12rem + 20px)' 
                      : 'calc(32rem - 100px)' 
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: [1, 1.02, 1],
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ 
                    opacity: { duration: 0.6 },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  {/* Fingerprint visualization */}
                  <motion.div
                    className="w-12 h-12 flex-shrink-0"
                    animate={{ 
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      className="opacity-80"
                    >
                      <path d="M24 6 C16 6, 10 12, 10 20 C10 28, 16 34, 24 34 C32 34, 38 28, 38 20 C38 12, 32 6, 24 6" 
                            stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" fill="none"/>
                      <path d="M24 8 C17 8, 12 13, 12 20 C12 27, 17 32, 24 32 C31 32, 36 27, 36 20 C36 13, 31 8, 24 8" 
                            stroke="rgba(255,255,255,0.6)" strokeWidth="0.7" fill="none"/>
                      <path d="M24 10 C18 10, 14 14, 14 20 C14 26, 18 30, 24 30 C30 30, 34 26, 34 20 C34 14, 30 10, 24 10" 
                            stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" fill="none"/>
                      <circle cx="24" cy="20" r="2" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" fill="none"/>
                      <circle cx="24" cy="20" r="1" fill="rgba(255,255,255,0.4)"/>
                    </svg>
                  </motion.div>
                  
                  <motion.div
                    className="rounded-lg backdrop-blur-sm border border-white/20 px-3 py-2 max-w-[140px]"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <motion.p 
                      className="font-medium text-white text-xs leading-tight"
                      animate={{ opacity: [1, 0.7, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {isMobile ? 'Primary Touch Zone' : 'Primary Click Patterns'}
                    </motion.p>
                    <p className="text-xs text-white/70 mt-1">{isMobile ? 'High frequency taps' : 'Common click areas'}</p>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Research Pattern Modal */}
      <AnimatePresence>
        {researchPatternModalOpen && selectedResearchPattern && researchPatternContent[selectedResearchPattern] && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setResearchPatternModalOpen(false);
              setSelectedResearchPattern(null);
            }}
          >
            <motion.div
              className="rounded-lg p-6 max-w-md w-full mx-4 relative bg-black text-white border border-white/20"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setResearchPatternModalOpen(false);
                  setSelectedResearchPattern(null);
                }}
                className="absolute top-4 right-4 text-xl transition-colors text-gray-400 hover:text-gray-200"
              >
                ×
              </button>
              
              <h2 className="text-2xl font-bold mb-6 text-white">
                {researchPatternContent[selectedResearchPattern].title}
              </h2>
              
              <div className="space-y-4">
                {researchPatternContent[selectedResearchPattern].content.map((item, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-bold mb-2 text-white">
                      {item.subheading}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-300">
                      {item.hasLink && item.linkText && item.linkUrl ? (
                        <>
                          {item.text.split(item.linkText)[0]}
                          <a 
                            href={item.linkUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="underline hover:no-underline transition-all text-blue-400 hover:text-blue-300"
                          >
                            {item.linkText}
                          </a>
                          {item.text.split(item.linkText)[1]}
                        </>
                      ) : (
                        item.text
                      )}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <button 
                  onClick={() => {
                    setResearchPatternModalOpen(false);
                    setSelectedResearchPattern(null);
                  }}
                  className="w-full px-4 py-2 rounded-lg font-medium transition-colors bg-white text-black hover:bg-gray-200"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Studies; 