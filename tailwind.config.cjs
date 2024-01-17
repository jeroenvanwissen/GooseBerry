const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./src/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      textShadow: {
        DEFAULT: '2px 2px 1px var(--tw-shadow-color)'
      },
      colors: {
        primary: {
            50: '#F1FAFE',
            100: '#C1EBFB',
            200: '#92DCF7',
            300: '#62CDF4',
            400: '#32BDF0',
            500: '#10A8E0',
            600: '#0D84B0',
            700: '#096081',
            800: '#063D51',
            900: '#021921'
        },
        secondary: {
            50: '#F7FCEE',
            100: '#E2F4C2',
            200: '#B8E56B',
            300: '#B8E56B',
            400: '#A3DE40',
            500: '#8CCA23',
            600: '#6C9C1B',
            700: '#4E7114',
            800: '#30460C',
            900: '#121A05'
        },
        tertiary: {
            50: '#fad6d6',
            100: '#f5a8a8',
            200: '#f07a7a',
            300: '#eb4c4c',
            400: '#e61f1f',
            500: '#bc1515',
            600: '#8e1010',
            700: '#600b0b',
            800: '#330606',
            900: '#050101'
        }
    }
      }
  },
  variants: {
    extend: {},
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui']
    }
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
};
