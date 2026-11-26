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
      className="sticky top-0 z-30 mt-12 border-y border-white/[0.06] bg-background/75 backdrop-blur-2xl backdrop-saturate-150"
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
              className="relative h-12 flex-none gap-1.5 rounded-none border-0 bg-transparent px-3 text-[13px] font-medium text-muted-foreground shadow-none first:rounded-none last:rounded-none hover:bg-transparent hover:text-foreground data-[state=on]:bg-transparent data-[state=on]:text-foreground"
            >
              {f.label}
              <span className="text-[11px] text-faint tabular-nums">{counts[f.key]}</span>
              {filter === f.key && (
                <motion.span
                  layoutId="filter-underline"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-jade shadow-[0_0_12px_rgb(61_220_132/0.8)]"
                />
              )}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="flex flex-1 items-center gap-3 border-t border-white/[0.05] py-2 sm:flex-none sm:border-0 sm:py-0">
          <span className="mr-auto text-xs whitespace-nowrap text-muted-foreground tabular-nums sm:hidden lg:inline">
            <b className="font-semibold text-jade">{seen}</b> of {shown}
          </span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSearch}
                aria-label="Search titles"
                className="size-8 rounded-full text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
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
            className="rounded-full border border-white/[0.08] bg-white/[0.03] p-0.5"
          >
            <ToggleGroupItem
              value="list"
              aria-label="List"
              className="size-7 min-w-0 rounded-full px-0 text-faint data-[state=on]:bg-white/10 data-[state=on]:text-foreground"
            >
              <List />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="grid"
              aria-label="Posters"
              className="size-7 min-w-0 rounded-full px-0 text-faint data-[state=on]:bg-white/10 data-[state=on]:text-foreground"
            >
              <LayoutGrid />
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="flex items-center gap-2">
            <Switch id="hide-watched" checked={hide} onCheckedChange={onHide} className="data-[state=checked]:bg-jade" />
            <Label htmlFor="hide-watched" className="text-xs font-medium whitespace-nowrap text-muted-foreground">
              Hide watched
            </Label>
          </div>
        </div>
      </div>
    </nav>
  );
}
