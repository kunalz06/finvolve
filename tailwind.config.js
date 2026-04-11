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
                    DEFAULT: "#8B5CF6", // Purple
                    hover: "#7C3AED",
                    light: "#A78BFA",
                    dark: "#6D28D9",
                },
                secondary: "#F9FAFB", // Light gray
                accent: "#3B82F6", // Blue accent
                muted: "#6B7280", // Gray for body text
                card: {
                    bg: "#FFFFFF",
                    border: "#E5E7EB",
                },
            },
            fontFamily: {
                sans: ["SF Pro Display", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
                heading: ["SF Pro Display", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
                mono: ["Cascadia Code", "Cascadia Mono", "JetBrains Mono", "Consolas", "monospace"],
                code: ["Cascadia Code", "Cascadia Mono", "Consolas", "Courier New", "monospace"],
            },
            backgroundImage: {
                "gradient-primary": "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                "gradient-hero": "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
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
                "button": "0 4px 14px 0 rgba(139, 92, 246, 0.39)",
            },
        },
    },
    plugins: [],
};
