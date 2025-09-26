import { StrictMode, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'

function ServicesApp() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isPhone, setIsPhone] = useState(window.innerWidth < 640)
  const [servicesLightbox, setServicesLightbox] = useState<{ title: string, content: string } | null>(null)
  const [servicesSection, setServicesSection] = useState<'services-overview' | 'services-frequency' | 'services-kinetics' | 'services-concierge' | 'services-membership'>('services-overview')

  useEffect(() => {
    const checkResponsive = () => {
      setIsMobile(window.innerWidth < 768)
      setIsPhone(window.innerWidth < 640)
    }
    checkResponsive()
    window.addEventListener('resize', checkResponsive)
    return () => window.removeEventListener('resize', checkResponsive)
  }, [])

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
  }

  // Robust section detection: IntersectionObserver with sentinels and top-of-page override
  useEffect(() => {
    const ids = ['services-overview', 'services-frequency', 'services-kinetics', 'services-concierge', 'services-membership'] as const
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the greatest intersection ratio
        let best: { id: typeof ids[number], ratio: number } | null = null
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id.replace('-sentinel', '') as typeof ids[number]
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { id, ratio: entry.intersectionRatio }
          }
        }
        if (best && best.ratio > 0.45 && best.id !== servicesSection) {
          setServicesSection(best.id)
        }
      },
      {
        // Focus the middle band of the viewport to avoid header influence
        root: null,
        rootMargin: '-30% 0px -30% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    )

    for (const id of ids) {
      const el = document.getElementById(`${id}-sentinel`)
      if (el) observer.observe(el)
    }

    const topOverride = () => {
      if (window.scrollY < 80 && servicesSection !== 'services-overview') setServicesSection('services-overview')
    }
    window.addEventListener('scroll', topOverride, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', topOverride)
    }
  }, [servicesSection])

  const getServicesBackground = (section: typeof servicesSection) => {
    const map: Record<typeof servicesSection, string> = {
      'services-overview': "url(/4.jpg)",
      'services-frequency': "url(/services-2.jpg)",
      'services-kinetics': "url(/3.jpg)",
      'services-concierge': "url(/5.jpg)",
      'services-membership': "url(/6.jpg)"
    }
    return map[section]
  }

  const getServicesMobileSrc = (section: typeof servicesSection) => {
    const map: Record<typeof servicesSection, string> = {
      'services-overview': "/mobile-4.jpg",
      'services-frequency': "/services-2.jpg",
      'services-kinetics': "/mobile-3.jpg",
      'services-concierge': "/mobile-5.jpg",
      'services-membership': "/mobile-6.jpg"
    }
    return map[section]
  }

  return (
    <div className="services-root font-futuristic relative bg-cover bg-center bg-no-repeat">
      {/* Background layer - desktop/tablet uses CSS background; phones use dedicated <img> */}
      {!isPhone ? (
        servicesSection !== 'services-frequency' && (
          <div
            key={servicesSection}
            className="fixed inset-0 z-0"
            style={{
              backgroundImage: getServicesBackground(servicesSection),
              backgroundSize: isMobile ? 'cover' : '100% auto',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        )
      ) : (
        <img
          key={servicesSection}
          src={getServicesMobileSrc(servicesSection)}
          alt=""
          className="fixed inset-0 z-0 w-full h-[100vh] object-cover object-center pointer-events-none select-none"
          decoding="async"
          loading="eager"
        />
      )}

      <div className={`fixed inset-0 z-10 pointer-events-none ${servicesSection === 'services-frequency' ? 'bg-transparent' : 'bg-black/50'}`}></div>

      <header className="sticky top-0 z-50 transition-all duration-1000 ease-in-out bg-transparent relative" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="relative flex h-16 items-center justify-between px-4 sm:h-24 sm:block sm:px-0">
          <a href="/">
            <div className="text-lg sm:text-xl font-ivymode font-light sm:absolute sm:top-8 sm:left-8 transition-colors duration-300 text-white uppercase tracking-wide">
              Syntropy.Institute
            </div>
          </a>
          <nav className="hidden sm:flex sm:absolute sm:top-8 sm:right-8 items-center space-x-8 text-lg font-medium transition-colors duration-300 text-white relative">
            {[
              { id: 'services-overview', label: 'Overview' },
              { id: 'services-frequency', label: 'Frequency' },
              { id: 'services-kinetics', label: 'Kinetics' },
              { id: 'services-concierge', label: 'Concierge' },
              { id: 'services-membership', label: 'Membership' },
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
        <section id="services-overview" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="services-overview-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-kudryashev text-white drop-shadow-xl tracking-wide uppercase whitespace-nowrap mb-4">
                AuraKinetics
              </div>
              <div className="text-base sm:text-xl md:text-2xl lg:text-3xl tracking-widest text-white/90 uppercase font-ivymode mb-2">
                AuraKinetics + Syntropy Frequency
              </div>
            </div>
          </div>
        </section>

        <section id="services-frequency" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="services-frequency-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-kudryashev font-light text-white drop-shadow-xl tracking-wide uppercase mx-auto text-center mb-6">
                What it is
              </h2>
              <div className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[16px] sm:text-lg lg:text-xl">
                <p className="mb-4">
                  This advanced integrative service combines AuraKinetics® and Frequency Analysis-Therapy to provide deep insights into the root causes of imbalance and chronic dysfunction—bridging manual diagnostics with frequency-based healing.
                </p>
                <p>
                  Using cutting-edge, non-invasive techniques, we analyze the human biofield to identify core blockages and inefficiencies. Then, through precise energetic frequencies, we guide the body toward optimal function, self-regulation, and accelerated healing.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="services-kinetics" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative overflow-hidden">
          <div id="services-kinetics-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-kudryashev font-light text-white drop-shadow-xl tracking-wide uppercase mx-auto text-center mb-6">
                Manual Kinetics
              </h2>
              <p className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[18px] sm:text-2xl lg:text-3xl">
                "Syntropy Manual Kinetics is the science of biological optimization, integrating advanced muscle testing, facial analysis, iridology, and manual field diagnostics to assess the body's structural and functional condition."
              </p>
            </div>
          </div>
        </section>

        <section id="services-concierge" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="services-concierge-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-kudryashev font-light text-white drop-shadow-xl tracking-wide uppercase mx-auto text-center mb-6">
                Syntropy Concierge
              </h2>
              <p className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[18px] sm:text-2xl lg:text-3xl">
                "The individualized protocol developed through Kinetic assessment and frequency analysis will be seamlessly integrated into your daily lifestyle—including nutrition, supplementation, herbal support, and movement practices tailored to your unique needs and goals."
              </p>
            </div>
          </div>
        </section>

        <section id="services-membership" className="snap-section flex flex-col snap-start min-h-screen bg-transparent relative">
          <div id="services-membership-sentinel" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px opacity-0" />
          <div className="flex-1 flex items-center justify-center relative z-20 overflow-hidden -mt-16 sm:-mt-12 px-4">
            <div className="text-center max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto px-2 sm:px-4">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-kudryashev font-light text-white drop-shadow-xl tracking-wide uppercase mx-auto text-center mb-6">
                Membership & Terms
              </h2>
              <p className="mt-4 leading-relaxed text-white/95 drop-shadow-lg font-playfair font-light text-center px-2 sm:px-8 text-[18px] sm:text-2xl lg:text-3xl">
                "Our services are exclusively available through the Yunasai Ministry. By engaging with us, you automatically join our Private Membership Association. Learn more about membership and terms."
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[{
                  icon: '/ak-icon-1.webp',
                  title: 'Private Membership',
                  content: 'All services are provided through our Private Membership Association under ecclesiastical law, ensuring your privacy and protection while accessing cutting-edge healing modalities.'
                }, {
                  icon: '/ak-icon-2.webp',
                  title: 'Individualized Protocols',
                  content: 'Each client receives a completely personalized protocol based on their unique biological assessment, ensuring optimal results for their specific needs.'
                }, {
                  icon: '/ak-icon-3.webp',
                  title: 'Ongoing Support',
                  content: 'Continuous monitoring and adjustment of your protocol as your body responds and heals, with full support throughout your wellness journey.'
                }].map((item) => (
                  <div key={item.title} className="flex flex-col items-center text-center">
                    <img src={item.icon} alt="" className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-3 select-none pointer-events-none" />
                    <motion.button
                      onClick={() => setServicesLightbox({ title: item.title, content: item.content })}
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
        {servicesLightbox && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setServicesLightbox(null)}
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
                onClick={() => setServicesLightbox(null)}
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
                  {servicesLightbox.title}
                </motion.h3>
                <motion.p className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-white/95 max-w-3xl mx-auto drop-shadow-lg font-rajdhani" style={{ lineHeight: '1.8' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
                  {servicesLightbox.content}
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ServicesApp
