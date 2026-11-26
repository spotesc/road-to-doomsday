"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { FINALE, SECTIONS, TITLES } from "@/data/titles";
import { useRelease } from "@/hooks/use-release";
import { useStored } from "@/hooks/use-stored";
import { fullName, minsOf } from "@/lib/format";
import type { DetailsMap } from "@/lib/tmdb";
import { useNowMinutes } from "./countdown";
import { FILTERS, filterTest, type FilterKey, type ViewKey } from "./filters";
import { Finale } from "./finale";
import { Hero } from "./hero";
import { ProgressPanel } from "./progress-panel";
import { SearchCommand } from "./search-command";
import { SectionBlock } from "./section-block";
import { SiteFooter } from "./site-footer";
import { TitleDetails } from "./title-details";
import { Toolbar } from "./toolbar";
import { UpNext } from "./up-next";

interface Prefs {
  filter: FilterKey;
  view: ViewKey;
  hide: boolean;
}

const NO_TICKS: string[] = [];
const DEFAULT_PREFS: Prefs = { filter: "all", view: "list", hide: false };
const byId = new Map(TITLES.map((t) => [t.id, t]));

export function Watchlist({ details }: { details: DetailsMap }) {
  const [watchedList, setWatchedList] = useStored<string[]>("road-to-doomsday:watched", NO_TICKS);
  const [storedPrefs, setPrefs] = useStored<Partial<Prefs>>("road-to-doomsday:prefs", DEFAULT_PREFS);
  const [openId, setOpenId] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const release = useRelease();
  const now = useNowMinutes();

  const watched = useMemo(() => new Set(watchedList.filter((id) => byId.has(id))), [watchedList]);

  const prefs: Prefs = {
    filter: FILTERS.some((f) => f.key === storedPrefs.filter) ? (storedPrefs.filter as FilterKey) : "all",
    view: storedPrefs.view === "grid" ? "grid" : "list",
    hide: storedPrefs.hide === true,
  };
  const updatePrefs = (patch: Partial<Prefs>) => setPrefs({ ...prefs, ...patch });

  const test = filterTest(prefs.filter);
  const inView = TITLES.filter(test);
  const next = inView.find((t) => !watched.has(t.id)) ?? null;
  const counts = Object.fromEntries(FILTERS.map((f) => [f.key, TITLES.filter(f.test).length])) as Record<FilterKey, number>;

  const minsLeft = TITLES.filter((t) => !watched.has(t.id)).reduce((sum, t) => sum + minsOf(t, details[t.id]), 0);
  const hoursLeft = minsLeft / 60;
  const daysLeft = release && now !== null ? (release.at.getTime() - now) / 86_400_000 : null;
  const pace = !minsLeft ? "Done" : daysLeft !== null && daysLeft > 0 ? `${(hoursLeft / daysLeft).toFixed(1)}h/day` : "–";
  const essentialsLeft = TITLES.filter((t) => t.tier === "ess" && !watched.has(t.id)).length;

  const everything = watched.size === TITLES.length;
  const wholeDays = daysLeft === null ? null : Math.floor(daysLeft);
  const when =
    wholeDays === null
      ? ""
      : wholeDays > 1
        ? `${wholeDays} days to go · `
        : wholeDays === 1
          ? "1 day to go · "
          : daysLeft! > 0
            ? "Out tomorrow · "
            : "Out now · ";
  const status = everything ? `All ${TITLES.length} watched. You're ready.` : `${when}${watched.size} of ${TITLES.length} watched`;

  const setTicked = useCallback(
    (id: string, on: boolean) => {
      setWatchedList((current) => {
        const nextList = current.filter((x) => x !== id && byId.has(x));
        if (on) nextList.push(id);
        return nextList;
      });
    },
    [setWatchedList]
  );

  const toggle = useCallback(
    (id: string) => {
      const title = byId.get(id);
      if (!title) return;
      const on = !watched.has(id);
      setTicked(id, on);
      if (on) {
        toast.success(`Ticked off ${fullName(title, details[id])}`, {
          duration: 3000,
          action: { label: "Undo", onClick: () => setTicked(id, false) },
        });
      }
    },
    [watched, setTicked, details]
  );

  const share = useCallback(async () => {
    const url = `${window.location.origin}/`;
    const text = watched.size
      ? `I've watched ${watched.size} of ${TITLES.length} on the road to Avengers: Doomsday. Here's the full list in story order:`
      : "Every Marvel film and series to watch before Avengers: Doomsday, in story order:";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Road to Doomsday", text, url });
      } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      toast("Link copied");
    } catch {
      toast(url);
    }
  }, [watched.size]);

  const openTitle = openId ? (byId.get(openId) ?? null) : null;

  return (
    <>
      <Hero release={release} onShare={share} />

      <div className="relative z-10 mx-auto -mt-4 max-w-5xl px-4 sm:px-6">
        <ProgressPanel
          titles={TITLES}
          watched={watched}
          essentialsLeft={essentialsLeft}
          hoursLeft={hoursLeft}
          pace={pace}
        />
        <UpNext
          next={next}
          total={TITLES.length}
          details={details}
          wholeList={prefs.filter === "all"}
          releaseDay={release?.dayMonth ?? null}
          onTick={toggle}
          onOpen={setOpenId}
        />
      </div>

      <Toolbar
        filter={prefs.filter}
        counts={counts}
        view={prefs.view}
        hide={prefs.hide}
        seen={inView.filter((t) => watched.has(t.id)).length}
        shown={inView.length}
        onFilter={(filter) => updatePrefs({ filter })}
        onView={(view) => updatePrefs({ view })}
        onHide={(hide) => updatePrefs({ hide })}
        onSearch={() => setSearching(true)}
      />

      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        {SECTIONS.map((section, index) => {
          const matching = TITLES.filter((t) => t.sectionId === section.id && test(t));
          if (!matching.length) return null;
          const visible = prefs.hide ? matching.filter((t) => !watched.has(t.id)) : matching;
          return (
            <SectionBlock
              key={section.id}
              section={section}
              index={index}
              matching={matching}
              visible={visible}
              watched={watched}
              details={details}
              view={prefs.view}
              onToggle={toggle}
              onOpen={setOpenId}
            />
          );
        })}

        <Finale backdrop={details[FINALE.id]?.backdrop} release={release} status={status} ready={everything} />
        <SiteFooter canReset={watched.size > 0} onReset={() => { setWatchedList([]); toast("List reset"); }} />
      </main>

      <TitleDetails
        title={openTitle}
        titles={TITLES}
        details={details}
        watched={watched}
        onToggle={toggle}
        onNavigate={setOpenId}
        onClose={() => setOpenId(null)}
      />

      <SearchCommand
        open={searching}
        onOpenChange={setSearching}
        titles={TITLES}
        details={details}
        watched={watched}
        onPick={setOpenId}
      />
    </>
  );
}
