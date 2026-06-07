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
                    yellow: '#deff36', // Ana Marka Rengi - Logo, Icons, Banners
                },
                corporate: {
                    black: '#191919', // Kurumsal Siyah - Main Text, Header/Footer BG
                },
                action: {
                    red: '#dc2a12', // Aksiyon Kirmizisi - Cart Button, Discount
                },
                bg: {
                    white: '#FFFFFF', // Zemin Beyazi
                    soft: '#F4F4F4', // Yumusak Gri - Search Bar, Tables
                },
                text: {
                    gray: '#666666', // Metin Grisi - Secondary Info
                    main: '#191919',
                },
                // Aliases for compatibility
                primary: {
                    DEFAULT: '#deff36',
                    foreground: '#191919',
                    50: '#feffcc',
                    100: '#feff99',
                    200: '#fdff66',
                    300: '#ecff33',
                    400: '#e5ff1a',
                    500: '#deff36',
                    600: '#c6e600',
                    700: '#a3bf00',
                    800: '#7a8f00',
                    900: '#515f00',
                },
                secondary: {
                    DEFAULT: '#191919',
                    foreground: '#deff36',
                    50: '#f5f5f5',
                    100: '#e0e0e0',
                    200: '#cccccc',
                    300: '#b3b3b3',
                    400: '#999999',
                    500: '#8E8E8E',
                    600: '#707070',
                    700: '#525252',
                    800: '#333333',
                    900: '#191919',
                },
                neutral: {
                    50: '#FFFFFF',
                    100: '#f7f7f7',
                    200: '#e8e8e8',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#8E8E8E',
                    600: '#737373',
                    700: '#525252',
                    800: '#404040',
                    900: '#191919',
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
