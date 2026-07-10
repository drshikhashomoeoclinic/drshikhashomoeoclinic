export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lora', 'Georgia', 'serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif']
      },
      colors: {
        clinic: {
          emerald: '#1E5A37',
          emeraldDark: '#123A25',
          gold: '#D4AF37',
          cream: '#F7F5EE',
          blue: '#315C74',
          ink: '#222222',
          soft: '#F7F5EE'
        }
      },
      boxShadow: {
        luxury: '0 28px 90px rgba(34, 34, 34, 0.14)',
        glass: '0 18px 56px rgba(30, 90, 55, 0.10)',
        glow: '0 22px 70px rgba(212, 175, 55, 0.18)'
      }
    }
  },
  plugins: []
};
