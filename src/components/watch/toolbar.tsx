"use client";

import { motion } from "motion/react";
import { ChevronUp, LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { KIND_FILTERS, type KindKey, type Route, type ViewKey } from "./filters";

interface Props {
  route: Route;
  kind: KindKey;
  counts: Record<KindKey, number>;
  view: ViewKey;
  hide: boolean;
  seen: number;
  shown: number;
  onKind: (k: KindKey) => void;
  onView: (v: ViewKey) => void;
  onHide: (h: boolean) => void;
  onSearch: () => void;
  onChangeRoute: () => void;
}

export function Toolbar({ route, kind, counts, view, hide, seen, shown, onKind, onView, onHide, onSearch, onChangeRoute }: Props) {
  return (
    <nav
      aria-label="Filter the list"
      className="sticky top-0 z-30 mt-14 border-y border-white/[0.07] bg-obsidian/80 shadow-[0_20px_40px_-30px_rgb(0_0_0/1)] backdrop-blur-2xl backdrop-saturate-150"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 px-4 sm:flex-nowrap sm:px-6">
        <div className="no-scrollbar -mx-4 flex w-[calc(100%+2rem)] min-w-0 items-center gap-3 overflow-x-auto px-4 sm:mx-0 sm:w-auto sm:flex-none sm:overflow-visible sm:px-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onChangeRoute}
                className="group inline-flex h-8 shrink-0 items-center gap-2 rounded-full border border-silver/20 bg-white/[0.03] pr-2.5 pl-3 transition-colors duration-300 hover:border-silver/40"
              >
                <span className="hidden font-mono text-[9px] tracking-[0.2em] text-steel uppercase sm:inline">Route {route.numeral}</span>
                <span className="text-[12.5px] font-medium whitespace-nowrap text-soft">{route.label}</span>
                <ChevronUp className="size-3.5 text-steel transition-transform duration-300 group-hover:-translate-y-0.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Change route</TooltipContent>
          </Tooltip>

          <ToggleGroup
            type="single"
            value={kind}
            onValueChange={(v) => v && onKind(v as KindKey)}
            aria-label="Show"
            className="gap-0 rounded-none"
          >
            {KIND_FILTERS.map((f) => (
              <ToggleGroupItem
                key={f.key}
                value={f.key}
                className="relative h-12 flex-none gap-1.5 rounded-none border-0 bg-transparent px-2.5 text-[13px] font-medium text-steel shadow-none transition-colors duration-300 first:rounded-none last:rounded-none hover:bg-transparent hover:text-silver data-[state=on]:bg-transparent data-[state=on]:text-soft sm:px-3"
              >
                {f.label}
                <span className="font-mono text-[10px] text-faint tabular-nums">{counts[f.key]}</span>
                {kind === f.key && (
                  <motion.span
                    layoutId="kind-underline"
                    transition={{ type: "spring", stiffness: 260, damping: 34 }}
                    className="absolute inset-x-2.5 -bottom-px h-px bg-silver shadow-[0_0_10px_rgb(143_191_170/0.9),0_0_2px_rgb(232_232_232/0.9)] sm:inset-x-3"
                  />
                )}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3 border-t border-white/[0.05] py-2 sm:border-0 sm:py-0">
          <span className="mr-auto font-mono text-[11px] whitespace-nowrap text-steel tabular-nums sm:mr-0">
            <b className="font-medium text-silver">{seen}</b> / {shown}
          </span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSearch}
                aria-label="Search titles"
                className="size-8 rounded-full text-steel hover:bg-white/[0.06] hover:text-soft"
              >
                <Search />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search · Ctrl K</TooltipContent>
          </Tooltip>

          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(v) => v && onView(v as ViewKey)}
            aria-label="Layout"
            className="rounded-full border border-white/[0.09] bg-white/[0.025] p-0.5"
          >
            <ToggleGroupItem
              value="list"
              aria-label="List"
              className="size-7 min-w-0 rounded-full px-0 text-faint data-[state=on]:bg-white/10 data-[state=on]:text-soft"
            >
              <List />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="grid"
              aria-label="Posters"
              className="size-7 min-w-0 rounded-full px-0 text-faint data-[state=on]:bg-white/10 data-[state=on]:text-soft"
            >
              <LayoutGrid />
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="flex items-center gap-2">
            <Switch
              id="hide-watched"
              checked={hide}
              onCheckedChange={onHide}
              className="border border-white/10 data-[state=checked]:border-mint/40 data-[state=checked]:bg-forest"
            />
            <Label htmlFor="hide-watched" className="text-xs font-medium whitespace-nowrap text-steel">
              Hide watched
            </Label>
          </div>
        </div>
      </div>
    </nav>
  );
}
