import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import NavbarComponent from "./components/navbar";
import styles from "../page.module.css";
import Footer from "./components/footer";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ayam Bakar OjoLali",
  description: "Ayam Bakar Ojolali",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${styles.main}`}
      >
        <main className="m-0 p-0">
          <NavbarComponent />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
