import type { Metadata } from "next";
import { Titan_One, DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

const titanOne = Titan_One({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Low Light Sessions — Geneva",
  description:
    "Live concerts in intimate settings in Geneva. The performers? A secret — until the lights go down.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${titanOne.variable} ${dmSans.variable} ${fraunces.variable} antialiased`}
    >
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
