import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

function AkApp() {
  const isMobile = window.innerWidth < 768
  return (
    <div className="font-futuristic relative">
      <div className="fixed inset-0 z-10 pointer-events-none bg-black/40"></div>
      <main className="relative">
        <section
          id="ak-aurikinetics"
          className="snap-section flex flex-col snap-start relative min-h-screen bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/ak-1.jpg)',
            backgroundSize: isMobile ? 'cover' : '100% auto',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: isMobile ? 'scroll' : 'fixed'
          }}
        >
          <div className="flex-1 flex items-center justify-center relative z-20 px-4 -mt-16 sm:-mt-12">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-kudryashev text-white drop-shadow-xl tracking-wide uppercase whitespace-nowrap mb-4">
                AuraKinetics
              </div>
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-widest text-white/90 uppercase font-ivymode mb-2">
                A Revolutionary Approach to Body Assessment
              </div>
              <div className="text-base sm:text-lg md:text-xl text-white/90 font-ivymode">
                Offered through Yunasai Ministries
              </div>
            </div>
          </div>
        </section>

        <section
          id="ak-what"
          className="snap-section flex flex-col snap-start relative min-h-screen bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/muscle+testing.jpg)',
            backgroundSize: isMobile ? 'cover' : '100% auto',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: isMobile ? 'scroll' : 'fixed'
          }}
        >
          <div className="flex-1 flex items-center justify-center relative z-20 px-4 -mt-16 sm:-mt-12">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <p className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[20px] sm:text-2xl lg:text-4xl">
                Aurakinetics is a non-invasive, integrative art that combines facial analysis, iridology, and advanced muscle testing to identify the best healing path for your body.
              </p>
            </div>
          </div>
        </section>

        <section
          id="ak-how"
          className="snap-section flex flex-col snap-start relative min-h-screen bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/DSC09936.jpeg)',
            backgroundSize: isMobile ? 'cover' : '100% auto',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: isMobile ? 'scroll' : 'fixed'
          }}
        >
          <div className="flex-1 flex items-center justify-center relative z-20 px-4 -mt-16 sm:-mt-12">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <p className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[20px] sm:text-2xl lg:text-4xl">
                We assess the body’s electrical circuitry in real time–  No guesswork, just pure bio-intelligence.
              </p>
            </div>
          </div>
        </section>

        <section
          id="ak-root"
          className="snap-section flex flex-col snap-start relative min-h-screen bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/supliful-supplements-on-demand-UTPZnnEVW4E-unsplash.jpg)',
            backgroundSize: isMobile ? 'cover' : '100% auto',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: isMobile ? 'scroll' : 'fixed'
          }}
        >
          <div className="flex-1 flex items-center justify-center relative z-20 px-4 -mt-16 sm:-mt-12">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <p className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[20px] sm:text-2xl lg:text-4xl">
                We go beyond “fixing” symptoms to get to the root of what is ailing you.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

const isAk = window.location.pathname === '/aurakinetics'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAk ? <AkApp /> : <App />}
  </StrictMode>,
)

// Register service worker for PWA functionality
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
