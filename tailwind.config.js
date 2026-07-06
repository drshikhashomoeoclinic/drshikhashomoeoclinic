export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Poppins', 'sans-serif']
      },
      colors: {
        clinic: {
          emerald: '#047857',
          emeraldDark: '#064e3b',
          blue: '#1d4ed8',
          ink: '#10231f',
          soft: '#f6f8fb'
        }
      },
      boxShadow: {
        luxury: '0 24px 70px rgba(15, 35, 31, 0.12)',
        glass: '0 18px 48px rgba(15, 35, 31, 0.08)'
      }
    }
  },
  plugins: []
};
