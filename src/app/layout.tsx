import type { Metadata } from "next";
import "./globals.css";
import { Montserrat, Lato } from "next/font/google";

// Montserrat: keep as-is (these weights are fine)
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-head",
});

// Lato: remove 500 → use 400 & 700 instead (valid set: 100,300,400,700,900)
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Born Seen",
  description: "Simple, human, reliable.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${lato.variable}`}
        style={{ fontFamily: "var(--font-body), system-ui" }}
      >
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
