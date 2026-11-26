# Road to Doomsday

Every Marvel film and series in story order before *Avengers: Doomsday*, with tick boxes.

Live at https://spotesc-doomsday.vercel.app

- Story order follows Disney+'s timeline, with an Essential / Recommended / Optional tier and a "why watch it" line for every title.
- "Disney+ pick" marks the titles on Disney+'s official Doomsday watchlist.
- Posters, backdrops, runtimes, ratings and trailers come from TMDB.
- The countdown uses the release date for the viewer's own country (16 December in the UK, 18 December in the US) and their own time zone.
- Ticks are saved in your own browser, so everyone you share it with keeps their own progress.

Made by Spotesc.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, Cache Components) with TypeScript
- [Tailwind CSS](https://tailwindcss.com) 4 and [shadcn/ui](https://ui.shadcn.com) on [Radix](https://www.radix-ui.com)
- [Motion](https://motion.dev) for animation, [Lucide](https://lucide.dev) icons
- [Vaul](https://vaul.emilkowal.ski) drawer, [Sonner](https://sonner.emilkowal.ski) toasts, [cmdk](https://cmdk.paco.me) search
- Hosted on Vercel

## Running it

```bash
npm install
npm run dev
```

The TMDB details need a `TMDB_API_KEY` (the v3 API key or the v4 read access token). It lives in Vercel; `vercel env pull .env.local` copies it down for local use. Without it the list still works, just without posters.

## Where things live

| Path | What it is |
| --- | --- |
| `src/data/titles.ts` | The list: order, tiers, notes and each title's TMDB id |
| `src/lib/tmdb.ts` | Server-side TMDB lookups, cached for a day and baked into the page |
| `src/app/api/release/route.ts` | Returns the Doomsday release date for the visitor's country |
| `src/components/watch/` | The page: hero, progress, up next, toolbar, rows, posters, details, search |
| `src/components/ui/` | shadcn/ui components |

TMDB ids look like `movie:1726` or `tv:84958:2` (show id, then season). Push to `main` and Vercel redeploys.

---

This product uses the TMDB API but is not endorsed or certified by TMDB. An unofficial fan list, not connected to Marvel Studios or Disney. Marvel, the Avengers logo and the Doomsday poster belong to Marvel.
