import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'
import App from './App.tsx'

function AkApp() {
  const isMobile = window.innerWidth < 768
  const [akLightbox, setAkLightbox] = useState<{ title: string, content: string } | null>(null)
  const [akSection, setAkSection] = useState<'ak-aurikinetics' | 'ak-what' | 'ak-how' | 'ak-root' | 'ak-method'>('ak-aurikinetics')

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
  }

  useEffect(() => {
    const ids = ['ak-aurikinetics', 'ak-what', 'ak-how', 'ak-root', 'ak-method']
    const sentinelIds = ids.map(id => `${id}-sentinel`)

    const computeActive = () => {
      const viewportCenter = window.innerHeight / 2
      let bestId = akSection
      let bestDistance = Number.POSITIVE_INFINITY

      for (const id of sentinelIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const distance = Math.abs(center - viewportCenter)
        if (distance < bestDistance) {
          bestDistance = distance
          bestId = id.replace('-sentinel', '') as typeof akSection
        }
      }

      if (bestId && bestId !== akSection) setAkSection(bestId)
    }

    window.addEventListener('scroll', computeActive, { passive: true })
    window.addEventListener('resize', computeActive)
    computeActive()
    return () => {
      window.removeEventListener('scroll', computeActive)
      window.removeEventListener('resize', computeActive)
    }
  }, [akSection])

  const getAkBackground = (section: typeof akSection) => {
    const map: Record<typeof akSection, string> = {
      'ak-aurikinetics': "url(/ak-1.jpg)",
      'ak-what': "url(/muscle+testing.jpg)",
      'ak-how': "url(/DSC09936.jpeg)",
      'ak-root': "url(/supliful-supplements-on-demand-UTPZnnEVW4E-unsplash.jpg)",
      'ak-method': "url(/ak-1.jpg)"
    }
    return map[section]
  }

  return (
    <div className="ak-root font-futuristic relative bg-cover bg-center bg-no-repeat">
      {/* Fixed background that updates with active section */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: getAkBackground(akSection),
          backgroundSize: isMobile ? 'cover' : '100% auto',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <div className="fixed inset-0 z-10 pointer-events-none bg-black/40"></div>

      <header className="sticky top-0 z-50 transition-all duration-1000 ease-in-out bg-transparent relative" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="relative flex h-16 items-center justify-between px-4 sm:h-24 sm:block sm:px-0">
          <a href="/">
            <div className="text-lg sm:text-xl font-ivymode font-light sm:absolute sm:top-8 sm:left-8 transition-colors duration-300 text-white uppercase tracking-wide">
              Syntropy.Institute
            </div>
          </a>
          <nav className="hidden sm:flex sm:absolute sm:top-8 sm:right-8 items-center space-x-8 text-lg font-medium transition-colors duration-300 text-white relative">
            {[
              { id: 'ak-aurikinetics', label: 'Aurikinetics' },
              { id: 'ak-what', label: 'What' },
              { id: 'ak-how', label: 'How' },
              { id: 'ak-root', label: 'Root' },
              { id: 'ak-method', label: 'Method' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleAnchor(e, item.id)}
                className="cursor-pointer transition-colors relative hover:text-gray-300"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="-mt-16 sm:-mt-24 relative">
        <section id="ak-aurikinetics" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="ak-aurikinetics-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
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

        <section id="ak-what" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="ak-what-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <p className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[20px] sm:text-2xl lg:text-4xl">
                Aurakinetics is a non-invasive, integrative art that combines facial analysis, iridology, and advanced muscle testing to identify the best healing path for your body.
              </p>
            </div>
          </div>
        </section>

        <section id="ak-how" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="ak-how-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <p className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[20px] sm:text-2xl lg:text-4xl">
                We assess the body’s electrical circuitry in real time–  No guesswork, just pure bio-intelligence.
              </p>
            </div>
          </div>
        </section>

        <section id="ak-root" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="ak-root-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <p className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[20px] sm:text-2xl lg:text-4xl">
                We go beyond “fixing” symptoms to get to the root of what is ailing you.
              </p>
            </div>
          </div>
        </section>

        <section id="ak-method" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="ak-method-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-kudryashev font-light text-white drop-shadow-xl tracking-wide uppercase mx-auto text-center">
                The AuraKinetics® Method
              </h2>
              <p className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[20px] sm:text-2xl lg:text-3xl">
                "Discover the root causes of imbalances in your body and the exact steps to bring it back into alignment."
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[{
                  icon: '/ak-icon-1.webp',
                  title: 'Manual Kinetic Assessment',
                  content: 'Aurakinetics involves a two-part assessment. First, we scan vitamin and mineral levels, as well as identify ALL organ and gland imbalances or congestion. Next, using our cutting-edge Kinesiological Tracing Method® to pinpoint exactly what your body needs to restore balance.'
                }, {
                  icon: '/ak-icon-2.webp',
                  title: 'Herbs & Supplementation',
                  content: 'Personalized herb and supplement recommendations to support your body\'s healing based on your unique assessment.'
                }, {
                  icon: '/ak-icon-3.webp',
                  title: 'Personal Wellness Plan',
                  content: 'After your session, you’ll receive a full protocol with your recommended herbs and supplements, as well as a daily regimen of other practices and suggestions.'
                }].map((item) => (
                  <div key={item.title} className="flex flex-col items-center text-center">
                    <img src={item.icon} alt="" className="w-20 h-20 object-contain mb-3 select-none pointer-events-none" />
                    <motion.button
                      onClick={() => setAkLightbox({ title: item.title, content: item.content })}
                      className="px-4 py-2 text-base sm:text-lg font-medium border-2 border-white/80 rounded-full transition-all duration-300 hover:bg-white/20 text-white/90 hover:text-white bg-transparent backdrop-blur-sm w-full sm:w-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.title}
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {akLightbox && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAkLightbox(null)}
            style={{ backgroundImage: 'url(/syntropy.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/60"></div>

            <motion.div
              className="relative max-w-4xl max-h[85vh] mx-4 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-3xl"></div>

              <button
                onClick={() => setAkLightbox(null)}
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

              <motion.div className="p-10 sm:p-14 text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                <motion.h3 className="text-3xl sm:text-4xl lg:text-5xl font-ivymode font-light text-white mb-3 tracking-wider drop-shadow-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
                  {akLightbox.title}
                </motion.h3>
                <motion.p className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-white/95 max-w-3xl mx-auto drop-shadow-lg font-rajdhani" style={{ lineHeight: '1.8' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
                  {akLightbox.content}
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}
