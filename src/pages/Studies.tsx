import { useState } from 'react';

interface StudiesProps {
  isMobile: boolean;
}

const Studies: React.FC<StudiesProps> = ({ isMobile }) => {
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
          <h2 className="text-3xl sm:text-4xl font-bold">Studies</h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-300">
            Deep interviews with target and non target archetypes. Day in the life and affinity mapping, and most simply, understanding the user before they even use your product so it's tuned to their habits, unconciouss interactions, and expectations.
          </p>
          {/* Research Pattern Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
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
          </div>
        </div>
      </div>

      {/* Research Pattern Modal */}
      {researchPatternModalOpen && selectedResearchPattern && researchPatternContent[selectedResearchPattern] && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setResearchPatternModalOpen(false);
            setSelectedResearchPattern(null);
          }}
        >
          <div
            className="rounded-lg p-6 max-w-md w-full mx-4 relative bg-black text-white border border-white/20"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Studies; 