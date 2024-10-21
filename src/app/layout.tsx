import type { Metadata } from "next";
import "./globals.css";

import { cn } from "@/lib/utils"

import { Inter as FontSans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "@/app/providers";
import Navbar from "@/components/header";
import Background from "@/components/background"; 
import { Toaster } from "@/components/ui/toaster";
import BottomNav from "@/components/bottom-nav";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Chat BOR",
  description: "Chat with BOR Documents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={cn(
          `min-h-screen font-sans antialiased`,
          fontSans.variable
        )}
      >
        <Background/>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <Providers>
            <Navbar/>
            {children}
            <BottomNav/>
            <Toaster></Toaster>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
