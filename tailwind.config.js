/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/landing/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'electric': {
                    50: '#e6f0ff',
                    100: '#b3d9ff',
                    200: '#80c2ff',
                    300: '#4dabff',
                    400: '#1a94ff',
                    500: '#0080ff',  // Primary electric blue
                    600: '#0066cc',
                    700: '#004d99',
                    800: '#003366',
                    900: '#001a33',
                    950: '#000d1a',
                },
            },
        },
    },
    plugins: [],
    corePlugins: {
        preflight: false,
    }
}
