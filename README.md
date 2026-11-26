# Road to Doomsday

Every Marvel film and series in story order before *Avengers: Doomsday*, with tick boxes. The countdown uses the release date for the viewer's own country (16 December in the UK, 18 December in the US) and their own time zone.

Live at https://spotesc-doomsday.vercel.app

- Story order follows Disney+'s timeline order, with an Essential / Recommended / Optional tier and a "why watch it" line for every title.
- "Disney+ pick" marks the titles on Disney+'s official Doomsday watchlist.
- Posters, backdrops, runtimes, ratings and trailers come from TMDB.
- Ticks are saved in your own browser, so everyone you share it with keeps their own progress.

Made by Spotesc.

## How it's built

A static page plus one Vercel function.

| Path | What it is |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | The page |
| `data/titles.js` | The list: order, tiers, notes and each title's TMDB id |
| `api/tmdb.js` | Fetches details for every title from TMDB, cached by Vercel for a day |
| `images/` | Logo, poster art, icons and the link preview |

The function needs a `TMDB_API_KEY` environment variable in Vercel (either the v3 API key or the v4 read access token works).

## Editing the list

Everything lives in `data/titles.js`, in story order. TMDB ids look like `movie:1726` or `tv:84958:2` (show id, then season). Push to `main` and Vercel redeploys.

---

This product uses the TMDB API but is not endorsed or certified by TMDB. An unofficial fan list, not connected to Marvel Studios or Disney. Marvel, the Avengers logo and the Doomsday poster belong to Marvel.
