import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ewanc.dev"),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  title: "Ewan Clark - Portfolio",
  description: "Full-Stack Developer based in London, UK. Specializing in backend systems. Explore my projects, tech stack, and development journey.",
  keywords: ["Ewan Clark", "Ewan", "Developer", "Full-Stack Developer", "Backend Developer", "Portfolio", "London", "UK"],
  authors: [{ name: "Ewan Clark" }],
  creator: "Ewan Clark",
  openGraph: {
    title: "Ewan Clark - Portfolio",
    description: "Full-Stack Developer based in London, UK. Specializing in backend systems. Explore my projects, tech stack, and development journey.",
    url: "https://ewanc.dev",
    siteName: "Ewan Clark Developer Portfolio",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/profile-picture.png",
        alt: "Ewan Clark",
      },
    ],
  }
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
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
