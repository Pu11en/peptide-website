import type { Metadata } from "next";
import { Montserrat, Roboto } from 'next/font/google';
import "./globals.css";
import { Providers } from "./providers";

// Initialize the Montserrat font with specific subsets and weights
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-montserrat',
});

// Initialize Roboto font for the peptide section
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "What Are Peptides? Structure, Benefits, Uses & Safety in the USA (2024) | Incredible Peptides",
  description: "Discover what peptides are, how they work, their roles in skin health, metabolism, and tissue repair, and learn about FDA-approved and experimental peptides. Get expert guidance on peptide safety and research in the USA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${roboto.variable}`}>
      <body
        className={`${montserrat.className} antialiased bg-white dark:bg-dark text-black dark:text-white`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
