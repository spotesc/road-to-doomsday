"use client";

import { useEffect } from "react";
import { CircleCheck } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SECTIONS, type StoryTitle } from "@/data/titles";
import { nameOf, pad } from "@/lib/format";
import type { DetailsMap } from "@/lib/tmdb";
import { PosterImage } from "./tmdb-image";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titles: StoryTitle[];
  details: DetailsMap;
  watched: Set<string>;
  onPick: (id: string) => void;
}

export function SearchCommand({ open, onOpenChange, titles, details, watched, onPick }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !isTyping(e.target))) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search the list"
      description="Find a film or series by name"
      className="rounded-2xl! border-white/10 bg-popover shadow-[0_40px_100px_-20px_rgb(0_0_0/0.95)] sm:max-w-lg"
    >
      <Command className="bg-popover">
        <CommandInput placeholder={`Search ${titles.length} titles…`} />
        <CommandList className="max-h-[min(60dvh,420px)]">
          <CommandEmpty>Nothing matches that.</CommandEmpty>
          {SECTIONS.map((section) => (
            <CommandGroup key={section.id} heading={section.title}>
              {titles
                .filter((t) => t.sectionId === section.id)
                .map((t) => (
                  <CommandItem
                    key={t.id}
                    value={`${t.number} ${nameOf(t, details[t.id])} ${t.season ? `season ${t.season}` : ""} ${t.year}`}
                    onSelect={() => {
                      onOpenChange(false);
                      onPick(t.id);
                    }}
                    className="gap-3 py-2"
                  >
                    <span className="relative aspect-[2/3] w-7 shrink-0 overflow-hidden rounded bg-secondary">
                      <PosterImage path={details[t.id]?.poster} sizes="28px" />
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      {nameOf(t, details[t.id])}
                      {t.season && <span className="text-muted-foreground"> S{t.season}</span>}
                      <span className="text-muted-foreground"> · {t.year}</span>
                    </span>
                    {watched.has(t.id) && <CircleCheck className="text-mint" />}
                    <span className="font-mono text-[11px] text-silver tabular-nums">{pad(t.number)}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}
