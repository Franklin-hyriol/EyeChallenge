import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { GoogleAnalytics } from '@next/third-parties/google'

export const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eyechallenge.fun"),
  title: "EyeChallenge – Test Your Eyes & Mind Online",
  description:
    "Put your eyes and brain to the test! EyeChallenge offers fun and accurate online tests to measure your vision, focus, and perception skills.",
  alternates: {
    canonical: "https://www.eyechallenge.fun",
    languages: {
      "en-US": "https://www.eyechallenge.fun",
    },
  },
  openGraph: {
    title: "EyeChallenge – Test Your Eyes & Mind Online",
    description:
      "Test your vision and color perception with our online challenges.",
    url: "https://www.eyechallenge.fun",
    siteName: "EyeChallenge",
    images: [
      {
        url: "https://www.eyechallenge.fun/hero_image.svg",
        width: 800,
        height: 600,
        alt: "EyeChallenge Hero Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'visiontest-light';
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-V1BZZG3212" />
    </html>
  );
}
