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
                background: "#05050B", // Void Black
                midnight: "#0F0C29", // Deep Midnight
                primary: "#6366F1", // Indigo
                secondary: "#A855F7", // Purple
                accent: "#DC2430", // Crimson
                gold: "#FFD29D", // Peach/Gold
                glass: "rgba(255, 255, 255, 0.03)",
                "glass-border": "rgba(255, 255, 255, 0.08)",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                heading: ["Space Grotesk", "sans-serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "deep-space": "linear-gradient(to bottom, #05050B, #0F0C29)",
                "aurora": "linear-gradient(135deg, rgba(255, 210, 157, 0.1) 0%, rgba(123, 67, 151, 0.2) 50%, rgba(220, 36, 48, 0.05) 100%)",
            },
            animation: {
                "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                orbit: "orbit 20s linear infinite",
            },
            keyframes: {
                orbit: {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                },
            },
        },
    },
    plugins: [],
};
