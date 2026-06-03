import type { Metadata } from "next";
import { Oswald, Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import LayoutWrapper from "@/components/LayoutWrapper";

const oswald = Oswald({
    variable: "--font-oswald",
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    display: "swap",
});

const roboto = Roboto({
    variable: "--font-roboto",
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "GloryX | Dominate The Matrix - Premium Digital Agency & Automation",
    description: "GloryX is a high-octane full-service digital agency. We combine cutting-edge marketing, business CRM automation, SEO engineering, and video production to rewrite the code of your brand.",
    keywords: ["Digital Marketing", "Business Automation", "SEO Optimization", "CRM Automation", "Next.js Agency", "Rockstar Aesthetic"],
    authors: [{ name: "GloryX Team" }],
    openGraph: {
        title: "GloryX | Dominate The Matrix",
        description: "We don't just play the game. We rewrite the code. Full-service digital marketing and automation built for maximum impact.",
        url: "https://gloryx.com",
        siteName: "GloryX Digital Agency",
        images: [
            {
                url: "https://images.unsplash.com/photo-1519608487953-e999c9dc296f?q=80&w=1200&auto=format&fit=crop",
                width: 1200,
                height: 630,
                alt: "GloryX - Dominate The Matrix",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "GloryX | Dominate The Matrix",
        description: "Full-service digital marketing and automation. We rewrite the code.",
        images: ["https://images.unsplash.com/photo-1519608487953-e999c9dc296f?q=80&w=1200&auto=format&fit=crop"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${oswald.variable} ${roboto.variable} scroll-smooth`}>
            <ThemeProvider>
                <LayoutWrapper bodyClass={roboto.className}>
                    {children}
                </LayoutWrapper>
            </ThemeProvider>
        </html>
    );
}

