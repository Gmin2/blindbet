import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import FooterSection from "@/components/footer";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BlindBet - Confidential Prediction Markets",
    template: "%s | BlindBet"
  },
  description: "The first fully confidential prediction market built on Zama's fhEVM. Bet privately with encrypted positions, eliminate front-running, and compete on equal terms using Fully Homomorphic Encryption.",
  keywords: ["prediction markets", "FHE", "fhEVM", "Zama", "confidential betting", "encrypted blockchain", "privacy", "DeFi", "Web3"],
  authors: [{ name: "Gmin2", url: "https://github.com/Gmin2" }],
  creator: "Gmin2",
  publisher: "BlindBet",
  metadataBase: new URL("https://blindbet.xyz"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blindbet.xyz",
    title: "BlindBet - Confidential Prediction Markets",
    description: "The first fully confidential prediction market powered by Zama's fhEVM. Private betting with encrypted positions on-chain.",
    siteName: "BlindBet",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 1200,
        alt: "BlindBet - Confidential Prediction Markets"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "BlindBet - Confidential Prediction Markets",
    description: "The first fully confidential prediction market powered by Zama's fhEVM. Private betting with encrypted positions on-chain.",
    creator: "@Min2_gg",
    images: ["/logo.png"]
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png"
  },
  manifest: "/manifest.json"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <Header />
          {children}
          <FooterSection />
        </Providers>
      </body>
    </html>
  );
}
