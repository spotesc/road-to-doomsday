"use client";

import type { ComponentType, ReactNode } from "react";
import { Check, ExternalLink, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import type { StoryTitle } from "@/data/titles";
import { useMediaQuery } from "@/hooks/use-media-query";
import { fullName, nameOf, pad } from "@/lib/format";
import type { DetailsMap } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { TitleBadges } from "./badges";
import { BackdropImage, PosterImage } from "./tmdb-image";

interface Props {
  title: StoryTitle | null;
  titles: StoryTitle[];
  details: DetailsMap;
  watched: Set<string>;
  onToggle: (id: string) => void;
  onNavigate: (id: string) => void;
  onClose: () => void;
}

const tag = "h-5 rounded-[5px] border-input px-1.5 text-[9.5px] font-bold tracking-[0.1em] text-muted-foreground uppercase";

export function TitleDetails({ title, titles, details, watched, onToggle, onNavigate, onClose }: Props) {
  const desktop = useMediaQuery("(min-width: 640px)", true);
  const open = title !== null;
  const onOpenChange = (next: boolean) => !next && onClose();

  if (desktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-h-[calc(100dvh-3rem)] gap-0 overflow-y-auto rounded-[20px] border-input bg-card p-0 sm:max-w-[760px]"
          onKeyDown={(e) => {
            if (!title) return;
            const i = titles.indexOf(title);
            if (e.key === "ArrowRight" && titles[i + 1]) onNavigate(titles[i + 1].id);
            if (e.key === "ArrowLeft" && titles[i - 1]) onNavigate(titles[i - 1].id);
          }}
        >
          {title && (
            <Body
              title={title}
              titles={titles}
              details={details}
              watched={watched}
              onToggle={onToggle}
              onNavigate={onNavigate}
              Title={DialogTitle}
              Description={DialogDescription}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[94dvh] border-input bg-card">
        <div className="overflow-y-auto pb-[env(safe-area-inset-bottom)]">
          {title && (
            <Body
              title={title}
              titles={titles}
              details={details}
              watched={watched}
              onToggle={onToggle}
              onNavigate={onNavigate}
              Title={DrawerTitle}
              Description={DrawerDescription}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function Body({
  title,
  titles,
  details,
  watched,
  onToggle,
  onNavigate,
  Title,
  Description,
}: Omit<Props, "title" | "onClose"> & {
  title: StoryTitle;
  Title: ComponentType<{ className?: string; children: ReactNode }>;
  Description: ComponentType<{ className?: string; children: ReactNode }>;
}) {
  const d = details[title.id];
  const done = watched.has(title.id);
  const i = titles.indexOf(title);
  const prev = titles[i - 1];
  const next = titles[i + 1];

  return (
    <>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[#1b231f] to-card sm:aspect-[16/7.5] sm:rounded-t-[20px]">
        <BackdropImage path={d?.backdrop} sizes="(max-width: 640px) 100vw, 760px" className="object-[center_25%]" />
        <div className="sheet-veil absolute inset-0" />
      </div>

      <div className="relative -mt-16 grid grid-cols-[96px_minmax(0,1fr)] gap-x-4 px-4 sm:-mt-24 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-x-6 sm:px-7">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gradient-to-br from-[#1d2521] to-[#0b0f0d] shadow-[0_20px_44px_rgb(0_0_0/0.7),0_0_0_1px_rgb(255_255_255/0.1)]">
          <PosterImage path={d?.poster} sizes="140px" priority />
        </div>
        <div className="self-end pt-6 sm:pt-10">
          <p className="text-[10.5px] font-bold tracking-[0.26em] text-doom uppercase text-glow">
            No. {pad(title.number)} of {titles.length} · {title.sectionTitle}
          </p>
          <Title className="mt-2 font-display text-[26px] leading-none font-bold uppercase sm:text-[40px]">
            {nameOf(title, d)}
            {title.season && <span className="ml-2 text-muted-foreground">S{title.season}</span>}
          </Title>
          <Description className="mt-1.5 text-sm text-muted-foreground italic">{d?.tagline || title.year}</Description>
        </div>
      </div>

      <div className="px-4 pt-4 pb-5 sm:px-7">
        <div className="flex flex-wrap gap-1.5">
          <TitleBadges title={title} details={d} />
          <Badge variant="outline" className={tag}>
            {title.year}
          </Badge>
          {d?.rating && (
            <Badge variant="outline" className={tag}>
              TMDB ★ {d.rating.toFixed(1)}
            </Badge>
          )}
          {d?.genres.slice(0, 2).map((g) => (
            <Badge key={g} variant="outline" className={tag}>
              {g}
            </Badge>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-doom/30 bg-doom/6 px-3.5 py-3 text-sm">
          <p className="mb-0.5 text-[10px] font-bold tracking-[0.22em] text-doom uppercase">Why watch it</p>
          {title.why}
        </div>

        {d?.overview && <p className="mt-4 text-[14.5px] leading-relaxed text-[#c4ccc7]">{d.overview}</p>}

        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            onClick={() => onToggle(title.id)}
            variant={done ? "outline" : "default"}
            className={cn(
              "h-10 rounded-full px-4",
              done ? "border-doom/30 bg-doom/10 text-doom hover:bg-doom/15" : "shadow-glow"
            )}
          >
            <Check className="stroke-3" />
            {done ? "Watched · undo" : "Mark watched"}
          </Button>
          {d?.trailer && (
            <Button asChild variant="outline" className="h-10 rounded-full px-4">
              <a href={`https://www.youtube.com/watch?v=${d.trailer}`} target="_blank" rel="noopener noreferrer">
                <Play className="fill-current" />
                Trailer
              </a>
            </Button>
          )}
          {d?.link && (
            <Button asChild variant="outline" className="h-10 rounded-full px-4">
              <a href={d.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                TMDB
              </a>
            </Button>
          )}
        </div>
      </div>

      <nav aria-label="Story order" className="grid grid-cols-2 gap-2 border-t px-4 pt-3.5 pb-5 sm:px-7">
        {[prev, next].map((t, index) => (
          <button
            key={index}
            type="button"
            disabled={!t}
            onClick={() => t && onNavigate(t.id)}
            className={cn(
              "min-w-0 rounded-xl border bg-background px-3.5 py-2.5 transition-colors hover:border-input disabled:invisible",
              index === 1 ? "text-right" : "text-left"
            )}
          >
            <small className="block text-[9.5px] font-bold tracking-[0.2em] text-faint uppercase">
              {index === 0 ? "Before this" : "After this"}
            </small>
            <span className="mt-0.5 block truncate text-[13.5px] font-semibold">
              {t ? fullName(t, details[t.id]) : ""}
            </span>
          </button>
        ))}
      </nav>
    </>
  );
}
