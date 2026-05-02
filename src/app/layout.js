import "./dev/globals.css";

export const metadata = {
    title: "Registration Closed",
    description: "IEM Minor registration is closed.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>{children}</body>
        </html>
    );
}
