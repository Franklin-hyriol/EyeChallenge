import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eyechallenge.fun"),
  title: "EyeChallenge - Online Vision & Color Perception Tests",
  description:
    "EyeChallenge is an online platform for vision and color perception tests. It provides a range of tests to assess visual acuity, color vision, and other aspects of visual perception.",
  alternates: {
    canonical: "https://www.eyechallenge.fun",
    languages: {
      "en-US": "https://www.eyechallenge.fun",
    },
  },
  openGraph: {
    title: "EyeChallenge - Online Vision & Color Perception Tests",
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
    </html>
  );
}
