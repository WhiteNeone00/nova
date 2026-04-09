import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'nova-dark': '#020204',
        'nova-purple': '#a855f7',
        'nova-blue': '#3b82f6',
      },
      backgroundImage: {
        'gradient-nova': 'linear-gradient(135deg, #0a0a0c 0%, #1a1a2e 100%)',
      },
    },
  },
  plugins: [],
}
export default config
