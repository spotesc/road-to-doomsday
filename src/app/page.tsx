import { Watchlist } from "@/components/watch/watchlist";
import { getDetails } from "@/lib/tmdb";

export default async function Page() {
  const details = await getDetails();
  return <Watchlist details={details} />;
}
