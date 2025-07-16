// This is a placeholder component for now
// The full App.tsx content will be moved here later

interface HomeProps {
  isMobile: boolean;
}

const Home: React.FC<HomeProps> = () => {
  
  // This is a placeholder - the actual component will be much larger
  // For now, I'll just return a simple version to get routing working
  return (
    <div className="bg-white font-orbitron">
      <main className="-mt-16 sm:-mt-24">
        <section id="anatomy" className="snap-section flex items-center justify-center overflow-hidden relative px-4 sm:px-0 bg-white snap-start min-h-screen">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl sm:text-8xl md:text-9xl font-bold text-black">
              PROUX
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home; 