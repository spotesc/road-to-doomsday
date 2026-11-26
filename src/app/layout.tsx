import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Cinzel, IBM_Plex_Mono, Inter } from "next/font/google";
import { Atmosphere } from "@/components/watch/atmosphere";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_URL, moveScript } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const description = "Every Marvel film and series in story order before Avengers: Doomsday, with tick boxes. From Spotesc.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
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
  themeColor: "#070707",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`dark ${inter.variable} ${cinzel.variable} ${bebas.variable} ${plexMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: moveScript }} />
      </head>
      <body className="min-h-dvh">
        <Atmosphere />
        <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
        <Toaster position="bottom-center" mobileOffset={{ bottom: "80px" }} />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
