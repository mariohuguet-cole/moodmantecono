import type { Metadata } from "next";
import { Newsreader, Manrope, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css"; // Global styles

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-headline",
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-modern",
});

export const metadata: Metadata = {
  title: "Mudmantecosa",
  description: "Un diario de estado de ánimo diario, elegante y minimalista.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${newsreader.variable} ${manrope.variable} ${inter.variable} bg-background text-on-surface font-body min-h-screen selection:bg-primary-container selection:text-on-primary-container`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
