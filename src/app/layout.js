import "./dev/globals.css";

const isNetlifyBuild =
    process.env.NETLIFY === "true" || process.env.NETLIFY_STATIC_EXPORT === "true";

export const metadata = {
    title: isNetlifyBuild ? "Registration Closed" : "DEV Infinity",
    description: isNetlifyBuild ? "IEM Minor registration is closed." : "Business Solutions",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>{children}</body>
        </html>
    );
}
