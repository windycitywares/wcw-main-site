import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Inter } from "next/font/google";
import Script from "next/script";
import { themeBootScript } from "@/lib/theme";
import { SocialRail } from "@/components/Social/Social";
import { getSocial } from "@/lib/api";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { BackToTop } from "@/components/BackToTop/BackToTop";
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

export const viewport: Viewport = { themeColor: "#f2f3ef" }; // the dark theme swaps it (lib/theme.ts)

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const social = await getSocial();
  return (
    <html data-theme="classic" suppressHydrationWarning lang="en" className={`${inter.variable} ${bigShoulders.variable}`}>
      <head>
        {/* Applies the visitor's light/dark choice (shared with the shop and CRM) before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <a href="#main" className="sr-only-focusable btn" style={{ position: "absolute", left: 16, top: 12, zIndex: 50 }}>
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        {/* Marketplaces band: managed in the shop's Admin → Settings → Marketplaces and served by the shop. */}
        <div id="wcw-marketplaces" />
        <Script src="https://shop.windycitywares.com/embed/marketplaces.js" strategy="lazyOnload" />
        <Footer />
        <BackToTop />
        <SocialRail accounts={social} />
      </body>
    </html>
  );
}
