const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {        
        slate: colors.slate,        
        orange: colors.orange,    
      },
      fill: {
        black: '#000',
        white: '#fff'
      }
    },
  },
  variants: {
    extend: {
      fill: ['dark'],
    }
  },
  plugins: [],
}
