/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    hover: "var(--primary-hover)",
                    light: "var(--primary-soft)",
                    dark: "var(--primary-hover)",
                },
                secondary: "var(--surface-muted)",
                accent: "var(--accent)",
                muted: "var(--muted)",
                card: {
                    bg: "var(--surface-strong)",
                    border: "var(--border-soft)",
                },
            },
            fontFamily: {
                sans: ["var(--font-sans)"],
                heading: ["var(--font-sans)"],
                mono: ["var(--font-code)"],
                code: ["var(--font-code)"],
            },
            backgroundImage: {
                "gradient-primary": "linear-gradient(var(--brand-fill), var(--brand-fill))",
                "gradient-hero": "linear-gradient(var(--surface-strong), var(--surface-strong))",
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out",
                "slide-up": "slideUp 0.5s ease-out",
                "pulse-soft": "pulseSoft 2s ease-in-out infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                pulseSoft: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.7" },
                },
            },
            boxShadow: {
                "card": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                "button": "var(--shadow-soft)",
            },
        },
    },
    plugins: [],
};
