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

// const letterExit = {
//   opacity: 0,
//   y: -20,
//   transition: {
//     ease: 'easeIn' as const,
//     duration: 0.3,
//   },
// };

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
  const [pathwayDiagramClicked, setPathwayDiagramClicked] = useState(false);
  const [modalOpenedBy, setModalOpenedBy] = useState<'sad-face' | 'comfortable-button' | null>(null);
  const [isLeftHanded, setIsLeftHanded] = useState(false);
  const [biasModalOpen, setBiasModalOpen] = useState(false);
  const [breakdownModalIdentifier, setBreakdownModalIdentifier] = useState<number | null>(null);
  const [appSelectorModalOpen, setAppSelectorModalOpen] = useState(false);
  const [navLinePosition, setNavLinePosition] = useState({ x: 0, width: 0 });
  const [dialecticsState, setDialecticsState] = useState<'conversation' | 'content'>('conversation');
  const [conversationProgress, setConversationProgress] = useState(0);
  const [historicalMistakesModalOpen, setHistoricalMistakesModalOpen] = useState(false);
  const [mobileMenuFixed, setMobileMenuFixed] = useState(false);
  const [historicalMistakesButtonClicked, setHistoricalMistakesButtonClicked] = useState(false);
  const [menuMoving, setMenuMoving] = useState(false);
  const [showHistoricalMistakesButton, setShowHistoricalMistakesButton] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState<{ visible: boolean; side: 'left' | 'right' }>({ visible: false, side: 'left' });
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ email: '', subject: '', message: '' });
  const [unconsciousBehaviorStage, setUnconsciousBehaviorStage] = useState(0);
  const [researchCompleting, setResearchCompleting] = useState(false);
  const [researchTextVisible, setResearchTextVisible] = useState(false);
  const [researchProgress, setResearchProgress] = useState(0);
  const [researchPatternModalOpen, setResearchPatternModalOpen] = useState(false);
  const [selectedResearchPattern, setSelectedResearchPattern] = useState<'f-pattern' | 'scroll' | 'touch' | null>(null);
  const [eyeTrackingStage, setEyeTrackingStage] = useState(0);
  const [eyeTrackingProgress, setEyeTrackingProgress] = useState(0);
  const [eyeTrackingActive, setEyeTrackingActive] = useState(false);
  const [heatmapIntensity, setHeatmapIntensity] = useState(0);
  const [eyeTrackingTextVisible, setEyeTrackingTextVisible] = useState(false);
  
  const slides = [
    { type: 'image', src: '/screen-1.png', alt: 'Proux application screenshot 1' },
    { type: 'quote', text: 'Think about ergonomics when designing apps. It\'s a simple step that will make your product more delightful.' },
    { type: 'image', src: '/screen-2.png', alt: 'Proux application screenshot 2' },
    { type: 'quote', text: 'Just like the doorway effect, people forget information as they move from screen to screen. Don\'t make them think' },
    { type: 'image', src: '/screen-3.png', alt: 'Proux application screenshot 3' },
    { type: 'quote', text: 'Utilise habituated patterns, basically the user\'s unconscious behavior, to make the app a breeze to use' },
  ];

  const conversationMessages = [
    { sender: 'Jason (Product Manager)', message: "I think the layout of our app's buttons is not good", side: 'left' },
    { sender: 'Chad (CEO)', message: 'They are exactly the same as the popular apps', side: 'right' },
    { sender: 'Jason (Product Manager)', message: 'Yeah, but those apps have content, ours is new', side: 'left' },
    { sender: 'Chad (CEO)', message: "Ahh, you're right, how can we handle that?", side: 'right' },
    { sender: 'Jason (Product Manager)', message: 'Maybe try this guy https://protocolux.com', side: 'left' },
  ];
  const [[page, direction], setPage] = useState([0, 0]);

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

  const breakdownModalContent: { [key: number]: { title: string; content: { subheading: string; text: string; hasLink?: boolean; linkText?: string; linkUrl?: string }[] } } = {
    0: {
      title: 'Whitenoise Breakdown',
      content: [
        {
          subheading: 'Ergonomics',
          text: "Chose the most uncomfortable areas for primary interactions during an onboarding phase, where people are adding many contacts and chats."
        },
        {
          subheading: 'Platform Guidelines',
          text: "Ignored Apple's ubiquitous use of a tab bar to support navigation.",
          hasLink: true,
          linkText: "tab bar",
          linkUrl: "https://developer.apple.com/design/human-interface-guidelines/tab-bars"
        },
        // {
        //   subheading: 'Historical Mistakes',
        //   text: "A lot of apps have made historical mistakes that take a while to be corrected, any new app is a good time to fix those, such as putting any actions at the top of a screen since screens moved past 3.5\""
        // },
        {
          subheading: 'Wrong UI for Onboarding',
          text: "Uses established patterns that work well for apps with content (chats and contacts) but not for the onboarding scenario."
        }
      ]
    },
    // Placeholders for other screens
          2: {
        title: 'Recognition not Recall',
        content: [
          { subheading: 'Balance Status', text: 'Users have to remember their balance as they transition to payment, it\'s fairly established to give a balance indication and reduction calculation.' },
          { subheading: 'Prefilled Amounts', text: 'As an extra convenience, add common amounts to execute and a "max" button, which is often a user scenario' }
        ]
      },
    4: {
      title: 'Strike Breakdown',
      content: [
        {
          subheading: 'Desktop Patterns',
          text: 'The top right account icon is really a desktop pattern, or mobile web pattern where a tab bar is more problematic.'
        },
        {
          subheading: 'Tab Bar',
          text: 'There is plenty of space for account (established pattern), the scanner (though tab bar actions are off-guideline). Activity is fine as it\'s a less used action.'
        }
      ]
    }
  };

  const slideIndex = wrap(0, slides.length, page);

  const showAnnotations = step >= 6 && slides[slideIndex].type === 'image';

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const navigateToApp = (appName: string) => {
    let targetIndex = 0;
    switch (appName) {
      case 'Whitenoise':
        targetIndex = 0;
        break;
      case 'Primal':
        targetIndex = 2;
        break;
      case 'Strike':
        targetIndex = 4;
        break;
    }
    const newDirection = targetIndex > page ? 1 : -1;
    setPage([targetIndex, newDirection]);
    setAppSelectorModalOpen(false);
  };

  const getCurrentAppIcon = () => {
    const apps = [
      { name: 'Whitenoise', icon: 'whitenoise-icon.png' },
      { name: 'Primal', icon: 'primal-icon.png' },
      { name: 'Strike', icon: 'strike-icon.png' }
    ];
    
    // Whitenoise: slides 0 and 1 (image and quote)
    if (slideIndex === 0 || slideIndex === 1) return apps[0];
    // Primal: slides 2 and 3 (image and quote)
    if (slideIndex === 2 || slideIndex === 3) return apps[1];
    // Strike: slides 4 and 5 (image and quote)
    if (slideIndex === 4 || slideIndex === 5) return apps[2];
    return apps[0]; // default to Whitenoise
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

  const navItems = ['Anatomy', 'Question', 'Dialectics', 'Research', 'Ergonomics', 'Testing', 'Prediction'];

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
    
    if (mobileMenuOpen) {
      // On mobile menu, close menu first, then scroll after animation
      setMobileMenuOpen(false);
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ 
          behavior: 'auto',
          block: 'start'
        });
      }, 300); // Wait for menu close animation
    } else {
      // Desktop or mobile menu already closed
      document.getElementById(targetId)?.scrollIntoView({ 
        behavior: isMobile ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  };

  // Determine if current section should have inverted nav colors
  const shouldInvertNav = () => {
    const blackSections = ['question', 'research', 'testing']; // These are the black sections
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

  // Helper function to close modal and reset tracking states
  const handleModalClose = () => {
    setModalOpen(false);
    setPathwayDiagramClicked(false);
    setModalOpenedBy(null);
  };

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create mailto link (fallback if no backend)
    const subject = encodeURIComponent(contactForm.subject || 'Contact from PROUX');
    const body = encodeURIComponent(`Email: ${contactForm.email}\n\nMessage:\n${contactForm.message}`);
    const mailtoLink = `mailto:zaza@zazawowow.co.uk?subject=${subject}&body=${body}`;
    
    // Open mailto link
    window.location.href = mailtoLink;
    
    // Reset form and close modal
    setContactForm({ email: '', subject: '', message: '' });
    setContactModalOpen(false);
  };

  // Helper function to get thumb flow zone styles based on handedness
  const getThumbFlowZoneStyle = (zone: 'green' | 'yellow' | 'orange' | 'red1' | 'red2' | 'red3') => {
    const baseStyles = {
      green: {
        right: { bottom: '10%', right: '20%', width: '45%', height: '35%', transform: 'rotate(-15deg)' },
        left: { bottom: '10%', left: '20%', width: '45%', height: '35%', transform: 'rotate(15deg)' }
      },
      yellow: {
        right: { top: '40%', right: '15%', width: '55%', height: '40%', transform: 'rotate(-10deg)' },
        left: { top: '40%', left: '15%', width: '55%', height: '40%', transform: 'rotate(10deg)' }
      },
      orange: {
        right: { top: '15%', left: '10%', width: '60%', height: '35%', transform: 'rotate(10deg)' },
        left: { top: '15%', right: '10%', width: '60%', height: '35%', transform: 'rotate(-10deg)' }
      },
      red1: {
        right: { top: '5%', left: '5%', width: '35%', height: '25%', transform: 'rotate(25deg)' },
        left: { top: '5%', right: '5%', width: '35%', height: '25%', transform: 'rotate(-25deg)' }
      },
      red2: {
        right: { top: '5%', right: '5%', width: '30%', height: '20%', transform: 'rotate(-25deg)' },
        left: { top: '5%', left: '5%', width: '30%', height: '20%', transform: 'rotate(25deg)' }
      },
      red3: {
        right: { top: '40%', left: '5%', width: '25%', height: '30%', transform: 'rotate(35deg)' },
        left: { top: '40%', right: '5%', width: '25%', height: '30%', transform: 'rotate(-35deg)' }
      }
    };
    
    return baseStyles[zone][isLeftHanded ? 'left' : 'right'];
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
      const sections = ['anatomy', 'question', 'dialectics', 'research', 'ergonomics', 'testing', 'prediction'];
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
              const blackSections = ['question', 'research', 'testing'];
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

    // Small delay to ensure DOM is ready
    const timer = setTimeout(updateNavLinePosition, 50);
    
    // Also update on resize
    window.addEventListener('resize', updateNavLinePosition);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateNavLinePosition);
    };
  }, [currentSection]);

  // Rhodopsin progress animation
  useEffect(() => {
    if (currentSection === 'question') {
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

  // Footnote timing for third quote
  useEffect(() => {
    if (step >= 6 && slideIndex === 5) {
      // Reset states when entering third quote
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

  // Conversation animation for Dialectics section
  useEffect(() => {
    if (currentSection === 'dialectics' && dialecticsState === 'conversation') {
      setConversationProgress(0);
      setTypingIndicator({ visible: false, side: 'left' });
      
      const animateConversation = () => {
        // First message appears immediately after 1 second
        setTimeout(() => {
          setConversationProgress(1);
        }, 1000);
        
        // Subsequent messages with typing indicators
        for (let i = 1; i < conversationMessages.length; i++) {
          const messageTime = 1000 + (i * 2000); // 1000, 3000, 5000, 7000
          const typingTime = messageTime - 1000; // 1000 before each message
          
          // Show typing indicator
          setTimeout(() => {
            setTypingIndicator({ 
              visible: true, 
              side: conversationMessages[i].side as 'left' | 'right' 
            });
          }, typingTime);
          
          // Show message and hide typing
          setTimeout(() => {
            setTypingIndicator({ visible: false, side: 'left' });
            setConversationProgress(i + 1);
          }, messageTime);
        }
      };
      
      animateConversation();
    }
  }, [currentSection, dialecticsState]);

  // Reset dialectics state when leaving section
  useEffect(() => {
    if (currentSection !== 'dialectics') {
      setDialecticsState('conversation');
      setConversationProgress(0);
    }
  }, [currentSection]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (currentSection === 'dialectics' && conversationProgress > 0) {
      const messageContainer = document.querySelector('.conversation-messages');
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    }
  }, [conversationProgress, currentSection]);

  // Unconscious behavior patterns animation for Research section
  useEffect(() => {
    if (currentSection === 'research') {
      // Reset all states when entering research section
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
    } else {
      setUnconsciousBehaviorStage(0);
      setResearchCompleting(false);
      setResearchTextVisible(false);
      setResearchProgress(0);
    }
  }, [currentSection]);

  // Research progress animation
  useEffect(() => {
    if (currentSection === 'research' && researchCompleting) {
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
  }, [currentSection, researchCompleting]);

  // Eye tracking animation for Testing section
  useEffect(() => {
    if (currentSection === 'testing') {
      // Reset all states when entering testing section
      setEyeTrackingStage(0);
      setEyeTrackingActive(false);
      setEyeTrackingTextVisible(false);
      setEyeTrackingProgress(0);
      setHeatmapIntensity(0);
      
      const timers: NodeJS.Timeout[] = [];
      
      // Start eye tracking loader immediately
      timers.push(setTimeout(() => setEyeTrackingActive(true), 100));
      
      // Stage 1: First user session (F-pattern focus)
      timers.push(setTimeout(() => setEyeTrackingStage(1), 500));
      
      // Stage 2: Second user session (different pattern)
      timers.push(setTimeout(() => setEyeTrackingStage(2), 4000));
      
      // Stage 3: Third user session (building heatmap)
      timers.push(setTimeout(() => setEyeTrackingStage(3), 7500));
      
      // Stage 4: Complete heatmap revelation
      timers.push(setTimeout(() => setEyeTrackingStage(4), 11000));
      
      // Hide loader and show text after all sessions complete
      timers.push(setTimeout(() => {
        setEyeTrackingStage(0); // Reset stage
        setEyeTrackingActive(false); // Hide loader
        setEyeTrackingTextVisible(true); // Show final text
      }, 13000));
      
      return () => {
        timers.forEach(clearTimeout);
      };
    } else {
      setEyeTrackingStage(0);
      setEyeTrackingActive(false);
      setEyeTrackingTextVisible(false);
      setEyeTrackingProgress(0);
      setHeatmapIntensity(0);
    }
  }, [currentSection]);

  // Eye tracking progress animation
  useEffect(() => {
    if (currentSection === 'testing' && eyeTrackingActive) {
      setEyeTrackingProgress(0);
      const interval = setInterval(() => {
        setEyeTrackingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + (100 / (12 * 10)); // 12 seconds, 10 updates per second
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [currentSection, eyeTrackingActive]);

  // Heatmap intensity build-up
  useEffect(() => {
    if (eyeTrackingStage > 0) {
      const targetIntensity = eyeTrackingStage * 25; // 25% per stage
      setHeatmapIntensity(targetIntensity);
    }
  }, [eyeTrackingStage]);



  // Show Historical Mistakes button with delay
  useEffect(() => {
    if (currentSection === 'dialectics' && dialecticsState === 'content' && !historicalMistakesButtonClicked) {
      setShowHistoricalMistakesButton(false);
      const timer = setTimeout(() => {
        setShowHistoricalMistakesButton(true);
      }, 4000);
      
      return () => clearTimeout(timer);
    } else {
      setShowHistoricalMistakesButton(false);
    }
  }, [currentSection, dialecticsState, historicalMistakesButtonClicked]);

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
      }`} style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
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
          } relative`}>
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
                opacity: step >= 6 ? 1 : 0,
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

          {/* Mobile Hamburger Button - Original Position */}
          {!mobileMenuFixed && (
            <motion.button
              className="z-50 flex h-8 w-8 flex-col items-center justify-center sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: step >= 6 ? 1 : 0,
                x: menuMoving ? 'calc(50vw - 50% - 16px)' : 0,
                y: menuMoving ? 'calc(100vh - 120px)' : 0,
                scale: menuMoving ? 1.5 : 1,
              }}
              transition={{ 
                duration: menuMoving ? 1.5 : 0.3,
                type: menuMoving ? "spring" : "tween",
                stiffness: menuMoving ? 100 : 200,
                damping: menuMoving ? 20 : 25
              }}
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

        {/* --- Mobile Hamburger Button - Fixed Position --- */}
        <AnimatePresence>
          {mobileMenuFixed && (
            <motion.button
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex h-12 w-12 flex-col items-center justify-center rounded-full shadow-lg sm:hidden"
              style={{
                backgroundColor: shouldInvertNav() ? '#000000' : '#ffffff',
              }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: step >= 6 ? 1 : 0, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
        </AnimatePresence>
        
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
        {currentSection !== 'anatomy' && currentSection !== 'dialectics' && (
          <motion.button
            onClick={() => {
              setModalOpenedBy('sad-face');
              setModalOpen(true);
            }}
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

      {/* --- Right Hand Bias Button (Mobile Only) --- */}
      <AnimatePresence>
        {currentSection === 'ergonomics' && thumbFlowStage >= 5 && isMobile && (
          <motion.button
            onClick={() => {
              if (isLeftHanded) {
                setBiasModalOpen(true);
              } else {
                setIsLeftHanded(true);
              }
            }}
            className={`fixed bottom-6 left-6 z-40 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-110 hover:rotate-3 ${
              shouldInvertNav() 
                ? 'bg-secondary-black text-white shadow-lg hover:bg-gray-800' 
                : 'bg-white text-black shadow-lg hover:bg-gray-50'
            }`}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-2">
              {!isLeftHanded && (
                <motion.div
                  className="w-2 h-2 bg-red-500 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              <span>{isLeftHanded ? 'Unbias your design' : 'Bias Detected'}</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

            {/* --- Historical Mistakes Button (Mobile Only) --- */}
      <AnimatePresence>
        {showHistoricalMistakesButton && isMobile && (
          <motion.button
            onClick={() => {
              setHistoricalMistakesModalOpen(true);
              setHistoricalMistakesButtonClicked(true);
            }}
            className={`fixed top-20 right-6 z-40 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-110 hover:rotate-3 ${
              shouldInvertNav() 
                ? 'bg-white text-black shadow-lg hover:bg-gray-200' 
                : 'bg-black text-white shadow-lg hover:bg-gray-800'
            }`}
            initial={{ opacity: 0, scale: 0, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
                      >
              <span>hmmm ↑ 🤔</span>
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
             onClick={handleModalClose}
           >
                         <motion.div
               className={`rounded-lg p-6 max-w-md w-full mx-4 relative ${
                 shouldInvertNav() ? 'bg-black text-white border border-white/20' : 'bg-white text-black'
               }`}
               initial={{ scale: 0.8, opacity: 0, y: 50 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.8, opacity: 0, y: 50 }}
               transition={{ type: "spring", stiffness: 300, damping: 25 }}
               onClick={(e) => e.stopPropagation()}
             >
               <button
                 onClick={handleModalClose}
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
                         Prioritise primary and regular actions in comfortable areas where possible and relegate infrequent ones to the uncomfortable areas.
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
                   }`}
                   style={{
                     textShadow: shouldInvertNav() 
                       ? '0 0 8px rgba(255, 255, 255, 0.6), 0 0 12px rgba(255, 255, 255, 0.4)' 
                       : '0 0 8px rgba(0, 0, 0, 0.6), 0 0 12px rgba(0, 0, 0, 0.4)'
                   }}>
                     Pure white on pure black or vice versa causes halation, which is a glow behind the text making it hard to read.
                   </p>
                 </div>
                   </>
                 )}
               </div>
               
               <div className="flex flex-col space-y-3">
                 {currentSection === 'ergonomics' && thumbFlowStage >= 5 ? (
                   // Thumb Flow Key Modal Button
                   <>
                   <button 
                     onClick={handleModalClose}
                     className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                       shouldInvertNav() 
                         ? 'bg-white text-black hover:bg-gray-200' 
                         : 'bg-black text-white hover:bg-gray-800'
                     }`}
                   >
                     I will never forget this, or you
                   </button>
                   
                   {/* Pathway Diagram */}
                   <div className="mt-4 pt-4 border-t border-opacity-20 border-gray-400">
                     {!pathwayDiagramClicked ? (
                       <button
                         onClick={() => setPathwayDiagramClicked(true)}
                         className={`text-xs leading-relaxed transition-colors hover:opacity-80 text-left w-full ${
                           shouldInvertNav() ? 'text-gray-400' : 'text-gray-500'
                         }`}
                       >
                         <div className="space-y-1">
                           {modalOpenedBy === 'sad-face' && (
                             <div className="flex items-center justify-center">
                               <span>Flow: Angry Face Button</span>
                               <span className="mx-2">→</span>
                               <span>Thumbflow Key Modal</span>
                             </div>
                           )}
                           {modalOpenedBy === 'comfortable-button' && (
                             <div className="flex items-center justify-center">
                               <span>Flow: Mmm, Comfortable Button</span>
                               <span className="mx-2">→</span>
                               <span>Thumbflow Key Modal</span>
                             </div>
                           )}
                         </div>
                   </button>
                     ) : (
                       <div className={`text-xs text-center italic transition-opacity ${
                         shouldInvertNav() ? 'text-gray-400' : 'text-gray-500'
                       }`}>
                         <p className="mb-2">
                           You can get here two ways, which isn't best practice, but sometimes two pathways are ok to cover all bases
                         </p>
                         <div className={`inline-block px-3 py-1.5 rounded-lg border text-xs ${
                           shouldInvertNav() 
                             ? 'bg-gray-800/30 border-gray-600/50 text-gray-300' 
                             : 'bg-gray-50/80 border-gray-200/60 text-gray-600'
                         }`}>
                           {modalOpenedBy === 'sad-face' 
                             ? 'Other path = Mmm, Comfortable Button'
                             : 'Other path = Angry Face Button'
                           }
                         </div>
                       </div>
                     )}
                   </div>
                   </>
                 ) : (
                   // UX Mistakes Modal Buttons
                   <>
                 <button 
                   onClick={handleModalClose}
                   className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                     shouldInvertNav() 
                       ? 'bg-white text-black hover:bg-gray-200' 
                       : 'bg-black text-white hover:bg-gray-800'
                   }`}
                 >
                   Fix these issues
                 </button>
                 <button 
                   onClick={handleModalClose}
                   className={`w-full px-4 py-2 rounded-lg font-medium transition-colors border ${
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
                shouldInvertNav() ? 'bg-black text-white border border-white/20' : 'bg-white text-black'
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
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
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

      {/* --- Bias Modal --- */}
      <AnimatePresence>
        {biasModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBiasModalOpen(false)}
          >
            <motion.div
              className={`rounded-lg p-6 max-w-md w-full mx-4 relative ${
                shouldInvertNav() ? 'bg-black text-white border border-white/20' : 'bg-white text-black'
              }`}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setBiasModalOpen(false)}
                className={`absolute top-4 right-4 text-xl transition-colors ${
                  shouldInvertNav() ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ×
              </button>
              
              <h2 className={`text-2xl font-bold mb-6 ${
                shouldInvertNav() ? 'text-white' : 'text-black'
              }`}>Biases in Design</h2>
              
              <div className="mb-6">
                <p className={`text-base leading-relaxed ${
                  shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  As a UX designer you have to know about many psychological biases. Not only in user testing but in the designer themselves. Design is tackled best in an unbiased way, it just makes the best experience for all.
                </p>
                
                <h3 className={`text-lg font-bold mt-6 mb-3 ${
                  shouldInvertNav() ? 'text-white' : 'text-black'
                }`}>Cradling</h3>
                <p className={`text-base leading-relaxed ${
                  shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  People cradle their phone in many ways, and there are techniques to account for it. What you don't want are users changing their position because your design is unergonomic.
                </p>
              </div>
              
                             <div className="flex flex-col space-y-3">
                 <button 
                   onClick={() => setBiasModalOpen(false)}
                   className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                     shouldInvertNav() 
                       ? 'bg-white text-black hover:bg-gray-200' 
                       : 'bg-black text-white hover:bg-gray-800'
                   }`}
                 >
                   Got it
                 </button>
                 <button 
                   onClick={() => {
                     setIsLeftHanded(false);
                     setBiasModalOpen(false);
                   }}
                   className={`w-full px-4 py-2 rounded-lg font-medium transition-colors border ${
                     shouldInvertNav() 
                       ? 'border-white text-white hover:bg-white hover:text-black' 
                       : 'border-black text-black hover:bg-black hover:text-white'
                   }`}
                 >
                   Reset to right-handed
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Breakdown Modal --- */}
      <AnimatePresence>
        {breakdownModalIdentifier !== null && breakdownModalContent[breakdownModalIdentifier] && (
        <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBreakdownModalIdentifier(null)}
        >
            <motion.div
            className={`rounded-lg p-6 max-w-md w-full mx-4 relative ${
                shouldInvertNav() ? 'bg-black text-white border border-white/20' : 'bg-white text-black'
            }`}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            >
            <button
                onClick={() => setBreakdownModalIdentifier(null)}
                className={`absolute top-4 right-4 text-xl transition-colors ${
                shouldInvertNav() ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                ×
            </button>
            
            <h2 className={`text-2xl font-bold mb-6 ${
                shouldInvertNav() ? 'text-white' : 'text-black'
            }`}>{breakdownModalContent[breakdownModalIdentifier].title}</h2>
            
            <div className="space-y-4">
                {isMobile && breakdownModalIdentifier === 0 && (
                  <div>
                    <h3 className={`text-lg font-bold mb-2 ${
                        shouldInvertNav() ? 'text-white' : 'text-black'
                    }`}>
                      Notice how easy that was to tap
                    </h3>
                    <p className={`text-sm leading-relaxed ${
                        shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Well Whitenoise hasn't utilised the standard bottom navigation bar for iOS at all.
                    </p>
                  </div>
                )}
                {breakdownModalContent[breakdownModalIdentifier].content.map((item, index) => (
                <div key={index}>
                    <h3 className={`text-lg font-bold mb-2 ${
                        shouldInvertNav() ? 'text-white' : 'text-black'
                    }`}>
                    {item.subheading}
                    </h3>
                    <p className={`text-sm leading-relaxed ${
                        shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    {item.hasLink && item.linkText && item.linkUrl ? (
                      <>
                        {item.text.split(item.linkText)[0]}
                        <a 
                          href={item.linkUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`underline hover:no-underline transition-all ${
                            shouldInvertNav() ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                          }`}
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
                onClick={() => setBreakdownModalIdentifier(null)}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
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

      {/* --- App Selector Modal --- */}
      <AnimatePresence>
        {appSelectorModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAppSelectorModalOpen(false)}
          >
            <motion.div
              className={`rounded-lg p-6 max-w-sm w-full mx-4 relative ${
                shouldInvertNav() ? 'bg-black text-white border border-white/20' : 'bg-white text-black'
              }`}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setAppSelectorModalOpen(false)}
                className={`absolute top-4 right-4 text-xl transition-colors ${
                  shouldInvertNav() ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ×
              </button>
              
              <h2 className={`text-xl font-bold mb-6 text-center ${
                shouldInvertNav() ? 'text-white' : 'text-black'
              }`}>Select App</h2>
              
              <div className="space-y-4">
                {[
                  { name: 'Whitenoise', icon: 'whitenoise-icon.png' },
                  { name: 'Primal', icon: 'primal-icon.png' },
                  { name: 'Strike', icon: 'strike-icon.png' }
                ].map((app) => (
                  <button
                    key={app.name}
                    onClick={() => navigateToApp(app.name)}
                    className={`w-full flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                      shouldInvertNav() 
                        ? 'hover:bg-gray-800 text-white' 
                        : 'hover:bg-gray-100 text-black'
                    }`}
                  >
                    <img 
                      src={`/${app.icon}`} 
                      alt={`${app.name} icon`}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-lg font-medium">{app.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Historical Mistakes Modal --- */}
      <AnimatePresence>
        {historicalMistakesModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setHistoricalMistakesModalOpen(false)}
          >
            <motion.div
              className={`rounded-lg p-6 max-w-md w-full mx-4 relative ${
                shouldInvertNav() ? 'bg-black text-white border border-white/20' : 'bg-white text-black'
              }`}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setHistoricalMistakesModalOpen(false)}
                className={`absolute top-4 right-4 text-xl transition-colors ${
                  shouldInvertNav() ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ×
              </button>
              
              <h2 className={`text-2xl font-bold mb-6 ${
                shouldInvertNav() ? 'text-white' : 'text-black'
              }`}>Historical Mistakes</h2>
              
              <div className="space-y-4 mb-6">
                <p className={`text-base leading-relaxed ${
                  shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  When we transitioned from desktop to mobile a lot of ideas were transferred that no longer made sense.
                </p>
                <p className={`text-base leading-relaxed ${
                  shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Information Hierarchy made sense on desktop but not ergonomically on mobile, especially after screens got bigger than 3.5".
                </p>
                <p className={`text-base leading-relaxed ${
                  shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  This is a horrible place for a menu button but it persists because someone decided that day one.
                </p>
                <p className={`text-base leading-relaxed ${
                  shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Over time bad UX gets habituated by users and is harder to undo.
                </p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => {
                    setMenuMoving(true);
                    setHistoricalMistakesModalOpen(false);
                    // Start the animation sequence
                    setTimeout(() => {
                      setMobileMenuFixed(true);
                      setMenuMoving(false);
                    }, 1500); // Duration of the movement animation
                  }}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    shouldInvertNav() 
                      ? 'bg-white text-black hover:bg-gray-200' 
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  Let's fix it
                </button>
                <button 
                  onClick={() => setHistoricalMistakesModalOpen(false)}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors border ${
                    shouldInvertNav() 
                      ? 'border-white text-white hover:bg-white hover:text-black' 
                      : 'border-black text-black hover:bg-black hover:text-white'
                  }`}
                >
                  No I like it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Research Pattern Modal --- */}
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
              className={`rounded-lg p-6 max-w-md w-full mx-4 relative ${
                shouldInvertNav() ? 'bg-black text-white border border-white/20' : 'bg-white text-black'
              }`}
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
                className={`absolute top-4 right-4 text-xl transition-colors ${
                  shouldInvertNav() ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ×
              </button>
              
              <h2 className={`text-2xl font-bold mb-6 ${
                shouldInvertNav() ? 'text-white' : 'text-black'
              }`}>{researchPatternContent[selectedResearchPattern].title}</h2>
              
              <div className="space-y-4">
                {researchPatternContent[selectedResearchPattern].content.map((item, index) => (
                  <div key={index}>
                    <h3 className={`text-lg font-bold mb-2 ${
                      shouldInvertNav() ? 'text-white' : 'text-black'
                    }`}>
                      {item.subheading}
                    </h3>
                    <p className={`text-sm leading-relaxed ${
                      shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {item.hasLink && item.linkText && item.linkUrl ? (
                        <>
                          {item.text.split(item.linkText)[0]}
                          <a 
                            href={item.linkUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`underline hover:no-underline transition-all ${
                              shouldInvertNav() ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                            }`}
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
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
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

      {/* --- Contact Form Modal --- */}
      <AnimatePresence>
        {contactModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setContactModalOpen(false)}
          >
            <motion.div
              className={`rounded-lg p-6 max-w-md w-full mx-4 relative ${
                shouldInvertNav() ? 'bg-black text-white border border-white/20' : 'bg-white text-black'
              }`}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setContactModalOpen(false)}
                className={`absolute top-4 right-4 text-xl transition-colors ${
                  shouldInvertNav() ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ×
              </button>
              
              <h2 className={`text-2xl font-bold mb-6 ${
                shouldInvertNav() ? 'text-white' : 'text-black'
              }`}>Get In Touch</h2>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email:
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      shouldInvertNav() 
                        ? 'bg-gray-800 border-gray-600 text-white focus:border-gray-400' 
                        : 'bg-white border-gray-300 text-black focus:border-gray-500'
                    } focus:outline-none`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Subject:
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      shouldInvertNav() 
                        ? 'bg-gray-800 border-gray-600 text-white focus:border-gray-400' 
                        : 'bg-white border-gray-300 text-black focus:border-gray-500'
                    } focus:outline-none`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    shouldInvertNav() ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Message:
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors resize-none ${
                      shouldInvertNav() 
                        ? 'bg-gray-800 border-gray-600 text-white focus:border-gray-400' 
                        : 'bg-white border-gray-300 text-black focus:border-gray-500'
                    } focus:outline-none`}
                  />
                </div>
                
                <div className="flex justify-center mt-6">
                  <button 
                    type="submit"
                    className={`w-full px-6 py-2 rounded-lg font-medium transition-colors ${
                      shouldInvertNav() 
                        ? 'bg-white text-black hover:bg-gray-200' 
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    Send
                  </button>
                </div>
              </form>
              
              {/* Or connect on section */}
              <div className={`mt-6 pt-6 border-t ${
                shouldInvertNav() ? 'border-white/20' : 'border-gray-200'
              }`}>
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex items-center space-x-3">
                    <a
                      href="https://signal.me/#eu/OMbm5xbezTKaXYSUqblWuZfrd-FTo5oFGJiQ6WLcx21N0wAi2IxOLqHmZIjrEsj1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        shouldInvertNav() 
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                          : 'text-gray-700 hover:text-black hover:bg-gray-100'
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.002 2C6.486 2 2.002 6.484 2.002 12s4.484 10 9.998 10c1.386 0 2.711-.301 3.906-.838L20.002 22l-.838-4.096C20.301 16.711 22.002 14.386 22.002 12c0-5.516-4.484-10-9.998-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                        <path d="M7.002 10h2v6h-2zm4 0h2v6h-2zm4 0h2v6h-2z"/>
                      </svg>
                      <span className="text-sm font-medium">Signal</span>
                    </a>
                    <a
                      href="https://primal.net/Zazawowow"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        shouldInvertNav() 
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                          : 'text-gray-700 hover:text-black hover:bg-gray-100'
                      }`}
                    >
                      <img 
                        src="/nostr_logo_prpl.svg" 
                        alt="Nostr logo" 
                        width="16" 
                        height="16"
                        className="flex-shrink-0"
                      />
                      <span className="text-sm font-medium">Nostr</span>
                    </a>
                    <a
                      href="https://www.zazawowow.co.uk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        shouldInvertNav() 
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                          : 'text-gray-700 hover:text-black hover:bg-gray-100'
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                        <path d="M9 12l2 2 4-4"/>
                      </svg>
                      <span className="text-sm font-medium">Portfolio</span>
                    </a>
                  </div>
                </div>
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

          {/* --- Image Carousel & Annotations Container --- */}
          <motion.div
            className="absolute inset-0 w-full h-full flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 -translate-y-8 sm:translate-y-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 6 ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-full h-full max-w-screen-lg aspect-[16/9] mx-auto">
              {/* Carousel is now inside the aspect-ratio container */}
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
                  // Add swipe functionality for mobile
                  drag={isMobile ? "x" : false}
                  dragConstraints={{ left: -100, right: 100 }}
                  dragElastic={0.2}
                  whileDrag={isMobile ? { scale: 0.95 } : {}}
                  onDragEnd={(_, { offset, velocity }) => {
                    if (!isMobile) return;
                    
                    const swipeThreshold = 30;
                    const swipeVelocityThreshold = 300;
                    
                    if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > swipeVelocityThreshold) {
                      if (offset.x > 0 || velocity.x > 0) {
                        // Swiped right, go to previous slide
                        paginate(-1);
                      } else {
                        // Swiped left, go to next slide
                        paginate(1);
                      }
                    }
                  }}
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
                      {slideIndex === 3 && (
                        <motion.p 
                          className="text-lg sm:text-xl font-bold text-gray-900 mt-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 3 }}
                        >
                          This probably happened to you just now
                        </motion.p>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* --- Animated Arrow (Right) --- */}
              <AnimatePresence key={`annotations-${slideIndex}`}>
                {showAnnotations && (
                  <motion.div
                    className="absolute z-20 pointer-events-none"
                    style={isMobile ? {
                      top: slideIndex === 2 ? 'calc(50% - 50px)' : '23%',
                      right: '5%',
                      width: '12vw',
                      height: '12vw',
                      maxWidth: '80px',
                      maxHeight: '80px',
                    } : {
                      top: slideIndex === 2 ? 'calc(50% - 50px)' : '18%',
                      right: '25%',
                      width: '8vw',
                      height: '8vw',
                      maxWidth: '80px',
                      maxHeight: '80px',
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
                    transition={{
                      duration: 0.8,
                      delay: 0.5,
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <motion.div
                        className="w-full h-full drop-shadow-lg"
                        style={{
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                          transform: 'rotate(-135deg)'
                        }}
                        animate={{
                          y: [0, -6, 0],
                          x: [0, 6, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 120 120"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_409_495)">
                            <path d="M92 104L92 44C92 39.5817 88.4183 36 84 36L19 36" stroke="#DC2626" strokeWidth="4"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M90 122L90 80L94 80L94 122L90 122Z" fill="#DC2626"/>
                            <path d="M36 19L19 36L36 53" stroke="#DC2626" strokeWidth="4"/>
                          </g>
                          <defs>
                            <clipPath id="clip0_409_495">
                              <rect width="120" height="120" fill="white"/>
                            </clipPath>
                          </defs>
                        </svg>
                      </motion.div>

                      <motion.div
                        className="mt-2 text-red-600 text-center leading-tight"
                        style={{
                          fontFamily: 'Caveat, cursive',
                          fontSize: 'clamp(16px, 1.8vw, 24px)',
                          transform: 'rotate(-8deg) translateX(1vw)',
                          fontWeight: '600'
                        }}
                        animate={{
                          y: [0, -2, 0],
                          rotate: [-8, -6, -8],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {slideIndex === 2 ? (
                          <>
                            <div>No Balance</div>
                            <div>Reminder</div>
                          </>
                        ) : slideIndex === 4 ? (
                          <>
                            <div>Desktop</div>
                            <div>Pattern</div>
                          </>
                        ) : (
                          <>
                            <div>Not</div>
                            <div>Ergonomic</div>
                          </>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* --- Mirrored Arrow (Left) --- */}
              <AnimatePresence key={`left-annotation-${slideIndex}`}>
                {showAnnotations && (
                  <motion.div
                    className="absolute z-20 pointer-events-none"
                    style={isMobile ? {
                      top: slideIndex === 4 ? 'auto' : (slideIndex === 2 ? 'calc(50% - 50px)' : '23%'),
                      bottom: slideIndex === 4 ? '20%' : 'auto',
                      left: '5%',
                      width: '12vw',
                      height: '12vw',
                      maxWidth: '80px',
                      maxHeight: '80px',
                    } : {
                      top: slideIndex === 4 ? 'auto' : (slideIndex === 2 ? 'calc(50% - 50px)' : '18%'),
                      bottom: slideIndex === 4 ? '20%' : 'auto',
                      left: '25%',
                      width: '8vw',
                      height: '8vw',
                      maxWidth: '80px',
                      maxHeight: '80px',
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
                    transition={{
                      duration: 0.8,
                      delay: 1.2,
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }}
                  >
                    <div className={`flex items-center ${slideIndex === 4 ? 'flex-col-reverse' : 'flex-col'}`}>
                      <motion.div
                        className="w-full h-full drop-shadow-lg"
                        style={{
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                          transform: `rotate(${slideIndex === 4 ? 45 : -135}deg)`,
                        }}
                        animate={{
                          y: slideIndex === 4 ? [0, 6, 0] : [0, -6, 0],
                          x: slideIndex === 4 ? 0 : [0, -6, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 120 120"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ transform: slideIndex === 4 ? 'scaleY(-1) scaleX(-1)' : 'scaleX(-1)' }}
                        >
                          <g clipPath="url(#clip0_409_495_left)">
                           <path d="M92 104L92 44C92 39.5817 88.4183 36 84 36L19 36" stroke="#DC2626" strokeWidth="4"/>
                           <path fillRule="evenodd" clipRule="evenodd" d="M90 122L90 80L94 80L94 122L90 122Z" fill="#DC2626"/>
                           <path d="M36 19L19 36L36 53" stroke="#DC2626" strokeWidth="4"/>
                         </g>
                         <defs>
                           <clipPath id="clip0_409_495_left">
                             <rect width="120" height="120" fill="white"/>
                           </clipPath>
                         </defs>
                       </svg>
                      </motion.div>
                      
                      <motion.div
                        className={`${slideIndex === 4 ? 'mb-2' : 'mt-2'} text-red-600 text-center leading-tight`}
                        style={{
                          fontFamily: 'Caveat, cursive',
                          fontSize: 'clamp(16px, 1.8vw, 24px)',
                          transform: slideIndex === 4 ? 'none' : 'rotate(8deg) translateX(-1vw)',
                          fontWeight: '600'
                        }}
                        animate={{
                          y: [0, -2, 0],
                          rotate: slideIndex === 4 ? 0 : [8, 6, 8],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {slideIndex === 2 ? (
                          <>
                            <div>Prefilled</div>
                            <div>amounts</div>
                          </>
                        ) : slideIndex === 4 ? (
                          <>
                            <div>Underutilizes</div>
                            <div>tab bar</div>
                          </>
                        ) : (
                          <>
                            <div>Really</div>
                            <div>Not</div>
                            <div>Ergonomic</div>
                          </>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* --- New Top-Left Annotation (Screen 3) --- */}
              <AnimatePresence key={`top-left-annotation-${slideIndex}`}>
                {showAnnotations && slideIndex === 4 && (
                  <motion.div
                    className="absolute z-20 pointer-events-none"
                    style={isMobile ? {
                      top: '23%',
                      left: '5%',
                      width: '12vw',
                      height: '12vw',
                      maxWidth: '80px',
                      maxHeight: '80px',
                    } : {
                      top: '18%',
                      left: '25%',
                      width: '8vw',
                      height: '8vw',
                      maxWidth: '80px',
                      maxHeight: '80px',
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
                    transition={{
                      duration: 0.8,
                      delay: 1.9,
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <motion.div
                        className="w-full h-full drop-shadow-lg"
                        style={{
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                          transform: 'rotate(-135deg)'
                        }}
                        animate={{
                          y: [0, -6, 0],
                          x: [0, -6, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 120 120"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ transform: 'scaleX(-1)' }}
                        >
                          <g clipPath="url(#clip0_409_495_left)">
                           <path d="M92 104L92 44C92 39.5817 88.4183 36 84 36L19 36" stroke="#DC2626" strokeWidth="4"/>
                           <path fillRule="evenodd" clipRule="evenodd" d="M90 122L90 80L94 80L94 122L90 122Z" fill="#DC2626"/>
                           <path d="M36 19L19 36L36 53" stroke="#DC2626" strokeWidth="4"/>
                         </g>
                         <defs>
                           <clipPath id="clip0_409_495_left">
                             <rect width="120" height="120" fill="white"/>
                           </clipPath>
                         </defs>
                       </svg>
                      </motion.div>
                      
                      <motion.div
                        className="mt-2 text-red-600 text-center leading-tight"
                        style={{
                          fontFamily: 'Caveat, cursive',
                          fontSize: 'clamp(16px, 1.8vw, 24px)',
                          transform: 'rotate(8deg) translateX(-1vw)',
                          fontWeight: '600'
                        }}
                        animate={{
                          y: [0, -2, 0],
                          rotate: [8, 6, 8],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div>Worst place</div>
                        <div>for anything</div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* --- Breakdown Button --- */}
              <AnimatePresence key={`breakdown-button-${slideIndex}`}>
                {showAnnotations && (
                <motion.button
                    onClick={() => setBreakdownModalIdentifier(slideIndex)}
                    className="absolute bottom-[22%] sm:bottom-[18%] left-1/2 transform -translate-x-1/2 -translate-y-6 px-4 py-2 bg-white text-black rounded-lg text-xs font-medium shadow-md hover:bg-gray-50 transition-all duration-300 hover:scale-105 z-20 whitespace-nowrap"
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 20, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 1.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="flex items-center space-x-1.5">
                    <motion.div
                        className="w-1.5 h-1.5 bg-red-500 rounded-full"
                        animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                        }}
                    />
                    <span className="text-xs">UX Breakdown</span>
                    </div>
                </motion.button>
                )}
              </AnimatePresence>
            </div>
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

          {/* --- Footnote for second quote --- */}
          <motion.div
            className="absolute inset-x-0 bottom-48 sm:bottom-32 z-10 flex justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: slideIndex === 3 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs sm:text-sm text-gray-600 italic text-center max-w-md">
              <motion.span
                key={slideIndex === 3 ? 'second-quote' : 'hidden'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 4, ease: "easeInOut", delay: 5 }}
              >
                You probably didn't even read this, low intent users don't, the less text the better
              </motion.span>
            </p>
          </motion.div>

          {/* --- Carousel Controls --- */}
          <motion.div
            className="absolute inset-x-0 bottom-24 sm:bottom-8 z-10 flex justify-center items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 6 ? 1 : 0 }}
          >
            <button
              onClick={() => paginate(-1)}
              className="p-2 bg-white/50 rounded-full hover:bg-white/80 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            
            {/* App Selector Dropdown */}
            <button
              onClick={() => setAppSelectorModalOpen(true)}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                shouldInvertNav() ? 'bg-secondary-black text-white shadow-lg' : 'bg-white text-black shadow-lg'
              }`}
            >
              <img 
                src={`/${getCurrentAppIcon().icon}`} 
                alt={`${getCurrentAppIcon().name} icon`}
                className="h-6 w-6 rounded-full"
              />
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
          // const loaderTextColor = isEven ? 'text-gray-500' : 'text-gray-400';
          // const loaderBgColor = isEven ? 'bg-gray-800' : 'bg-gray-200';
          // const loaderFillColor = isEven ? 'bg-gray-600' : 'bg-gray-500';
          
          // Determine rhodopsin message
          const getRhodopsinMessage = () => {
            if (targetId === 'question') {
              return rhodopsinProgress >= 100 
                ? 'Rhodopsin Pigments Generated' 
                : 'Rhodopsin Pigments Generating';
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

              <div className={`flex-1 flex items-center justify-center min-h-0 relative z-10 overflow-hidden -mt-16 sm:-mt-12`}>
                <div className={`text-center max-w-2xl px-10 sm:px-4 ${textColor}`}>
                {/* Hide title for Ergonomics on desktop and Testing section during animation */}
                {!(item === 'Ergonomics' && !isMobile) && !(item === 'Testing' && !eyeTrackingTextVisible) && (
                <h2 className="text-3xl sm:text-4xl font-bold">
                      {item === 'Question' ? 
                        (questionAnswer === 'yes' ? 'UX Does Matter' :
                         returnedFrom404 ? 'Oh, so it does matter? 🙂' : 'Does UX matter for Bitcoin & Nostr?') : 
                       item === 'Dialectics' ? (dialecticsState === 'content' ? 'UX is a dialectic' : '') :
                       item === 'Ergonomics' && ergonomicsState === 'revealed' ? 'That second one was annoying huh?' : 
                       item === 'Research' && !researchTextVisible ? '' :
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
                          className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300 min-w-[100px] border border-gray-200/50"
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
                {item === 'Dialectics' && (
                  <>
                    {dialecticsState === 'conversation' ? (
                      <div className="w-96 sm:w-[420px] mx-auto">
                        <motion.div 
                          className="bg-gray-50 rounded-2xl p-4 flex flex-col h-[70vh] sm:h-[50vh] max-h-[420px] min-h-[320px]"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            opacity: { duration: 0.3 },
                            scale: { type: "spring", stiffness: 400, damping: 25 }
                          }}
                        >
                          <div className="flex-1 space-y-4 overflow-y-auto relative">
                            {/* New Team Chat animation */}
                            <AnimatePresence>
                              {conversationProgress === 0 && (
                                <motion.div
                                  className="absolute inset-0 flex items-center justify-center"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <motion.div
                                    className="text-xl font-medium text-gray-800"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.6 }}
                                  >
                                    New Team Chat
                                  </motion.div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                            <AnimatePresence>
                              {conversationMessages.slice(0, conversationProgress).map((msg, index) => (
                                <motion.div
                                  key={`message-${index}`}
                                  className={`flex ${msg.side === 'right' ? 'justify-end' : 'justify-start'}`}
                                  initial={{ 
                                    opacity: 0, 
                                    y: 10
                                  }}
                                  animate={{ 
                                    opacity: 1, 
                                    y: 0
                                  }}
                                  transition={{ 
                                    duration: 0.4,
                                    ease: "easeOut"
                                  }}
                                  layout
                                >
                                  <div className="max-w-[80%]">
                                    <motion.div 
                                      className={`px-4 py-2 rounded-2xl text-base text-left ${
                                        msg.side === 'right' 
                                          ? 'bg-blue-500 text-white rounded-br-md' 
                                          : 'bg-white text-gray-800 rounded-bl-md'
                                      }`}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ 
                                        duration: 0.3,
                                        ease: "easeOut",
                                        delay: 0.1
                                      }}
                                    >
                                      {msg.message === 'Maybe try this guy https://protocolux.com' ? (
                                        <>
                                          Maybe try this guy{' '}
                                          <button
                                            onClick={() => setDialecticsState('content')}
                                            className="underline hover:no-underline font-medium text-blue-600 hover:text-blue-700"
                                          >
                                            Check out PROUX
                                          </button>
                                        </>
                                      ) : (
                                        msg.message
                                      )}
                                    </motion.div>
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                            
                            {/* Typing Indicator Container with phantom sizing */}
                            <AnimatePresence>
                              {typingIndicator.visible && (
                                <div className="relative">
                                  {/* Phantom next message for sizing */}
                                  {conversationProgress < conversationMessages.length && (
                                    <div 
                                      className={`flex ${conversationMessages[conversationProgress].side === 'right' ? 'justify-end' : 'justify-start'} opacity-0 pointer-events-none`}
                                    >
                                      <div className="max-w-[80%]">
                                        <div className={`px-4 py-2 rounded-2xl text-base text-left ${
                                          conversationMessages[conversationProgress].side === 'right' 
                                            ? 'bg-blue-500 text-white rounded-br-md' 
                                            : 'bg-white text-gray-800 rounded-bl-md'
                                        }`}>
                                          {conversationMessages[conversationProgress].message === 'Maybe try this guy https://protocolux.com' ? (
                                            <>
                                              Maybe try this guy Check out PROUX
                                            </>
                                          ) : (
                                            conversationMessages[conversationProgress].message
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Actual typing indicator overlaid */}
                                  <motion.div
                                    className={`absolute inset-0 flex ${typingIndicator.side === 'right' ? 'justify-end' : 'justify-start'}`}
                                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.8 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                  >
                                    <div className="max-w-[80%]">
                                      <div className={`px-4 py-3 rounded-2xl ${
                                        typingIndicator.side === 'right' 
                                          ? 'bg-blue-500 text-white rounded-br-md' 
                                          : 'bg-white text-gray-800 rounded-bl-md'
                                      }`}>
                                        <div className="flex space-x-1">
                                          <motion.div
                                            className={`w-2 h-2 rounded-full ${
                                              typingIndicator.side === 'right' ? 'bg-white/70' : 'bg-gray-400'
                                            }`}
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                          />
                                          <motion.div
                                            className={`w-2 h-2 rounded-full ${
                                              typingIndicator.side === 'right' ? 'bg-white/70' : 'bg-gray-400'
                                            }`}
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                          />
                                          <motion.div
                                            className={`w-2 h-2 rounded-full ${
                                              typingIndicator.side === 'right' ? 'bg-white/70' : 'bg-gray-400'
                                            }`}
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                </div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                        

                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                          There is no "right" in user experience, there is just the length of conversation you go to in making your design decisions, based on the unique scenarios and characteristics of your product, team, and its users. Hypothesis, Antithesis, Synthesis.
                        </p>
                        <div className="mt-6 flex justify-center">
                          <button 
                            onClick={() => setContactModalOpen(true)}
                            className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300"
                          >
                            Start That Conversation Today
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
                {item === 'Research' && researchTextVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
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
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                          shouldInvertNav() 
                            ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' 
                            : 'bg-black/10 text-black hover:bg-black/20 border border-black/20'
                        }`}
                      >
                        F-Pattern Scanning
                      </button>
                      <button
                        onClick={() => {
                          setSelectedResearchPattern('scroll');
                          setResearchPatternModalOpen(true);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                          shouldInvertNav() 
                            ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' 
                            : 'bg-black/10 text-black hover:bg-black/20 border border-black/20'
                        }`}
                      >
                        Habitual Scrolling
                      </button>
                      <button
                        onClick={() => {
                          setSelectedResearchPattern('touch');
                          setResearchPatternModalOpen(true);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                          shouldInvertNav() 
                            ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' 
                            : 'bg-black/10 text-black hover:bg-black/20 border border-black/20'
                        }`}
                      >
{isMobile ? 'Touch' : 'Click'} Patterns
                      </button>
                    </motion.div>
                  </motion.div>
                )}
                {item === 'Testing' && eyeTrackingTextVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <p className={`mt-4 text-base sm:text-lg leading-relaxed ${subTextColor}`}>
                      UX testing is more than presenting a product to a random person and asking what they think, though there are some uses for guerilla testing, it all starts with a carefully crafted test to rule out known biases and simulate as real world situations as possible, with well written testing scripts and documentation of the test.
                    </p>
                  </motion.div>
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
                              onClick={ergonomicsState === 'revealed' && isMobile ? () => {
                                setModalOpenedBy('comfortable-button');
                                setModalOpen(true);
                              } : handleErgonomicsClick}
                              className={`px-8 py-3 rounded-lg font-medium transition-colors duration-300 ${
                                ergonomicsState === 'revealed' && isMobile && thumbFlowStage >= 5
                                  ? 'bg-black text-white hover:bg-gray-800'
                                  : (isEven ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800')
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
                                ? (thumbFlowStage >= 5 ? '🗝️ Thumbflow Key' : 'Mmm, Comfortable 😊')
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
                                    onClick={ergonomicsState === 'revealed' ? () => {
                                      setModalOpenedBy('comfortable-button');
                                      setModalOpen(true);
                                    } : handleErgonomicsClick}
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
                                      ? (thumbFlowStage >= 5 ? '🗝️ Thumbflow Key' : 'Mmm, Comfortable 😊')
                                      : ergonomicsState === 'moved' 
                                        ? 'Ok, Now Click Me'
                                        : 'Click me'
                                    }
                                  </motion.button>
                                </div>
                                
                                {/* Right Hand Bias Button in Phone */}
                                <AnimatePresence>
                                  {thumbFlowStage >= 5 && (
                                    <motion.button
                                      onClick={() => {
                                        if (isLeftHanded) {
                                          setBiasModalOpen(true);
                                        } else {
                                          setIsLeftHanded(true);
                                        }
                                      }}
                                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white text-black rounded-lg text-xs font-medium shadow-md hover:bg-gray-50 transition-all duration-300 hover:scale-105 z-20 whitespace-nowrap"
                                      initial={{ opacity: 0, scale: 0, y: 20 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0, y: 20 }}
                                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <div className="flex items-center space-x-1.5">
                                        {!isLeftHanded && (
                                          <motion.div
                                            className="w-1.5 h-1.5 bg-red-500 rounded-full"
                                            animate={{
                                              scale: [1, 1.3, 1],
                                              opacity: [0.7, 1, 0.7],
                                            }}
                                            transition={{
                                              duration: 1.5,
                                              repeat: Infinity,
                                              ease: "easeInOut"
                                            }}
                                          />
                                        )}
                                        <span className="text-xs">{isLeftHanded ? 'Unbias your design' : 'Right Hand Bias Detected'}</span>
                                      </div>
                                    </motion.button>
                                  )}
                                </AnimatePresence>
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
                                          ...getThumbFlowZoneStyle('green'),
                                          backgroundColor: 'rgba(34, 197, 94, 0.3)',
                                          borderRadius: '60% 40% 50% 70%',
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
                                          ...getThumbFlowZoneStyle('yellow'),
                                          backgroundColor: 'rgba(234, 179, 8, 0.3)',
                                          borderRadius: '50% 60% 40% 70%',
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
                                          ...getThumbFlowZoneStyle('orange'),
                                          backgroundColor: 'rgba(249, 115, 22, 0.3)',
                                          borderRadius: '70% 50% 60% 40%',
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
                                            ...getThumbFlowZoneStyle('red1'),
                                            backgroundColor: 'rgba(239, 68, 68, 0.4)',
                                            borderRadius: '80% 60% 40% 70%',
                                          }}
                                          initial={{ opacity: 0, scale: 0.5 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ duration: 0.8 }}
                                        />
                                        <motion.div
                                          className="absolute"
                                          style={{
                                            ...getThumbFlowZoneStyle('red2'),
                                            backgroundColor: 'rgba(239, 68, 68, 0.4)',
                                            borderRadius: '60% 80% 70% 40%',
                                          }}
                                          initial={{ opacity: 0, scale: 0.5 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ duration: 0.8, delay: 0.2 }}
                                        />
                                        <motion.div
                                          className="absolute"
                                          style={{
                                            ...getThumbFlowZoneStyle('red3'),
                                            backgroundColor: 'rgba(239, 68, 68, 0.3)',
                                            borderRadius: '40% 70% 80% 50%',
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

              {/* Research Progress Loader - Center Overlay */}
              {targetId === 'research' && researchCompleting && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <motion.div
                    className={`px-6 py-4 rounded-lg backdrop-blur-sm`}
                    style={{
                      backgroundColor: isEven 
                        ? `rgba(255, 255, 255, 0.1)` 
                        : `rgba(0, 0, 0, 0.1)`,
                    }}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0 }}
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
                          {unconsciousBehaviorStage === 1 && "Analyzing F-Pattern Scanning"}
                          {unconsciousBehaviorStage === 2 && "Analyzing Habitual Scrolling"}
                          {unconsciousBehaviorStage === 3 && `Analyzing ${isMobile ? 'Touch' : 'Click'} Patterns`}
                          {unconsciousBehaviorStage === 4 && "Analysis Complete"}
                          {unconsciousBehaviorStage === 0 && "Research in progress..."}
                        </motion.div>
                      </AnimatePresence>
                      
                      <motion.div 
                        className={`text-sm mb-2`}
                        style={{
                          color: isEven 
                            ? `rgba(156, 163, 175, 0.9)` 
                            : `rgba(55, 65, 81, 0.9)`
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
                        Desktop Research
                      </motion.div>
                      <div 
                        className={`w-32 h-2 rounded-full overflow-hidden`}
                        style={{
                          backgroundColor: isEven 
                            ? `rgba(17, 24, 39, 0.7)` 
                            : `rgba(229, 231, 235, 0.7)`
                        }}
                      >
                        <motion.div
                          className={`h-full rounded-full`}
                          style={{
                            backgroundColor: isEven 
                              ? `rgba(75, 85, 99, 0.8)` 
                              : `rgba(75, 85, 99, 0.8)`
                          }}
                          initial={{ width: '0%' }}
                          animate={{ width: `${Math.max(0, researchProgress)}%` }}
                          transition={{ duration: 0.1, ease: 'linear' }}
                        />
                      </div>
                      <motion.div 
                        className={`text-xs mt-1`}
                        style={{
                          color: isEven 
                            ? `rgba(156, 163, 175, 0.8)` 
                            : `rgba(55, 65, 81, 0.8)`
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
                        {Math.round(Math.max(0, researchProgress))}% Complete
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Eye Tracking Progress Loader - Center Overlay */}
              {targetId === 'testing' && eyeTrackingActive && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <motion.div
                    className={`px-6 py-4 rounded-lg backdrop-blur-sm`}
                    style={{
                      backgroundColor: isEven 
                        ? `rgba(255, 255, 255, 0.1)` 
                        : `rgba(0, 0, 0, 0.1)`,
                    }}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0 }}
                  >
                    <div className="flex flex-col items-center">
                      {/* Dynamic Session Label */}
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={eyeTrackingStage}
                          className="text-white text-sm font-medium mb-3"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          {eyeTrackingStage === 1 && "Recording User Session 1"}
                          {eyeTrackingStage === 2 && "Recording User Session 2"}
                          {eyeTrackingStage === 3 && "Recording User Session 3"}
                          {eyeTrackingStage === 4 && "Generating Heatmap"}
                          {eyeTrackingStage === 0 && "Eye Tracking Test Session"}
                        </motion.div>
                      </AnimatePresence>
                      
                      <motion.div 
                        className={`text-sm mb-2`}
                        style={{
                          color: isEven 
                            ? `rgba(156, 163, 175, 0.9)` 
                            : `rgba(55, 65, 81, 0.9)`
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
                        Eye Tracking Study
                      </motion.div>
                      <div 
                        className={`w-32 h-2 rounded-full overflow-hidden`}
                        style={{
                          backgroundColor: isEven 
                            ? `rgba(17, 24, 39, 0.7)` 
                            : `rgba(229, 231, 235, 0.7)`
                        }}
                      >
                        <motion.div
                          className={`h-full rounded-full`}
                          style={{
                            backgroundColor: isEven 
                              ? `rgba(75, 85, 99, 0.8)` 
                              : `rgba(75, 85, 99, 0.8)`
                          }}
                          initial={{ width: '0%' }}
                          animate={{ width: `${Math.max(0, eyeTrackingProgress)}%` }}
                          transition={{ duration: 0.1, ease: 'linear' }}
                        />
                      </div>
                      <motion.div 
                        className={`text-xs mt-1`}
                        style={{
                          color: isEven 
                            ? `rgba(156, 163, 175, 0.8)` 
                            : `rgba(55, 65, 81, 0.8)`
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
                        {Math.round(Math.max(0, eyeTrackingProgress))}% Complete
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Eye Tracking Visualization - Testing Section */}
              {targetId === 'testing' && (eyeTrackingStage > 0 || (eyeTrackingTextVisible && heatmapIntensity > 0)) && (
                <div className="absolute inset-0 pointer-events-none z-0">
                  {/* Interface Mockup Background - Only show during eye tracking, not after */}
                  {eyeTrackingStage > 0 && !eyeTrackingTextVisible && (
                    <motion.div
                      className="absolute top-8 left-4 right-4 bottom-16 sm:inset-8 md:inset-16 lg:inset-24 rounded-lg overflow-hidden"
                      style={{
                        backgroundColor: '#000000',
                        border: '1px solid rgba(255, 255, 255, 0.15)'
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      {/* Simulated interface elements */}
                      <div className="p-3 sm:p-6 md:p-8">
                        {/* Header area */}
                        <div className="h-3 sm:h-4 bg-white/20 rounded mb-2 sm:mb-4 w-3/4"></div>
                        <div className="h-2 sm:h-3 bg-white/15 rounded mb-3 sm:mb-6 w-1/2"></div>
                        
                        {/* Placeholder image */}
                        <div className="h-16 sm:h-20 md:h-24 bg-white/10 rounded mb-3 sm:mb-4 w-full flex items-center justify-center">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded"></div>
                        </div>
                        
                        {/* Content blocks */}
                        <div className="space-y-1.5 sm:space-y-3">
                          <div className="h-2 sm:h-3 bg-white/15 rounded w-full"></div>
                          <div className="h-2 sm:h-3 bg-white/15 rounded w-5/6"></div>
                          <div className="h-2 sm:h-3 bg-white/15 rounded w-4/5"></div>
                        </div>
                        
                        {/* Button area */}
                        <div className="mt-3 sm:mt-6">
                          <div className="h-6 sm:h-8 bg-white/25 rounded w-20 sm:w-28"></div>
                        </div>
                        
                        {/* Secondary image/content */}
                        <div className="mt-4 sm:mt-8">
                          <div className="h-12 sm:h-16 bg-white/8 rounded mb-2 sm:mb-3 w-full"></div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <div className="h-2 sm:h-3 bg-white/10 rounded w-full"></div>
                            <div className="h-2 sm:h-3 bg-white/10 rounded w-3/4"></div>
                            <div className="h-2 sm:h-3 bg-white/10 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Heatmap Zones - Only show during stage 4 (heatmap generation) and after */}
                  <AnimatePresence>
                    {(eyeTrackingStage >= 4 || eyeTrackingTextVisible) && heatmapIntensity > 0 && (
                      <>
                        {/* F-Pattern Top Horizontal Sweep (Stage 1 contribution) */}
                        <motion.div
                          className="absolute"
                          style={{
                            top: isMobile ? '15%' : '12%',
                            left: isMobile ? '10%' : '15%',
                            width: isMobile ? '70%' : '65%',
                            height: isMobile ? '6%' : '5%',
                            background: `radial-gradient(ellipse, rgba(255, 0, 0, ${0.4 * (heatmapIntensity / 100)}) 0%, rgba(255, 0, 0, ${0.2 * (heatmapIntensity / 100)}) 50%, transparent 100%)`,
                            borderRadius: '50%',
                            filter: 'blur(8px)'
                          }}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 1 }}
                        />
                        
                        {/* F-Pattern Left Vertical (Stage 1 contribution) */}
                        <motion.div
                          className="absolute"
                          style={{
                            top: isMobile ? '25%' : '22%',
                            left: isMobile ? '8%' : '12%',
                            width: isMobile ? '15%' : '12%',
                            height: isMobile ? '35%' : '30%',
                            background: `radial-gradient(ellipse, rgba(255, 0, 0, ${0.35 * (heatmapIntensity / 100)}) 0%, rgba(255, 0, 0, ${0.18 * (heatmapIntensity / 100)}) 50%, transparent 100%)`,
                            borderRadius: '50%',
                            filter: 'blur(10px)'
                          }}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                        
                        {/* Z-Pattern Center Area (Stage 2 contribution) */}
                        <motion.div
                          className="absolute"
                          style={{
                            top: isMobile ? '35%' : '32%',
                            left: isMobile ? '35%' : '40%',
                            width: isMobile ? '30%' : '25%',
                            height: isMobile ? '15%' : '12%',
                            background: `radial-gradient(ellipse, rgba(255, 255, 0, ${0.3 * (heatmapIntensity / 100)}) 0%, rgba(255, 255, 0, ${0.15 * (heatmapIntensity / 100)}) 50%, transparent 100%)`,
                            borderRadius: '50%',
                            filter: 'blur(10px)'
                          }}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 1, delay: 0.4 }}
                        />

                        {/* Z-Pattern Bottom Horizontal (Stage 2 contribution) */}
                        <motion.div
                          className="absolute"
                          style={{
                            top: isMobile ? '55%' : '52%',
                            left: isMobile ? '12%' : '18%',
                            width: isMobile ? '65%' : '60%',
                            height: isMobile ? '8%' : '6%',
                            background: `radial-gradient(ellipse, rgba(255, 255, 0, ${0.35 * (heatmapIntensity / 100)}) 0%, rgba(255, 255, 0, ${0.18 * (heatmapIntensity / 100)}) 50%, transparent 100%)`,
                            borderRadius: '50%',
                            filter: 'blur(8px)'
                          }}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 1, delay: 0.6 }}
                        />

                        {/* Bottom-Focused Heavy Concentration (Stage 3 contribution) */}
                        <motion.div
                          className="absolute"
                          style={{
                            top: isMobile ? '70%' : '67%',
                            left: isMobile ? '15%' : '20%',
                            width: isMobile ? '60%' : '55%',
                            height: isMobile ? '20%' : '18%',
                            background: `radial-gradient(ellipse, rgba(0, 100, 255, ${0.4 * (heatmapIntensity / 100)}) 0%, rgba(0, 100, 255, ${0.2 * (heatmapIntensity / 100)}) 50%, transparent 100%)`,
                            borderRadius: '50%',
                            filter: 'blur(12px)'
                          }}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 1, delay: 0.8 }}
                        />

                        {/* Small Top Glance Zone (Stage 3 quick top look) */}
                        <motion.div
                          className="absolute"
                          style={{
                            top: isMobile ? '18%' : '15%',
                            left: isMobile ? '25%' : '30%',
                            width: isMobile ? '20%' : '18%',
                            height: isMobile ? '5%' : '4%',
                            background: `radial-gradient(ellipse, rgba(0, 100, 255, ${0.25 * (heatmapIntensity / 100)}) 0%, rgba(0, 100, 255, ${0.12 * (heatmapIntensity / 100)}) 50%, transparent 100%)`,
                            borderRadius: '50%',
                            filter: 'blur(6px)'
                          }}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 1, delay: 1.0 }}
                        />
                      </>
                    )}
                  </AnimatePresence>

                  {/* Animated Eye Tracking Dots with Particle Effects */}
                  <AnimatePresence>
                    {/* Stage 1: Classic F-Pattern Scanner - Systematic top-to-bottom, left-focused */}
                    {eyeTrackingStage === 1 && (
                      <div className="absolute">
                        {/* Main Eye Tracking Dot */}
                        <motion.div
                          className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-red-400 rounded-full z-10"
                          style={{
                            boxShadow: '0 0 15px rgba(255, 100, 100, 0.8), 0 0 30px rgba(255, 100, 100, 0.6), 0 0 45px rgba(255, 100, 100, 0.4)'
                          }}
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: [0, 1, 1, 1, 1, 1, 0.8, 1],
                            scale: [1, 1.2, 1, 1.1, 1, 1.3, 1, 1.1],
                            // F-Pattern: horizontal sweeps at top, then vertical down left side
                            x: isMobile ? [40, 200, 230, 50, 180, 60, 45, 70] : [100, 400, 450, 120, 350, 130, 110, 140],
                            y: isMobile ? [60, 65, 70, 120, 125, 180, 240, 300] : [80, 85, 90, 150, 155, 220, 290, 360]
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 3,
                            times: [0, 0.15, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
                            ease: "easeInOut"
                          }}
                        />
                        
                        {/* Particle Trail Effect */}
                        {Array.from({ length: 8 }).map((_, i) => (
                          <motion.div
                            key={`red-particle-${i}`}
                            className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-red-300 rounded-full"
                            style={{
                              opacity: 0.6 - (i * 0.07),
                              filter: 'blur(1px)'
                            }}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: [0, 0.6 - (i * 0.07), 0.5 - (i * 0.06), 0.6 - (i * 0.07), 0.4 - (i * 0.05), 0.6 - (i * 0.07), 0.3 - (i * 0.04), 0.5 - (i * 0.06)],
                              scale: [0.8, 1, 0.9, 1.1, 0.8, 1.2, 0.9, 1],
                              x: isMobile ? [40, 200, 230, 50, 180, 60, 45, 70] : [100, 400, 450, 120, 350, 130, 110, 140],
                              y: isMobile ? [60, 65, 70, 120, 125, 180, 240, 300] : [80, 85, 90, 150, 155, 220, 290, 360]
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 3,
                              times: [0, 0.15, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
                              ease: "easeInOut",
                              delay: i * 0.08
                            }}
                          />
                        ))}
                        
                        {/* Ambient Glow Particles */}
                        {Array.from({ length: 6 }).map((_, i) => (
                          <motion.div
                            key={`red-glow-${i}`}
                            className="absolute w-1 h-1 bg-red-200 rounded-full"
                            style={{
                              filter: 'blur(2px)'
                            }}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: [0, 0.4, 0.2, 0.6, 0.3, 0.5, 0.1, 0.4],
                              scale: [0.5, 1.5, 0.8, 2, 1, 1.8, 0.6, 1.2],
                              x: isMobile ? 
                                [40 + (Math.sin(i) * 15), 200 + (Math.cos(i) * 20), 230 + (Math.sin(i + 1) * 18), 50 + (Math.cos(i + 2) * 16), 180 + (Math.sin(i + 3) * 22), 60 + (Math.cos(i + 1) * 14), 45 + (Math.sin(i + 2) * 19), 70 + (Math.cos(i + 3) * 17)] : 
                                [100 + (Math.sin(i) * 25), 400 + (Math.cos(i) * 30), 450 + (Math.sin(i + 1) * 28), 120 + (Math.cos(i + 2) * 26), 350 + (Math.sin(i + 3) * 32), 130 + (Math.cos(i + 1) * 24), 110 + (Math.sin(i + 2) * 29), 140 + (Math.cos(i + 3) * 27)],
                              y: isMobile ? 
                                [60 + (Math.cos(i) * 12), 65 + (Math.sin(i) * 15), 70 + (Math.cos(i + 1) * 13), 120 + (Math.sin(i + 2) * 16), 125 + (Math.cos(i + 3) * 14), 180 + (Math.sin(i + 1) * 11), 240 + (Math.cos(i + 2) * 17), 300 + (Math.sin(i + 3) * 13)] :
                                [80 + (Math.cos(i) * 20), 85 + (Math.sin(i) * 25), 90 + (Math.cos(i + 1) * 23), 150 + (Math.sin(i + 2) * 26), 155 + (Math.cos(i + 3) * 24), 220 + (Math.sin(i + 1) * 21), 290 + (Math.cos(i + 2) * 27), 360 + (Math.sin(i + 3) * 23)]
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 3,
                              times: [0, 0.15, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
                              ease: "easeInOut",
                              delay: i * 0.12
                            }}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Stage 2: Z-Pattern Scanner - Top-left to top-right, diagonal, bottom-left to bottom-right */}
                    {eyeTrackingStage === 2 && (
                      <div className="absolute">
                        {/* Main Eye Tracking Dot */}
                        <motion.div
                          className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-yellow-400 rounded-full z-10"
                          style={{
                            boxShadow: '0 0 15px rgba(255, 255, 100, 0.8), 0 0 30px rgba(255, 255, 100, 0.6), 0 0 45px rgba(255, 255, 100, 0.4)'
                          }}
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: [0, 1, 1, 0.9, 1, 0.8, 1, 0.9, 1],
                            scale: [1, 1.3, 1.1, 1.2, 1, 1.4, 1.1, 1.2, 1.1],
                            // Z-Pattern: top-left → top-right → center → bottom-left → bottom-right
                            x: isMobile ? [40, 220, 240, 140, 120, 60, 180, 200, 230] : [100, 450, 480, 300, 250, 130, 380, 420, 460],
                            y: isMobile ? [70, 75, 80, 160, 200, 280, 290, 300, 310] : [90, 95, 100, 200, 250, 340, 350, 360, 370]
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 3.5,
                            times: [0, 0.12, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 1],
                            ease: "easeInOut"
                          }}
                        />
                        
                        {/* Particle Trail Effect */}
                        {Array.from({ length: 10 }).map((_, i) => (
                          <motion.div
                            key={`yellow-particle-${i}`}
                            className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-yellow-300 rounded-full"
                            style={{
                              opacity: 0.7 - (i * 0.06),
                              filter: 'blur(1px)'
                            }}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: [0, 0.7 - (i * 0.06), 0.6 - (i * 0.05), 0.5 - (i * 0.04), 0.7 - (i * 0.06), 0.4 - (i * 0.03), 0.6 - (i * 0.05), 0.5 - (i * 0.04), 0.6 - (i * 0.05)],
                              scale: [0.9, 1.1, 1, 0.8, 1.2, 0.9, 1.1, 1, 1.1],
                              x: isMobile ? [40, 220, 240, 140, 120, 60, 180, 200, 230] : [100, 450, 480, 300, 250, 130, 380, 420, 460],
                              y: isMobile ? [70, 75, 80, 160, 200, 280, 290, 300, 310] : [90, 95, 100, 200, 250, 340, 350, 360, 370]
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 3.5,
                              times: [0, 0.12, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 1],
                              ease: "easeInOut",
                              delay: i * 0.06
                            }}
                          />
                        ))}
                        
                        {/* Sparkling Effect */}
                        {Array.from({ length: 8 }).map((_, i) => (
                          <motion.div
                            key={`yellow-sparkle-${i}`}
                            className="absolute w-1 h-1 bg-yellow-200 rounded-full"
                            style={{
                              filter: 'blur(1.5px)'
                            }}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: [0, 0.8, 0.3, 0.9, 0.2, 0.7, 0.4, 0.6, 0.5],
                              scale: [0.3, 2, 0.8, 2.5, 0.5, 2.2, 1, 1.8, 1.2],
                              rotate: [0, 180, 90, 270, 45, 135, 225, 315, 180],
                              x: isMobile ? 
                                [40 + (Math.sin(i * 2) * 20), 220 + (Math.cos(i * 2) * 25), 240 + (Math.sin(i * 2 + 1) * 22), 140 + (Math.cos(i * 2 + 2) * 18), 120 + (Math.sin(i * 2 + 3) * 24), 60 + (Math.cos(i * 2 + 1) * 16), 180 + (Math.sin(i * 2 + 2) * 21), 200 + (Math.cos(i * 2 + 3) * 19), 230 + (Math.sin(i * 2 + 4) * 17)] : 
                                [100 + (Math.sin(i * 2) * 35), 450 + (Math.cos(i * 2) * 40), 480 + (Math.sin(i * 2 + 1) * 37), 300 + (Math.cos(i * 2 + 2) * 33), 250 + (Math.sin(i * 2 + 3) * 39), 130 + (Math.cos(i * 2 + 1) * 31), 380 + (Math.sin(i * 2 + 2) * 36), 420 + (Math.cos(i * 2 + 3) * 34), 460 + (Math.sin(i * 2 + 4) * 32)],
                              y: isMobile ? 
                                [70 + (Math.cos(i * 2) * 18), 75 + (Math.sin(i * 2) * 20), 80 + (Math.cos(i * 2 + 1) * 19), 160 + (Math.sin(i * 2 + 2) * 17), 200 + (Math.cos(i * 2 + 3) * 21), 280 + (Math.sin(i * 2 + 1) * 15), 290 + (Math.cos(i * 2 + 2) * 18), 300 + (Math.sin(i * 2 + 3) * 16), 310 + (Math.cos(i * 2 + 4) * 14)] :
                                [90 + (Math.cos(i * 2) * 28), 95 + (Math.sin(i * 2) * 30), 100 + (Math.cos(i * 2 + 1) * 29), 200 + (Math.sin(i * 2 + 2) * 27), 250 + (Math.cos(i * 2 + 3) * 31), 340 + (Math.sin(i * 2 + 1) * 25), 350 + (Math.cos(i * 2 + 2) * 28), 360 + (Math.sin(i * 2 + 3) * 26), 370 + (Math.cos(i * 2 + 4) * 24)]
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 3.5,
                              times: [0, 0.12, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 1],
                              ease: "easeInOut",
                              delay: i * 0.1
                            }}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Stage 3: Bottom-Focused Scanner - Scrolls down, focuses on lower content */}
                    {eyeTrackingStage === 3 && (
                      <div className="absolute">
                        {/* Main Eye Tracking Dot */}
                        <motion.div
                          className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-blue-400 rounded-full z-10"
                          style={{
                            boxShadow: '0 0 15px rgba(100, 150, 255, 0.8), 0 0 30px rgba(100, 150, 255, 0.6), 0 0 45px rgba(100, 150, 255, 0.4)'
                          }}
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: [0, 1, 0.9, 1, 0.8, 1, 0.9, 1, 0.8, 1],
                            scale: [1, 1.4, 1, 1.2, 0.9, 1.5, 1.1, 1.3, 0.8, 1.2],
                            // Bottom-focused pattern: quick glance at top, then concentrates on lower areas
                            x: isMobile ? [120, 80, 60, 180, 220, 140, 200, 100, 180, 160] : [250, 150, 130, 380, 450, 300, 420, 200, 380, 340],
                            y: isMobile ? [70, 280, 320, 300, 280, 340, 320, 360, 340, 380] : [90, 330, 380, 360, 330, 400, 380, 420, 400, 440]
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 3.5,
                            times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.85, 1],
                            ease: "easeInOut"
                          }}
                        />
                        
                        {/* Energetic Particle Trail */}
                        {Array.from({ length: 12 }).map((_, i) => (
                          <motion.div
                            key={`blue-particle-${i}`}
                            className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-blue-300 rounded-full"
                            style={{
                              opacity: 0.8 - (i * 0.05),
                              filter: 'blur(1px)'
                            }}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: [0, 0.8 - (i * 0.05), 0.6 - (i * 0.04), 0.9 - (i * 0.06), 0.4 - (i * 0.03), 0.7 - (i * 0.05), 0.5 - (i * 0.04), 0.8 - (i * 0.06), 0.3 - (i * 0.02), 0.6 - (i * 0.04)],
                              scale: [0.7, 1.2, 0.9, 1.4, 0.8, 1.3, 1, 1.5, 0.6, 1.1],
                              x: isMobile ? [120, 80, 60, 180, 220, 140, 200, 100, 180, 160] : [250, 150, 130, 380, 450, 300, 420, 200, 380, 340],
                              y: isMobile ? [70, 280, 320, 300, 280, 340, 320, 360, 340, 380] : [90, 330, 380, 360, 330, 400, 380, 420, 400, 440]
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 3.5,
                              times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.85, 1],
                              ease: "easeInOut",
                              delay: i * 0.05
                            }}
                          />
                        ))}
                        
                        {/* Electric Blue Emanation */}
                        {Array.from({ length: 10 }).map((_, i) => (
                          <motion.div
                            key={`blue-emanation-${i}`}
                            className="absolute w-1 h-1 bg-blue-200 rounded-full"
                            style={{
                              filter: 'blur(2px)'
                            }}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: [0, 0.9, 0.2, 0.8, 0.3, 0.9, 0.1, 0.7, 0.4, 0.6],
                              scale: [0.2, 3, 1, 2.8, 0.8, 3.2, 0.5, 2.5, 1.2, 2],
                              x: isMobile ? 
                                [120 + (Math.sin(i * 3) * 25), 80 + (Math.cos(i * 3) * 30), 60 + (Math.sin(i * 3 + 1) * 28), 180 + (Math.cos(i * 3 + 2) * 26), 220 + (Math.sin(i * 3 + 3) * 32), 140 + (Math.cos(i * 3 + 1) * 24), 200 + (Math.sin(i * 3 + 2) * 29), 100 + (Math.cos(i * 3 + 3) * 27), 180 + (Math.sin(i * 3 + 4) * 31), 160 + (Math.cos(i * 3 + 4) * 23)] : 
                                [250 + (Math.sin(i * 3) * 40), 150 + (Math.cos(i * 3) * 45), 130 + (Math.sin(i * 3 + 1) * 43), 380 + (Math.cos(i * 3 + 2) * 41), 450 + (Math.sin(i * 3 + 3) * 47), 300 + (Math.cos(i * 3 + 1) * 39), 420 + (Math.sin(i * 3 + 2) * 44), 200 + (Math.cos(i * 3 + 3) * 42), 380 + (Math.sin(i * 3 + 4) * 46), 340 + (Math.cos(i * 3 + 4) * 38)],
                              y: isMobile ? 
                                [70 + (Math.cos(i * 3) * 22), 280 + (Math.sin(i * 3) * 25), 320 + (Math.cos(i * 3 + 1) * 24), 300 + (Math.sin(i * 3 + 2) * 23), 280 + (Math.cos(i * 3 + 3) * 26), 340 + (Math.sin(i * 3 + 1) * 21), 320 + (Math.cos(i * 3 + 2) * 24), 360 + (Math.sin(i * 3 + 3) * 22), 340 + (Math.cos(i * 3 + 4) * 25), 380 + (Math.sin(i * 3 + 4) * 20)] :
                                [90 + (Math.cos(i * 3) * 35), 330 + (Math.sin(i * 3) * 40), 380 + (Math.cos(i * 3 + 1) * 38), 360 + (Math.sin(i * 3 + 2) * 36), 330 + (Math.cos(i * 3 + 3) * 41), 400 + (Math.sin(i * 3 + 1) * 34), 380 + (Math.cos(i * 3 + 2) * 37), 420 + (Math.sin(i * 3 + 3) * 35), 400 + (Math.cos(i * 3 + 4) * 39), 440 + (Math.sin(i * 3 + 4) * 33)]
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 3.5,
                              times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.85, 1],
                              ease: "easeInOut",
                              delay: i * 0.08
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Unconscious Behavior Patterns - Research Section */}
              {targetId === 'research' && unconsciousBehaviorStage > 0 && (
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

                  {/* Fingerprint Touch Patterns */}
                  <AnimatePresence>
                    {unconsciousBehaviorStage === 3 && (
                      <>
                        {/* Primary fingerprint zone with graphic on left */}
                        <motion.div
                          className="absolute right-8 sm:right-16 md:right-24 lg:right-32 flex items-start space-x-3"
                          style={{ bottom: 'calc(32rem - 100px)' }} // 100px higher than before
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
                          {/* Realistic Fingerprint Graphic */}
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
                              {/* Realistic fingerprint ridges using curved paths */}
                              <path d="M24 6 C16 6, 10 12, 10 20 C10 28, 16 34, 24 34 C32 34, 38 28, 38 20 C38 12, 32 6, 24 6" 
                                    stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" fill="none"/>
                              <path d="M24 8 C17 8, 12 13, 12 20 C12 27, 17 32, 24 32 C31 32, 36 27, 36 20 C36 13, 31 8, 24 8" 
                                    stroke="rgba(255,255,255,0.6)" strokeWidth="0.7" fill="none"/>
                              <path d="M24 10 C18 10, 14 14, 14 20 C14 26, 18 30, 24 30 C30 30, 34 26, 34 20 C34 14, 30 10, 24 10" 
                                    stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" fill="none"/>
                              <path d="M24 12 C19 12, 16 15, 16 20 C16 25, 19 28, 24 28 C29 28, 32 25, 32 20 C32 15, 29 12, 24 12" 
                                    stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" fill="none"/>
                              <path d="M24 14 C20 14, 18 16, 18 20 C18 24, 20 26, 24 26 C28 26, 30 24, 30 20 C30 16, 28 14, 24 14" 
                                    stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" fill="none"/>
                              <path d="M24 16 C21 16, 20 17, 20 20 C20 23, 21 24, 24 24 C27 24, 28 23, 28 20 C28 17, 27 16, 24 16" 
                                    stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" fill="none"/>
                              
                              {/* Characteristic fingerprint features */}
                              <path d="M15 18 Q18 16, 21 18" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" fill="none"/>
                              <path d="M27 18 Q30 16, 33 18" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" fill="none"/>
                              <path d="M19 22 Q21 24, 23 22" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3" fill="none"/>
                              <path d="M25 22 Q27 24, 29 22" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3" fill="none"/>
                              
                              {/* Central core */}
                              <circle cx="24" cy="20" r="2" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" fill="none"/>
                              <circle cx="24" cy="20" r="1" fill="rgba(255,255,255,0.4)"/>
                            </svg>
                          </motion.div>
                          
                          {/* Text Container */}
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
                        
                        {/* Secondary fingerprint zone */}
                        <motion.div
                          className="absolute left-8 sm:left-16 md:left-24 lg:left-32 flex items-start space-x-2"
                          style={{ bottom: 'calc(48rem - 100px)' }} // 100px higher than before
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ 
                            opacity: 1, 
                            scale: [1, 1.02, 1],
                          }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ 
                            opacity: { duration: 0.6, delay: 0.3 },
                            scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                          }}
                        >
                          {/* Smaller Fingerprint Graphic */}
                          <motion.div
                            className="w-10 h-10 flex-shrink-0"
                            animate={{ 
                              scale: [1, 1.03, 1],
                            }}
                            transition={{ 
                              duration: 2.8, 
                              repeat: Infinity, 
                              ease: "easeInOut",
                              delay: 0.3
                            }}
                          >
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 40 40"
                              className="opacity-70"
                            >
                              {/* Smaller fingerprint ridges */}
                              <path d="M20 5 C14 5, 9 10, 9 16 C9 22, 14 27, 20 27 C26 27, 31 22, 31 16 C31 10, 26 5, 20 5" 
                                    stroke="rgba(255,255,255,0.6)" strokeWidth="0.7" fill="none"/>
                              <path d="M20 7 C15 7, 11 11, 11 16 C11 21, 15 25, 20 25 C25 25, 29 21, 29 16 C29 11, 25 7, 20 7" 
                                    stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" fill="none"/>
                              <path d="M20 9 C16 9, 13 12, 13 16 C13 20, 16 23, 20 23 C24 23, 27 20, 27 16 C27 12, 24 9, 20 9" 
                                    stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" fill="none"/>
                              <path d="M20 11 C17 11, 15 13, 15 16 C15 19, 17 21, 20 21 C23 21, 25 19, 25 16 C25 13, 23 11, 20 11" 
                                    stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" fill="none"/>
                              
                              {/* Central features */}
                              <path d="M13 14 Q15 13, 17 14" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3" fill="none"/>
                              <path d="M23 14 Q25 13, 27 14" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3" fill="none"/>
                              
                              <circle cx="20" cy="16" r="1.5" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" fill="none"/>
                              <circle cx="20" cy="16" r="0.8" fill="rgba(255,255,255,0.3)"/>
                            </svg>
                          </motion.div>
                          
                          {/* Text Container */}
                          <motion.div
                            className="rounded-lg backdrop-blur-sm border border-white/15 px-2 py-1.5 max-w-[120px]"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            }}
                          >
                                                         <motion.p 
                               className="font-medium text-white text-xs leading-tight"
                               animate={{ opacity: [1, 0.7, 1] }}
                               transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                             >
                               Secondary Zone
                             </motion.p>
                             <p className="text-xs text-white/60 mt-0.5">{isMobile ? 'Occasional taps' : 'Less frequent clicks'}</p>
                          </motion.div>
                        </motion.div>
                        
                        {/* Main Label - Repositioned */}
                        <motion.div
                          className="absolute left-1/2 transform -translate-x-1/2 rounded-lg backdrop-blur-sm border border-white/20 px-4 py-3 text-center"
                          style={{ 
                            bottom: 'calc(12rem - 100px)', // 100px higher than before
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                          }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.6, delay: 0.8 }}
                        >
                          <motion.p 
                            className="font-medium mb-1 text-white text-sm"
                            animate={{ opacity: [1, 0.7, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            {isMobile ? 'Unconscious Touch Patterns' : 'Primary Click Patterns'}
                          </motion.p>
                          <p className="text-xs text-white/80">{isMobile ? 'Users tap here without thinking' : 'Users click here most frequently'}</p>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Thumb Flow Overlay - Mobile Only */}
              {targetId === 'ergonomics' && isMobile && thumbFlowStage > 0 && (
                <div className="absolute inset-0 pointer-events-none z-0">
                  {/* Green Zone - Easiest area (bottom right) */}
                  <AnimatePresence>
                    {thumbFlowStage >= 1 && (
                      <motion.div
                        className="absolute"
                        style={{
                          ...getThumbFlowZoneStyle('green'),
                          backgroundColor: 'rgba(34, 197, 94, 0.3)',
                          borderRadius: '60% 40% 50% 70%',
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
                          ...getThumbFlowZoneStyle('yellow'),
                          backgroundColor: 'rgba(234, 179, 8, 0.3)',
                          borderRadius: '50% 60% 40% 70%',
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
                          ...getThumbFlowZoneStyle('orange'),
                          backgroundColor: 'rgba(249, 115, 22, 0.3)',
                          borderRadius: '70% 50% 60% 40%',
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
                            ...getThumbFlowZoneStyle('red1'),
                            backgroundColor: 'rgba(239, 68, 68, 0.4)',
                            borderRadius: '80% 60% 40% 70%',
                          }}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.8 }}
                        />
                        <motion.div
                          className="absolute"
                          style={{
                            ...getThumbFlowZoneStyle('red2'),
                            backgroundColor: 'rgba(239, 68, 68, 0.4)',
                            borderRadius: '60% 80% 70% 40%',
                          }}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        />
                        <motion.div
                          className="absolute"
                          style={{
                            ...getThumbFlowZoneStyle('red3'),
                            backgroundColor: 'rgba(239, 68, 68, 0.3)',
                            borderRadius: '40% 70% 80% 50%',
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
              <div className="absolute bottom-0 left-0 right-0 pb-8 flex justify-center z-10">
                <div className="h-24 flex items-center">
                  {/* Empty space to maintain consistent layout across all sections */}
                  <div className="h-full w-full"></div>
                </div>
              </div>

              {/* Rhodopsin Loader - Fixed position 100px from bottom - Only show on current section */}
              {rhodopsinMessage && !dismissedLoaders.includes(targetId) && currentSection === targetId && (
                <div className="fixed left-0 right-0 flex justify-center z-20" style={{ bottom: '100px' }}>
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
                </div>
              )}
            </section>
          );
        })}
      </main>
    </div>
  );
}

export default App;
