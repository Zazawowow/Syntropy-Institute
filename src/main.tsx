import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

function AkApp() {
  return (
    <div className="font-futuristic relative bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: 'url(/ak-1.jpg)',
      backgroundSize: '100% auto',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: window.innerWidth < 768 ? 'scroll' : 'fixed'
    }}>
      <div className="fixed inset-0 z-10 pointer-events-none bg-black/40"></div>
      <main className="min-h-screen flex items-center justify-center relative z-20 px-4">
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
