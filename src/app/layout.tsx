import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/600.css";
import "./globals.css";
import { LangProvider } from "@/i18n";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Vacancy Duration vs Offered Wage | Open Nshipyard",
  description:
    "Which unfilled jobs are wage problems vs supply problems? 10 Canadian occupation groups on two axes, duration and offered wage, from StatCan's Job Vacancy and Wage Survey.",
  openGraph: {
    title: "Vacancy Duration vs Offered Wage | Open Nshipyard",
    description:
      "Health care posts sit open longest at above-median pay (supply problem). Trades and manufacturing cannot fill posts at the wages they offer (wage problem).",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LangProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
