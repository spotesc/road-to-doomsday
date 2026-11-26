"use client";

import type { ComponentType, ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import type { StoryTitle } from "@/data/titles";
import { useMediaQuery } from "@/hooks/use-media-query";
import { KINDS, fullName, lengthText, nameOf, pad } from "@/lib/format";
import type { DetailsMap } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { PickBadge, PlainBadge, TierBadge } from "./badges";
import { BackdropImage, PosterImage } from "./tmdb-image";
import { ghostButton, primaryButton } from "./up-next";

interface Props {
  title: StoryTitle | null;
  titles: StoryTitle[];
  details: DetailsMap;
  watched: Set<string>;
  onToggle: (id: string) => void;
  onNavigate: (id: string) => void;
  onClose: () => void;
}

export function TitleDetails({ title, titles, details, watched, onToggle, onNavigate, onClose }: Props) {
  const desktop = useMediaQuery("(min-width: 640px)", true);
  const open = title !== null;
  const onOpenChange = (next: boolean) => !next && onClose();

  if (desktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-h-[calc(100dvh-3rem)] gap-0 overflow-y-auto rounded-3xl border-white/10 bg-popover p-0 shadow-[0_80px_160px_-40px_rgb(0_0_0/1),0_0_0_1px_rgb(184_184_184/0.06)] sm:max-w-[800px]"
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
      <DrawerContent className="max-h-[94dvh] border-white/10 bg-popover">
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
  const length = lengthText(title, d);

  return (
    <>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary sm:aspect-[16/7.5]">
        <BackdropImage path={d?.backdrop} sizes="(max-width: 640px) 100vw, 800px" className="object-[center_25%] saturate-[0.8]" priority />
        <div className="sheet-veil absolute inset-0" />
      </div>

      <div className="relative -mt-16 grid grid-cols-[96px_minmax(0,1fr)] gap-x-4 px-5 sm:-mt-28 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-x-7 sm:px-9">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-charcoal shadow-[0_40px_70px_-20px_rgb(0_0_0/0.95)] ring-1 ring-silver/15">
          <PosterImage path={d?.poster} sizes="150px" priority />
        </div>
        <div className="self-end pt-6 sm:pt-12">
          <p className="eyebrow text-[9px] text-silver">
            No. {pad(title.number)} / {titles.length}
            <span className="ml-2.5 text-steel">— {title.sectionTitle}</span>
          </p>
          <Title className="poster-type mt-3 text-[38px] leading-[0.9] sm:text-[64px]">
            <span className="text-metal">{nameOf(title, d)}</span>
            {title.season && <span className="ml-2.5 text-[0.45em] tracking-[0.12em] text-steel">Season {title.season}</span>}
          </Title>
          <Description className="mt-2 text-sm text-muted-foreground italic">{d?.tagline || `${KINDS[title.kind]}, ${title.year}`}</Description>
        </div>
      </div>

      <div className="px-5 pt-5 pb-6 sm:px-9">
        <div className="flex flex-wrap items-center gap-1.5">
          <TierBadge title={title} />
          {title.pick && <PickBadge />}
          <PlainBadge>{KINDS[title.kind]}</PlainBadge>
          <PlainBadge>{title.year}</PlainBadge>
          {length && <PlainBadge>{length}</PlainBadge>}
          {d?.rating && (
            <PlainBadge>
              <Star className="size-2.5 fill-silver text-silver" />
              {d.rating.toFixed(1)}
            </PlainBadge>
          )}
          {d?.genres.slice(0, 2).map((g) => <PlainBadge key={g}>{g}</PlainBadge>)}
        </div>

        <div className="mt-5 rounded-r-xl border-l-2 border-silver/60 bg-white/[0.03] py-3.5 pr-4 pl-4">
          <p className="eyebrow text-[8.5px] text-steel">Why watch it</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-foreground">{title.why}</p>
        </div>

        {d?.overview && <p className="mt-5 text-[14.5px] leading-relaxed text-[#bdbdbd]">{d.overview}</p>}

        <div className="mt-6 flex flex-wrap gap-2.5">
          <Button
            onClick={() => onToggle(title.id)}
            variant="outline"
            className={cn(done ? `${ghostButton} border-mint/35 text-mint hover:text-mint` : primaryButton)}
          >
            <Check className="stroke-3" />
            {done ? "Watched · undo" : "Mark as watched"}
          </Button>
          {d?.trailer && (
            <Button asChild variant="outline" className={ghostButton}>
              <a href={`https://www.youtube.com/watch?v=${d.trailer}`} target="_blank" rel="noopener noreferrer">
                <Play className="fill-current" />
                Trailer
              </a>
            </Button>
          )}
          {d?.link && (
            <Button asChild variant="outline" className={ghostButton}>
              <a href={d.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                TMDB
              </a>
            </Button>
          )}
        </div>
      </div>

      <nav aria-label="Story order" className="grid grid-cols-2 gap-2.5 border-t border-white/[0.07] px-5 pt-4 pb-6 sm:px-9">
        {[prev, next].map((t, index) => (
          <button
            key={index}
            type="button"
            disabled={!t}
            onClick={() => t && onNavigate(t.id)}
            className={cn(
              "group min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 transition-colors hover:border-white/15 hover:bg-white/[0.04] disabled:invisible",
              index === 1 ? "text-right" : "text-left"
            )}
          >
            <span className={cn("eyebrow flex items-center gap-1.5 text-[8px] text-steel", index === 1 && "justify-end")}>
              {index === 0 && <ArrowLeft className="size-3" />}
              {index === 0 ? "Before this" : "After this"}
              {index === 1 && <ArrowRight className="size-3" />}
            </span>
            <span className="mt-1 block truncate text-[13.5px] font-semibold">{t ? fullName(t, details[t.id]) : ""}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
