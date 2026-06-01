import "./dev/globals.css";

const isNetlifyBuild =
    process.env.NETLIFY === "true" || process.env.NETLIFY_STATIC_EXPORT === "true";

export const metadata = {
    title: "DEV Infinity",
    description: isNetlifyBuild
        ? "DEV Infinity frontend served from Netlify with APIs hosted on Vercel."
        : "Business Solutions",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>{children}</body>
        </html>
    );
}
