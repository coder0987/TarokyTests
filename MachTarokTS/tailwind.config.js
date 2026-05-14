/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

// color palette generator https://www.txtoolbox.com/tool/tailwind-palette-generator

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
  	container: {
  		center: 'true',
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			green: {
				DEFAULT: '#98ad99',
				50: '#EBEFEC',
				100: '#E2E8E2',
				200: '#D0D9D0',
				300: '#BDCBBE',
				400: '#ABBCAB',
				500: '#98AD99',
				600: '#768777',
				700: '#546055',
				800: '#333A33',
				900: '#030403',
				950: '#000000',
			},
  			red: {
				DEFAULT: '#9D181D',
				50: '#ECD3D4',
				100: '#E4BEC0',
				200: '#D29597',
				300: '#C06B6E',
				400: '#AF4246',
				500: '#9D181D',
				600: '#7A1317',
				700: '#570D10',
				800: '#34080A',
				900: '#030101',
				950: '#000000',
			},
  			white: {
				DEFAULT: '#F5F3F1',
				50: '#FDFDFC',
				100: '#FCFCFB',
				200: '#FAF9F9',
				300: '#F9F7F6',
				400: '#F7F5F4',
				500: '#F5F3F1',
				600: '#BFBDBB',
				700: '#888786',
				800: '#525150',
				900: '#050505',
				950: '#000000',
			},
  			whiteHover: '#e2dfdc',
  			black: '#342D27',
  			tan: '#E3D6B2',
  			blue: {
				DEFAULT: '#0D6EFD',
				50: '#D1E3FF',
				100: '#BBD6FE',
				200: '#90BCFE',
				300: '#64A2FE',
				400: '#3988FD',
				500: '#0D6EFD',
				600: '#0A56C5',
				700: '#073D8D',
				800: '#042554',
				900: '#000206',
				950: '#000000',
			},
  			navy: {
				DEFAULT: '#1F3855',
				50: '#D4D9DF',
				100: '#C0C7CF',
				200: '#98A3B1',
				300: '#708092',
				400: '#475C74',
				500: '#1F3855',
				600: '#182C42',
				700: '#111F2F',
				800: '#0A131C',
				900: '#010102',
				950: '#000000',
			},
  			gray: {
				DEFAULT: '#777777',
				50: '#E5E5E5',
				100: '#D9D9D9',
				200: '#C0C0C0',
				300: '#A8A8A8',
				400: '#8F8F8F',
				500: '#777777',
				600: '#5D5D5D',
				700: '#424242',
				800: '#282828',
				900: '#030303',
				950: '#000000',
			},
  			orange: {
				DEFAULT: '#FF9900',
				50: '#FFECCF',
				100: '#FFE2B8',
				200: '#FFD08A',
				300: '#FFBE5C',
				400: '#FFAB2E',
				500: '#FF9900',
				600: '#C67700',
				700: '#8E5500',
				800: '#553300',
				900: '#060300',
				950: '#000000',
			},
  			yellow: {
				DEFAULT: '#ffcc00',
				50: '#FFF5CF',
				100: '#FFF1B8',
				200: '#FFE88A',
				300: '#FFDE5C',
				400: '#FFD52E',
				500: '#FFCC00',
				600: '#C69F00',
				700: '#8E7100',
				800: '#554400',
				900: '#060500',
				950: '#000000',
			},
  			online: '#3cba3c',
  			'red-error': '#7f1d1d',
  			'green-success': '#1d7f1d',
  			'toast-success': '#DFF2BF',
  			'toast-error': '#FFBABA',
  			'success-text': '#4F8A10',
  			'error-text': '#D8000C',
  			'toast-neutral': '#D3D3D3',
  			'neutral-text': '#4A4A4A'
  		},
  		screens: {
  			xs: '480px'
  		},
  		width: {
  			'420': '420px',
  			'465': '465px'
  		},
  		fontFamily: {
  			inter: [
  				'Inter',
  				'sans-serif'
  			],
  			mono: [
  				'Menlo',
  				'Monaco',
  				'Courier New',
  				'monospace'
  			]
  		},
  		fontSize: {
  			xxs: '0.625rem',
  			xxxs: '0.5rem',
  			xxxxs: '0.375rem'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			flash: {
  				'0%, 100%': {
  					color: '#ff0000'
  				},
  				'50%': {
  					color: '#ffffff'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			flash: 'flash 1s ease-in-out 3',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  safelist: [
    'rotate-[0deg]',
    'rotate-[1deg]',
    'rotate-[2deg]',
    'rotate-[3deg]',
    'rotate-[4deg]',
    'rotate-[5deg]',
    'rotate-[6deg]',
    'rotate-[7deg]',
    'rotate-[8deg]',
    'rotate-[9deg]',
    'rotate-[10deg]',
    'rotate-[1deg]',
    'rotate-[12deg]',
    'rotate-[13deg]',
    'rotate-[14deg]',
    'rotate-[15deg]',
	'-rotate-[0deg]',
    '-rotate-[1deg]',
    '-rotate-[2deg]',
    '-rotate-[3deg]',
    '-rotate-[4deg]',
    '-rotate-[5deg]',
    '-rotate-[6deg]',
    '-rotate-[7deg]',
    '-rotate-[8deg]',
    '-rotate-[9deg]',
    '-rotate-[10deg]',
    '-rotate-[1deg]',
    '-rotate-[12deg]',
    '-rotate-[13deg]',
    '-rotate-[14deg]',
    '-rotate-[15deg]',
  ],
  plugins: [require("tailwindcss-animate")],
};
