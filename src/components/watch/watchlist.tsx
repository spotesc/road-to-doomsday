"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { FINALE, SECTIONS, TITLES } from "@/data/titles";
import { useCinematicAudio } from "@/hooks/use-cinematic-audio";
import { useRelease } from "@/hooks/use-release";
import { useStored } from "@/hooks/use-stored";
import { fullName, minsOf } from "@/lib/format";
import type { DetailsMap } from "@/lib/tmdb";
import { AudioDock } from "./audio-control";
import { useNowMinutes } from "./countdown";
import { KIND_FILTERS, ROUTES, kindOf, routeOf, type KindKey, type RouteKey, type ViewKey } from "./filters";
import { Finale } from "./finale";
import { Hero } from "./hero";
import { ProgressPanel } from "./progress-panel";
import { RoutePicker } from "./route-picker";
import { SearchCommand } from "./search-command";
import { SectionBlock } from "./section-block";
import { SiteFooter } from "./site-footer";
import { TitleDetails } from "./title-details";
import { Toolbar } from "./toolbar";
import { UpNext } from "./up-next";

interface Prefs {
  route: RouteKey;
  kind: KindKey;
  view: ViewKey;
  hide: boolean;
}

interface StoredPrefs extends Partial<Prefs> {
  filter?: string;
}

const NO_TICKS: string[] = [];
const DEFAULT_PREFS: StoredPrefs = { route: "everything", kind: "all", view: "list", hide: false };
const byId = new Map(TITLES.map((t) => [t.id, t]));

function readPrefs(stored: StoredPrefs): Prefs {
  const legacy = stored.filter;
  return {
    route: ROUTES.some((r) => r.key === stored.route)
      ? (stored.route as RouteKey)
      : legacy === "ess"
        ? "essentials"
        : "everything",
    kind: KIND_FILTERS.some((k) => k.key === stored.kind)
      ? (stored.kind as KindKey)
      : legacy === "films" || legacy === "series"
        ? legacy
        : "all",
    view: stored.view === "grid" ? "grid" : "list",
    hide: stored.hide === true,
  };
}

export function Watchlist({ details }: { details: DetailsMap }) {
  const [watchedList, setWatchedList] = useStored<string[]>("road-to-doomsday:watched", NO_TICKS);
  const [storedPrefs, setPrefs] = useStored<StoredPrefs>("road-to-doomsday:prefs", DEFAULT_PREFS);
  const [openId, setOpenId] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const release = useRelease();
  const now = useNowMinutes();
  const audio = useCinematicAudio(release?.at ?? null);

  const watched = useMemo(() => new Set(watchedList.filter((id) => byId.has(id))), [watchedList]);

  const prefs = readPrefs(storedPrefs);
  const updatePrefs = (patch: Partial<Prefs>) => setPrefs({ ...prefs, ...patch });

  const route = routeOf(prefs.route);
  const kind = kindOf(prefs.kind);
  const routeTitles = TITLES.filter(route.test);
  const inView = routeTitles.filter(kind.test);
  const next = inView.find((t) => !watched.has(t.id)) ?? null;
  const counts = Object.fromEntries(KIND_FILTERS.map((k) => [k.key, routeTitles.filter(k.test).length])) as Record<KindKey, number>;

  const routeLeft = routeTitles.filter((t) => !watched.has(t.id));
  const minsLeft = routeLeft.reduce((sum, t) => sum + minsOf(t, details[t.id]), 0);
  const hoursLeft = minsLeft / 60;
  const daysLeft = release && now !== null ? (release.at.getTime() - now) / 86_400_000 : null;
  const pace = !minsLeft ? "Done" : daysLeft !== null && daysLeft > 0 ? `${(hoursLeft / daysLeft).toFixed(1)}h/day` : "–";
  const routeSeen = routeTitles.length - routeLeft.length;

  const ready = routeLeft.length === 0;
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
  const status = ready
    ? `${route.label} complete. You're ready.`
    : `${when}${routeSeen} of ${routeTitles.length} watched · ${route.label}`;

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

  const share = async () => {
    const url = `${window.location.origin}/`;
    const text = routeSeen
      ? `I've watched ${routeSeen} of ${routeTitles.length} on the ${route.label} road to Avengers: Doomsday. Here's the list in story order:`
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
  };

  const chooseRoute = (key: RouteKey) => {
    if (key === prefs.route) return;
    updatePrefs({ route: key });
    toast(`${routeOf(key).label}: ${TITLES.filter(routeOf(key).test).length} titles`);
  };

  const scrollToRoutes = () => document.getElementById("routes")?.scrollIntoView({ behavior: "smooth", block: "center" });

  const openTitle = openId ? (byId.get(openId) ?? null) : null;

  return (
    <>
      <Hero release={release} audio={audio} onShare={share} />

      <div className="relative z-10 mx-auto -mt-4 max-w-5xl px-4 sm:px-6">
        <div id="routes">
          <RoutePicker route={prefs.route} titles={TITLES} watched={watched} details={details} onRoute={chooseRoute} />
        </div>
        <div className="mt-10">
          <ProgressPanel
            titles={routeTitles}
            watched={watched}
            routeLabel={route.label}
            markEssentials={route.key !== "essentials"}
            titlesLeft={routeLeft.length}
            hoursLeft={hoursLeft}
            pace={pace}
          />
        </div>
        <UpNext
          next={next}
          position={next ? routeTitles.indexOf(next) + 1 : 0}
          total={routeTitles.length}
          details={details}
          wholeList={prefs.kind === "all"}
          releaseDay={release?.dayMonth ?? null}
          onTick={toggle}
          onOpen={setOpenId}
        />
      </div>

      <Toolbar
        route={route}
        kind={prefs.kind}
        counts={counts}
        view={prefs.view}
        hide={prefs.hide}
        seen={inView.filter((t) => watched.has(t.id)).length}
        shown={inView.length}
        onKind={(k) => updatePrefs({ kind: k })}
        onView={(view) => updatePrefs({ view })}
        onHide={(hide) => updatePrefs({ hide })}
        onSearch={() => setSearching(true)}
        onChangeRoute={scrollToRoutes}
      />

      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        {SECTIONS.map((section, index) => {
          const matching = inView.filter((t) => t.sectionId === section.id);
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

        <Finale backdrop={details[FINALE.id]?.backdrop} release={release} status={status} ready={ready} />
        <SiteFooter
          canReset={watched.size > 0}
          onReset={() => {
            setWatchedList([]);
            toast("List reset");
          }}
        />
      </main>

      <TitleDetails
        title={openTitle}
        titles={inView.length ? inView : TITLES}
        details={details}
        watched={watched}
        onToggle={toggle}
        onNavigate={setOpenId}
        onClose={() => setOpenId(null)}
      />

      <AudioDock audio={audio} />

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
