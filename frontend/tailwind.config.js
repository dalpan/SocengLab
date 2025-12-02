module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(215, 28%, 17%)',
        input: 'hsl(215, 28%, 17%)',
        ring: 'hsl(186, 100%, 50%)',
        background: 'hsl(216, 28%, 6%)',
        foreground: 'hsl(210, 40%, 98%)',
        primary: {
          DEFAULT: 'hsl(186, 100%, 50%)',
          foreground: 'hsl(216, 28%, 6%)'
        },
        secondary: {
          DEFAULT: 'hsl(340, 100%, 50%)',
          foreground: 'hsl(210, 40%, 98%)'
        },
        destructive: {
          DEFAULT: 'hsl(0, 100%, 50%)',
          foreground: 'hsl(210, 40%, 98%)'
        },
        muted: {
          DEFAULT: 'hsl(215, 16%, 47%)',
          foreground: 'hsl(215, 16%, 65%)'
        },
        accent: {
          DEFAULT: 'hsl(186, 100%, 50%)',
          foreground: 'hsl(216, 28%, 6%)'
        },
        popover: {
          DEFAULT: 'hsl(216, 28%, 10%)',
          foreground: 'hsl(210, 40%, 98%)'
        },
        card: {
          DEFAULT: 'hsl(216, 28%, 10%)',
          foreground: 'hsl(210, 40%, 98%)'
        },
        tertiary: 'hsl(88, 100%, 65%)',
        warning: 'hsl(38, 100%, 56%)'
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem'
      },
      keyframes: {
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' }
        },
        'pulse-slow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        },
        'typing': {
          'from': { width: '0' },
          'to': { width: '100%' }
        }
      },
      animation: {
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'typing': 'typing 2s steps(40, end)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}