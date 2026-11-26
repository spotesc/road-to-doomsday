import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Road to Doomsday",
    short_name: "Doomsday",
    description: "Every Marvel film and series in story order before Avengers: Doomsday, with tick boxes.",
    start_url: "/",
    display: "standalone",
    background_color: "#050607",
    theme_color: "#050607",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
