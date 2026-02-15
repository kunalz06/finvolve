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
                    DEFAULT: "#FF1801", // Race Red
                    hover: "#CC1000",
                },
                secondary: "#101010", // Asphalt Black
                accent: "#FFF200", // Safety Yellow
                muted: "#2D2D2D", // Track Gray
                glass: "rgba(255, 255, 255, 0.05)",
                "glass-border": "rgba(255, 255, 255, 0.1)",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                heading: ["Space Grotesk", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"], // Telemetry
            },
            backgroundImage: {
                "carbon-fiber": "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
                "asphalt": "url('/assets/asphalt-texture.png')", // Ensure you have this or use a CSS pattern
                "speed-gradient": "linear-gradient(90deg, transparent, rgba(255, 24, 1, 0.1), transparent)",
                "stadium-gradient": "radial-gradient(circle at center, rgba(28, 93, 156, 0.4) 0%, rgba(10, 10, 10, 0.8) 100%)",
            },
            animation: {
                "rev": "rev 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                "slide-fast": "slideFast 10s linear infinite",
            },
            keyframes: {
                rev: {
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.05)" },
                    "100%": { transform: "scale(1)" },
                },
                slideFast: {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-100%)" },
                },
            },
            boxShadow: {
                "neon-red": "0 0 20px rgba(255, 24, 1, 0.5)",
                "neon-yellow": "0 0 20px rgba(255, 242, 0, 0.5)",
            },
        },
    },
    plugins: [],
};
