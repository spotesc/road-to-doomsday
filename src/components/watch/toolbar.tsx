"use client";

import { motion } from "motion/react";
import { LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FILTERS, type FilterKey, type ViewKey } from "./filters";

interface Props {
  filter: FilterKey;
  counts: Record<FilterKey, number>;
  view: ViewKey;
  hide: boolean;
  seen: number;
  shown: number;
  onFilter: (f: FilterKey) => void;
  onView: (v: ViewKey) => void;
  onHide: (h: boolean) => void;
  onSearch: () => void;
}

export function Toolbar({ filter, counts, view, hide, seen, shown, onFilter, onView, onHide, onSearch }: Props) {
  return (
    <nav
      aria-label="Filter the list"
      className="sticky top-0 z-30 mt-14 border-y border-white/[0.07] bg-obsidian/80 shadow-[0_20px_40px_-30px_rgb(0_0_0/1)] backdrop-blur-2xl backdrop-saturate-150"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 px-4 sm:flex-nowrap sm:px-6">
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(v) => v && onFilter(v as FilterKey)}
          aria-label="Show"
          className="no-scrollbar -mx-4 w-[calc(100%+2rem)] flex-none justify-start gap-0 overflow-x-auto rounded-none px-2 sm:mx-0 sm:w-auto sm:flex-1 sm:px-0"
        >
          {FILTERS.map((f) => (
            <ToggleGroupItem
              key={f.key}
              value={f.key}
              className="relative h-12 flex-none gap-2 rounded-none border-0 bg-transparent px-3 text-[13px] font-medium text-steel shadow-none transition-colors duration-300 first:rounded-none last:rounded-none hover:bg-transparent hover:text-silver data-[state=on]:bg-transparent data-[state=on]:text-soft"
            >
              {f.label}
              <span className="font-mono text-[10px] text-faint tabular-nums">{counts[f.key]}</span>
              {filter === f.key && (
                <motion.span
                  layoutId="filter-underline"
                  transition={{ type: "spring", stiffness: 260, damping: 34 }}
                  className="absolute inset-x-3 -bottom-px h-px bg-silver shadow-[0_0_10px_rgb(143_191_170/0.9),0_0_2px_rgb(232_232_232/0.9)]"
                />
              )}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="flex flex-1 items-center gap-3 border-t border-white/[0.05] py-2 sm:flex-none sm:border-0 sm:py-0">
          <span className="mr-auto font-mono text-[11px] whitespace-nowrap text-steel tabular-nums sm:hidden lg:inline">
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
