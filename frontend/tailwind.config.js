module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(217, 33%, 17%)',
        input: 'hsl(217, 33%, 17%)',
        ring: 'hsl(217, 91%, 60%)',
        background: 'hsl(222, 47%, 11%)', // Deep Navy
        foreground: 'hsl(210, 40%, 98%)',
        primary: {
          DEFAULT: 'hsl(217, 91%, 60%)', // Electric Blue
          foreground: 'hsl(222, 47%, 11%)'
        },
        secondary: {
          DEFAULT: 'hsl(217, 19%, 27%)', // Slate
          foreground: 'hsl(210, 40%, 98%)'
        },
        destructive: {
          DEFAULT: 'hsl(0, 84%, 60%)', // Red
          foreground: 'hsl(210, 40%, 98%)'
        },
        muted: {
          DEFAULT: 'hsl(217, 19%, 27%)',
          foreground: 'hsl(215, 20%, 65%)'
        },
        accent: {
          DEFAULT: 'hsl(180, 100%, 50%)', // Cyan
          foreground: 'hsl(222, 47%, 11%)'
        },
        popover: {
          DEFAULT: 'hsl(217, 33%, 17%)',
          foreground: 'hsl(210, 40%, 98%)'
        },
        card: {
          DEFAULT: 'hsl(217, 33%, 17%)', // Card Dark
          foreground: 'hsl(210, 40%, 98%)'
        },
        success: 'hsl(142, 71%, 45%)',
        warning: 'hsl(48, 96%, 53%)',
        info: 'hsl(217, 91%, 60%)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
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