import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModals from "@/components/AuthModals";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Todo Trabajo",
  description: "Tu futuro aquí. Plataforma exclusiva para Argentina.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${manrope.variable} bg-background-dark text-slate-100 font-display overflow-x-hidden antialiased selection:bg-primary selection:text-background-dark flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <AuthModals />
      </body>
    </html>
  );
}

