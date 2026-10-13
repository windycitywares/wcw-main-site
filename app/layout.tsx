import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Inter } from "next/font/google";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Display face drawn for the City of Chicago's own signage.
const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"], // optical size: large headings get the narrow "display" cut
  variable: "--font-big-shoulders",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Crafted with care. Designed with purpose.`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, locale: "en_US" },
  icons: { icon: [{ url: "/favicon.ico" }, { url: "/brand/windycitywares-emblem.svg", type: "image/svg+xml" }] },
};

export const viewport: Viewport = { themeColor: "#1c2f45" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bigShoulders.variable}`}>
      <body>
        <a href="#main" className="sr-only-focusable btn" style={{ position: "absolute", left: 16, top: 12, zIndex: 50 }}>
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
