import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoadingProvider from "./components/LoadingProvider";
import PremiumLoadingProvider from "./components/PremiumLoadingProvider";
import { ListProvider } from "./context/ListContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DS List Premium",
  description: "Aplicação do IJS - Intensivão Java Spring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ListProvider>
          <LoadingProvider>{children}</LoadingProvider>
          {/* <PremiumLoadingProvider>{children}</PremiumLoadingProvider> */}
        </ListProvider>
      </body>
    </html>
  );
}
