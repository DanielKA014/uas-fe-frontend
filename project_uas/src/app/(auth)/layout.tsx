import NavbarComponent from "../(public)/components/navbar"
import { geistMono, geistSans } from "../fonts/fonts";
import styles from "../page.module.css";

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
        </main>
      </body>
    </html>
  );
}
