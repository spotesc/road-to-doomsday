export type Kind = "film" | "series" | "special" | "animated";
export type Tier = "ess" | "rec" | "opt";

export interface Title {
  id: string;
  title: string;
  kind: Kind;
  year: number;
  mins: number;
  eps?: number;
  season?: number;
  tier: Tier;
  pick?: boolean;
  tmdb: string | null;
  why: string;
}

export interface Section {
  id: string;
  kicker: string;
  title: string;
  note: string;
  cover: string;
  items: Title[];
}

export interface StoryTitle extends Title {
  number: number;
  sectionId: string;
  sectionTitle: string;
}

export const RELEASE = "2026-12-18";

export const FINALE: { id: string; title: string; tmdb: string } = { id: "avengers-doomsday", title: "Avengers: Doomsday", tmdb: "movie:1003596" };

export const TIERS: Record<Tier, string> = {
  ess: "Essential",
  rec: "Recommended",
  opt: "Optional",
};

export const SECTIONS: Section[] = [
  {
    id: "prologue",
    kicker: "Prologue",
    title: "The Fox X-Men",
    note: "A different universe, but Doomsday pulls straight from it. Stewart, McKellen, Marsden, Romijn and Cumming are all back.",
    cover: "x-men-days-of-future-past",
    items: [
      { id: "x-men", title: "X-Men", kind: "film", year: 2000, mins: 104, tier: "ess", pick: true, tmdb: "movie:36657", why: "Where Xavier, Magneto, Cyclops and Mystique begin. All four return in Doomsday." },
      { id: "x2", title: "X2", kind: "film", year: 2003, mins: 133, tier: "ess", pick: true, tmdb: "movie:36658", why: "The best of the Fox run and Nightcrawler's debut. Alan Cumming is back too." },
      { id: "x-men-the-last-stand", title: "X-Men: The Last Stand", kind: "film", year: 2006, mins: 104, tier: "opt", tmdb: "movie:36668", why: "Skippable, but it's the ending Days of Future Past spends its runtime undoing." },
      { id: "x-men-days-of-future-past", title: "X-Men: Days of Future Past", kind: "film", year: 2014, mins: 132, tier: "ess", tmdb: "movie:127585", why: "Rewrites the original trilogy's ending and brings the old and young casts together." },
    ],
  },
  {
    id: "infinity",
    kicker: "Phase 1–3",
    title: "The Infinity Saga",
    note: "Story order, not release order. Short on time? The essentials alone carry it.",
    cover: "avengers-endgame",
    items: [
      { id: "eyes-of-wakanda", title: "Eyes of Wakanda", kind: "animated", year: 2025, eps: 4, mins: 120, tier: "opt", tmdb: "tv:241388:1", why: "Wakanda's warriors through history, set centuries before everything else. A side story." },
      { id: "captain-america-the-first-avenger", title: "Captain America: The First Avenger", kind: "film", year: 2011, mins: 124, tier: "ess", pick: true, tmdb: "movie:1771", why: "Steve Rogers' origin, and Chris Evans is back for Doomsday." },
      { id: "captain-marvel", title: "Captain Marvel", kind: "film", year: 2019, mins: 123, tier: "rec", tmdb: "movie:299537", why: "Carol's origin and the Skrulls, which pay off much later. Set in the 1990s." },
      { id: "iron-man", title: "Iron Man", kind: "film", year: 2008, mins: 126, tier: "ess", tmdb: "movie:1726", why: "Where it all starts, and the face Doom now wears." },
      { id: "iron-man-2", title: "Iron Man 2", kind: "film", year: 2010, mins: 124, tier: "opt", tmdb: "movie:10138", why: "Introduces Natasha and the Stark legacy baggage." },
      { id: "the-incredible-hulk", title: "The Incredible Hulk", kind: "film", year: 2008, mins: 112, tier: "opt", tmdb: "movie:1724", why: "Mostly orphaned, but Ross starts here and Ross matters later." },
      { id: "thor", title: "Thor", kind: "film", year: 2011, mins: 115, tier: "rec", tmdb: "movie:10195", why: "Thor and Loki's origin. Hemsworth and Hiddleston both return." },
      { id: "the-avengers", title: "The Avengers", kind: "film", year: 2012, mins: 143, tier: "ess", pick: true, tmdb: "movie:24428", why: "The original team-up Doomsday is built to echo." },
      { id: "thor-the-dark-world", title: "Thor: The Dark World", kind: "film", year: 2013, mins: 112, tier: "opt", tmdb: "movie:76338", why: "The weakest link, but the Aether is an Infinity Stone." },
      { id: "iron-man-3", title: "Iron Man 3", kind: "film", year: 2013, mins: 130, tier: "opt", tmdb: "movie:68721", why: "Tony's PTSD arc, and the Mandarin twist Shang-Chi later corrects." },
      { id: "captain-america-the-winter-soldier", title: "Captain America: The Winter Soldier", kind: "film", year: 2014, mins: 136, tier: "ess", tmdb: "movie:100402", why: "Bucky's turn and the fall of S.H.I.E.L.D. Sebastian Stan is on the Doomsday roster." },
      { id: "guardians-of-the-galaxy", title: "Guardians of the Galaxy", kind: "film", year: 2014, mins: 121, tier: "opt", tmdb: "movie:118340", why: "The cosmic side of the board, plus the Power Stone." },
      { id: "guardians-of-the-galaxy-vol-2", title: "Guardians of the Galaxy Vol. 2", kind: "film", year: 2017, mins: 136, tier: "opt", tmdb: "movie:283995", why: "Introduces the Celestials that Eternals builds on." },
      { id: "avengers-age-of-ultron", title: "Avengers: Age of Ultron", kind: "film", year: 2015, mins: 141, tier: "ess", tmdb: "movie:99861", why: "Wanda, Vision and Ultron, all still threading through today's stories." },
      { id: "ant-man", title: "Ant-Man", kind: "film", year: 2015, mins: 117, tier: "rec", tmdb: "movie:102899", why: "Quantum Realm groundwork. Paul Rudd is confirmed for Doomsday." },
      { id: "captain-america-civil-war", title: "Captain America: Civil War", kind: "film", year: 2016, mins: 147, tier: "ess", tmdb: "movie:271110", why: "The team fractures. Doomsday is the reunion this made impossible." },
      { id: "black-widow", title: "Black Widow", kind: "film", year: 2021, mins: 134, tier: "ess", tmdb: "movie:497698", why: "Introduces Yelena and Red Guardian, both central to Thunderbolts* and Doomsday." },
      { id: "black-panther", title: "Black Panther", kind: "film", year: 2018, mins: 134, tier: "ess", tmdb: "movie:284054", why: "Shuri and M'Baku are both on the Doomsday roster." },
      { id: "spider-man-homecoming", title: "Spider-Man: Homecoming", kind: "film", year: 2017, mins: 133, tier: "rec", tmdb: "movie:315635", why: "Peter's footing in the MCU before the multiverse breaks it." },
      { id: "doctor-strange", title: "Doctor Strange", kind: "film", year: 2016, mins: 115, tier: "ess", tmdb: "movie:284052", why: "Magic, the Time Stone and the first rules of the multiverse." },
      { id: "thor-ragnarok", title: "Thor: Ragnarok", kind: "film", year: 2017, mins: 130, tier: "rec", tmdb: "movie:284053", why: "Resets Thor and Loki. Valkyrie and Korg arrive." },
      { id: "ant-man-and-the-wasp", title: "Ant-Man and the Wasp", kind: "film", year: 2018, mins: 118, tier: "opt", tmdb: "movie:363088", why: "Quantum Realm rules that Quantumania runs with, and Ghost, who's back in Doomsday." },
      { id: "avengers-infinity-war", title: "Avengers: Infinity War", kind: "film", year: 2018, mins: 149, tier: "ess", pick: true, tmdb: "movie:299536", why: "Thanos wins. The first half of the two-part event Doomsday repeats at scale." },
      { id: "avengers-endgame", title: "Avengers: Endgame", kind: "film", year: 2019, mins: 181, tier: "ess", pick: true, tmdb: "movie:299534", why: "The emotional bedrock. Tony's arc ends here, which is why Doom hits." },
    ],
  },
  {
    id: "multiverse",
    kicker: "Phase 4–6",
    title: "The Multiverse Saga",
    note: "Where the incursions, the TVA and the New Avengers all come from. From here, series matter as much as films.",
    cover: "doctor-strange-multiverse-of-madness",
    items: [
      { id: "loki-1", title: "Loki", season: 1, kind: "series", year: 2021, eps: 6, mins: 300, tier: "ess", pick: true, tmdb: "tv:84958:1", why: "The TVA, variants and branching timelines. The most load-bearing show." },
      { id: "what-if-1", title: "What If…?", season: 1, kind: "animated", year: 2021, eps: 9, mins: 290, tier: "opt", tmdb: "tv:91363:1", why: "Animated multiverse what-ifs, with Strange Supreme and the Watcher." },
      { id: "marvel-zombies", title: "Marvel Zombies", kind: "animated", year: 2025, eps: 4, mins: 140, tier: "opt", tmdb: "tv:138505:1", why: "The zombie universe from What If…? episode 5, played straight." },
      { id: "wandavision", title: "WandaVision", kind: "series", year: 2021, eps: 9, mins: 350, tier: "ess", tmdb: "tv:85271:1", why: "Wanda's grief and chaos magic. Also where White Vision walks off." },
      { id: "shang-chi", title: "Shang-Chi and the Legend of the Ten Rings", kind: "film", year: 2021, mins: 132, tier: "rec", pick: true, tmdb: "movie:566525", why: "Simu Liu is confirmed. The rings sent a signal nobody has answered yet." },
      { id: "the-falcon-and-the-winter-soldier", title: "The Falcon and the Winter Soldier", kind: "series", year: 2021, eps: 6, mins: 320, tier: "ess", tmdb: "tv:88396:1", why: "Sam takes the shield and Bucky starts his reckoning. Both are in Doomsday." },
      { id: "spider-man-far-from-home", title: "Spider-Man: Far From Home", kind: "film", year: 2019, mins: 129, tier: "rec", tmdb: "movie:429617", why: "Mysterio's multiverse lie, and the identity reveal that forces No Way Home." },
      { id: "eternals", title: "Eternals", kind: "film", year: 2021, mins: 156, tier: "opt", tmdb: "movie:524434", why: "Celestials and the dead one in the ocean. Still unresolved." },
      { id: "spider-man-no-way-home", title: "Spider-Man: No Way Home", kind: "film", year: 2021, mins: 148, tier: "ess", pick: true, tmdb: "movie:634649", why: "The first real crack in the multiverse, and why Peter is alone now." },
      { id: "doctor-strange-multiverse-of-madness", title: "Doctor Strange in the Multiverse of Madness", kind: "film", year: 2022, mins: 126, tier: "ess", pick: true, tmdb: "movie:453395", why: "Incursions: two universes colliding. That's the engine of Doomsday." },
      { id: "hawkeye", title: "Hawkeye", kind: "series", year: 2021, eps: 6, mins: 290, tier: "opt", tmdb: "tv:88329:1", why: "Kate Bishop and Yelena's detour. Light on plot, heavy on charm." },
      { id: "moon-knight", title: "Moon Knight", kind: "series", year: 2022, eps: 6, mins: 280, tier: "opt", tmdb: "tv:92749:1", why: "Standalone Egyptian-god chaos. Skip it if you're short on time." },
      { id: "black-panther-wakanda-forever", title: "Black Panther: Wakanda Forever", kind: "film", year: 2022, mins: 161, tier: "ess", pick: true, tmdb: "movie:505642", why: "Shuri becomes Panther and Namor arrives. Both are in Doomsday." },
      { id: "echo", title: "Echo", kind: "series", year: 2024, eps: 5, mins: 210, tier: "opt", tmdb: "tv:122226:1", why: "Street-level Maya Lopez. Mostly a Daredevil bridge." },
      { id: "she-hulk", title: "She-Hulk: Attorney at Law", kind: "series", year: 2022, eps: 9, mins: 300, tier: "opt", tmdb: "tv:92783:1", why: "Mostly standalone. Introduces Jen and brings back Abomination." },
      { id: "ms-marvel", title: "Ms. Marvel", kind: "series", year: 2022, eps: 6, mins: 270, tier: "opt", tmdb: "tv:92782:1", why: "Kamala's origin, and the mutant word-drop in the finale." },
      { id: "thor-love-and-thunder", title: "Thor: Love and Thunder", kind: "film", year: 2022, mins: 119, tier: "opt", tmdb: "movie:616037", why: "Where Thor's story stands before Doomsday." },
      { id: "ironheart", title: "Ironheart", kind: "series", year: 2025, eps: 6, mins: 260, tier: "opt", tmdb: "tv:114471:1", why: "Riri's suit and a magic subplot with longer-term fallout." },
      { id: "werewolf-by-night", title: "Werewolf by Night", kind: "special", year: 2022, mins: 53, tier: "opt", tmdb: "movie:894205", why: "A one-off horror special. Pure vibes, no plot debt." },
      { id: "guardians-holiday-special", title: "The Guardians of the Galaxy Holiday Special", kind: "special", year: 2022, mins: 44, tier: "opt", tmdb: "movie:774752", why: "Short, fun and skippable." },
      { id: "quantumania", title: "Ant-Man and the Wasp: Quantumania", kind: "film", year: 2023, mins: 125, tier: "ess", tmdb: "movie:640146", why: "The Council of Kangs and the multiverse's first real warning shot." },
      { id: "guardians-of-the-galaxy-vol-3", title: "Guardians of the Galaxy Vol. 3", kind: "film", year: 2023, mins: 150, tier: "opt", tmdb: "movie:447365", why: "Closes out the Guardians. Little direct Doomsday debt." },
      { id: "secret-invasion", title: "Secret Invasion", kind: "series", year: 2023, eps: 6, mins: 280, tier: "opt", tmdb: "tv:114472:1", why: "Explains where Fury has been, and the state he's in." },
      { id: "the-marvels", title: "The Marvels", kind: "film", year: 2023, mins: 105, tier: "rec", tmdb: "movie:609681", why: "Carol, Kamala and Monica, plus a mid-credits scene that leads straight to Doomsday." },
      { id: "loki-2", title: "Loki", season: 2, kind: "series", year: 2023, eps: 6, mins: 300, tier: "ess", pick: true, tmdb: "tv:84958:2", why: "Loki becomes the thing holding the branches together. Required." },
      { id: "what-if-2", title: "What If…?", season: 2, kind: "animated", year: 2023, eps: 9, mins: 290, tier: "opt", tmdb: "tv:91363:2", why: "More animated multiverse stories." },
      { id: "deadpool-and-wolverine", title: "Deadpool & Wolverine", kind: "film", year: 2024, mins: 128, tier: "ess", pick: true, tmdb: "movie:533535", why: "Ties the TVA, the Void and the Fox films into the MCU. The bridge film." },
      { id: "agatha-all-along", title: "Agatha All Along", kind: "series", year: 2024, eps: 9, mins: 330, tier: "opt", tmdb: "tv:138501:1", why: "Witchcraft lore and Billy Maximoff, who is likely to matter soon." },
      { id: "what-if-3", title: "What If…?", season: 3, kind: "animated", year: 2024, eps: 8, mins: 250, tier: "opt", tmdb: "tv:91363:3", why: "The animated series' final season." },
      { id: "daredevil-born-again-1", title: "Daredevil: Born Again", season: 1, kind: "series", year: 2025, eps: 9, mins: 430, tier: "opt", tmdb: "tv:202555:1", why: "Fisk in office and the Punisher's return. Feeds Brand New Day." },
      { id: "captain-america-brave-new-world", title: "Captain America: Brave New World", kind: "film", year: 2025, mins: 118, tier: "ess", pick: true, tmdb: "movie:822119", why: "Sam's first film as Captain America, plus Ross and the adamantium thread." },
      { id: "thunderbolts", title: "Thunderbolts*", kind: "film", year: 2025, mins: 127, tier: "ess", pick: true, tmdb: "movie:986056", why: "The New Avengers origin. Yelena, Bucky, Red Guardian, Ghost and Walker all carry into Doomsday." },
      { id: "the-fantastic-four-first-steps", title: "The Fantastic Four: First Steps", kind: "film", year: 2025, mins: 115, tier: "ess", pick: true, tmdb: "movie:617126", why: "Reed, Sue, Johnny and Ben, and the reason Doom is coming. Do not skip." },
      { id: "wonder-man", title: "Wonder Man", kind: "series", year: 2026, eps: 8, mins: 260, tier: "opt", tmdb: "tv:198178:1", why: "Simon Williams and Hollywood satire. Light touch on the main plot." },
      { id: "daredevil-born-again-2", title: "Daredevil: Born Again", season: 2, kind: "series", year: 2026, eps: 8, mins: 400, tier: "opt", tmdb: "tv:202555:2", why: "Picks up the season 1 cliffhanger and lines up Brand New Day." },
      { id: "the-punisher-one-last-kill", title: "The Punisher: One Last Kill", kind: "special", year: 2026, mins: 51, tier: "opt", tmdb: "movie:1439930", why: "A one-off Frank Castle special for the street-level fans." },
      { id: "spider-man-brand-new-day", title: "Spider-Man: Brand New Day", kind: "film", year: 2026, mins: 145, tier: "ess", tmdb: "movie:969681", why: "Peter, years after the world forgot him: where he stands going into Doomsday." },
      { id: "visionquest", title: "VisionQuest", kind: "series", year: 2026, eps: 8, mins: 360, tier: "rec", tmdb: "tv:213375:1", why: "White Vision picks up the thread WandaVision left hanging." },
    ],
  },
  {
    id: "elsewhere",
    kicker: "Side quests",
    title: "Other universes",
    note: "Animated stories set in worlds of their own. Great fun, not needed for Doomsday.",
    cover: "x-men-97-1",
    items: [
      { id: "x-men-97-1", title: "X-Men '97", season: 1, kind: "animated", year: 2024, eps: 10, mins: 300, tier: "opt", tmdb: "tv:138502:1", why: "Carries on from the 90s cartoon. Its own universe, and brilliant." },
      { id: "x-men-97-2", title: "X-Men '97", season: 2, kind: "animated", year: 2026, eps: 9, mins: 270, tier: "opt", tmdb: "tv:138502:2", why: "More of the animated X-Men, still in their own universe." },
      { id: "your-friendly-neighborhood-spider-man", title: "Your Friendly Neighborhood Spider-Man", season: 1, kind: "animated", year: 2025, eps: 10, mins: 250, tier: "opt", tmdb: "tv:138503:1", why: "A different take on Peter's first year, in its own timeline." },
    ],
  },
];

export const TITLES: StoryTitle[] = SECTIONS.flatMap((section) =>
  section.items.map((item) => ({ ...item, number: 0, sectionId: section.id, sectionTitle: section.title }))
).map((item, index) => ({ ...item, number: index + 1 }));
