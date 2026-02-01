import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import AuthRedirect from "./AuthRedirect";
import NavbarWrapper from "./NavbarWrapper"; // make sure this points to your new StackOverflow-style Navbar wrapper

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Overflow Clone",
  description: "Overflow style Q&A platform clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <StoreProvider>
          <AuthRedirect>
            <NavbarWrapper />
            {children}
          </AuthRedirect>
        </StoreProvider>
      </body>
    </html>
  );
}
