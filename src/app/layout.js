import "./dev/globals.css";

export const metadata = {
    title: "IEM Minor",
    description: "IEM Minor Degree Registration Portal",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>{children}</body>
        </html>
    );
}
