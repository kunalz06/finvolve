import "./dev/globals.css";

const isNetlifyBuild =
    process.env.NETLIFY === "true" || process.env.NETLIFY_STATIC_EXPORT === "true";

export const metadata = {
    title: "DEV Infinity",
    description: isNetlifyBuild
        ? "DEV Infinity frontend served from Netlify with APIs hosted on Vercel."
        : "Business Solutions",
};

// Apply the saved or OS theme before first paint, to prevent a flash of the wrong palette.
const themeBootstrap = `(function(){try{var saved=localStorage.getItem("dev-theme");var theme=(saved==="dark"||saved==="light")?saved:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",theme);}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head><script dangerouslySetInnerHTML={{ __html: themeBootstrap }} /></head>
            <body suppressHydrationWarning>{children}</body>
        </html>
    );
}
