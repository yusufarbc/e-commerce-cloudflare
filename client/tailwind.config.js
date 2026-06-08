/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // E-Market Corporate Colors
                brand: {
                    yellow: '#4f46e5', // Ana Marka Rengi - Indigo Blue
                },
                corporate: {
                    black: '#0f172a', // Kurumsal Koyu Lacivert/Siyah (slate-900)
                },
                action: {
                    red: '#dc2a12', // Aksiyon Kirmizisi - Cart Button, Discount
                },
                bg: {
                    white: '#FFFFFF', // Zemin Beyazi
                    soft: '#F8FAFC', // Yumusak Gri/Mavi - Search Bar, Tables
                },
                text: {
                    gray: '#64748B', // Metin Grisi - slate-500
                    main: '#0F172A', // Slate-900
                },
                // Aliases for compatibility
                primary: {
                    DEFAULT: '#4f46e5',
                    foreground: '#ffffff',
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                },
                secondary: {
                    DEFAULT: '#0f172a',
                    foreground: '#4f46e5',
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                },
                neutral: {
                    50: '#ffffff',
                    100: '#f8fafc',
                    200: '#f1f5f9',
                    300: '#e2e8f0',
                    400: '#cbd5e1',
                    500: '#94a3b8',
                    600: '#64748b',
                    700: '#475569',
                    800: '#334155',
                    900: '#0f172a',
                },
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Roboto', 'Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
