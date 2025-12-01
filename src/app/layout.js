import "./finvolve/globals.css";

export const metadata = {
    title: "Finvolve",
    description: "Business Solutions",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
