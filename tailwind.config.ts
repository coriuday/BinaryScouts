/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'gx-black': 'var(--gx-black)',
                'gx-dark': 'var(--gx-dark)',
                'gx-green': 'var(--gx-green)',
                'gx-orange': 'var(--gx-orange)',
                'gx-blue': 'var(--gx-blue)',
                'gx-gray': 'var(--gx-gray)',
                'rockstar-black': '#000000',
                'rockstar-yellow': '#fdb927',
            },
            fontFamily: {
                sans: ['var(--font-roboto)', 'Roboto', 'sans-serif'],
                display: ['var(--font-oswald)', 'Oswald', 'sans-serif'],
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #2a2a2a 1px, transparent 1px), linear-gradient(to bottom, #2a2a2a 1px, transparent 1px)",
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
};
