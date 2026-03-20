/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"','sans-serif'],
        body: ['"Satoshi"','sans-serif'],
        mono: ['"JetBrains Mono"','monospace'],
      },
      colors: {
        ink: '#060d1a',
        deep: '#0b1628',
        navy: '#0f2044',
        mid: '#162a5a',
        accent: '#2563ff',
        cyan: '#00d4ff',
        amber: '#f59e0b',
        emerald: '#10b981',
        rose: '#f43f5e',
      },
      animation: {
        'fade-up': 'fadeUp .4s ease both',
        'fade-in': 'fadeIn .3s ease both',
        'slide-in': 'slideIn .35s ease both',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeUp: { from: { opacity:'0', transform:'translateY(16px)' }, to: { opacity:'1', transform:'none' } },
        fadeIn: { from: { opacity:'0' }, to: { opacity:'1' } },
        slideIn: { from: { opacity:'0', transform:'translateX(-12px)' }, to: { opacity:'1', transform:'none' } },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(37,99,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,255,0.06) 1px,transparent 1px)",
        'glow-blue': 'radial-gradient(ellipse at center,rgba(37,99,255,0.25) 0%,transparent 65%)',
        'glow-cyan': 'radial-gradient(ellipse at center,rgba(0,212,255,0.15) 0%,transparent 65%)',
      },
    },
  },
  plugins: [],
}
