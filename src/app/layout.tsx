import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const description = "Every Marvel film and series in story order before Avengers: Doomsday, with tick boxes. From Spotesc.";

export const metadata: Metadata = {
  metadataBase: new URL("https://spotesc-doomsday.vercel.app"),
  title: "Road to Doomsday · Spotesc",
  description,
  applicationName: "Road to Doomsday",
  openGraph: {
    type: "website",
    title: "Road to Doomsday",
    description: "Every Marvel film and series in story order, with tick boxes. From Spotesc.",
    url: "/",
  },
  twitter: { card: "summary_large_image", title: "Road to Doomsday", description },
};

export const viewport: Viewport = {
  themeColor: "#050607",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`dark ${inter.variable} ${barlow.variable}`}>
      <body className="min-h-dvh">
        <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
        <Toaster position="bottom-center" />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
