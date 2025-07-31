/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        'space-mono': ['Space Mono', 'monospace'],
        'jetbrains-mono': ['JetBrains Mono', 'monospace'],
        'fira-code': ['Fira Code', 'monospace'],
        'bit': ['Space Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
        'press-start': ['Press Start 2P', 'cursive'],
        'vt323': ['VT323', 'monospace'],
        'share-tech-mono': ['Share Tech Mono', 'monospace'],
        'chakra-petch': ['Chakra Petch', 'sans-serif'],
        'audiowide': ['Audiowide', 'cursive'],
        'caveat': ['Caveat', 'cursive'],
        'bit-art': ['Press Start 2P', 'VT323', 'Share Tech Mono', 'monospace'],
        'exo-2': ['Exo 2', 'sans-serif'],
        'michroma': ['Michroma', 'sans-serif'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
        'black-ops': ['Black Ops One', 'cursive'],
        'russo': ['Russo One', 'sans-serif'],
        'futuristic': ['Exo 2', 'Michroma', 'Rajdhani', 'Orbitron', 'sans-serif'],
        'ivymode': ['Ivy Mode', 'serif'],
      },
      colors: {
        'bitcoin-orange': '#F7931A',
        'nostr-purple': '#8E44AD',
        'secondary-black': '#1D1D1D',
        'light-gray': '#FAFAFA',
      },
      keyframes: {
        typing: {
          "0%": {
            width: "0%",
            visibility: "hidden"
          },
          "100%": {
            width: "100%"
          }
        },
        "blink": {
          "50%": {
            borderColor: "transparent"
          },
          "100%": {
            borderColor: "white"
          }
        }
      },
      animation: {
        typing: "typing 2s steps(20) infinite alternate, blink .7s infinite"
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
} 