"use client";

import { LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { FilterKey, ViewKey } from "./filters";
import { FILTERS } from "./filters";

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
      className="sticky top-0 z-30 mt-7 border-y bg-background/85 backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5 sm:flex-nowrap">
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(v) => v && onFilter(v as FilterKey)}
          aria-label="Show"
          className="no-scrollbar -mx-4 w-[calc(100%+2rem)] flex-none justify-start gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:w-auto sm:flex-1 sm:px-0"
        >
          {FILTERS.map((f) => (
            <ToggleGroupItem
              key={f.key}
              value={f.key}
              className="h-8 flex-none rounded-full border bg-card px-3 text-xs font-semibold text-muted-foreground first:rounded-full last:rounded-full hover:text-foreground data-[state=on]:border-doom data-[state=on]:bg-doom data-[state=on]:text-primary-foreground data-[state=on]:shadow-glow"
            >
              {f.label}
              <span className="ml-0.5 tabular-nums opacity-60">{counts[f.key]}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="flex flex-1 items-center gap-3 sm:flex-none">
          <span className="mr-auto text-xs whitespace-nowrap text-muted-foreground tabular-nums sm:hidden lg:inline">
            <b className="font-semibold text-doom">{seen}</b> of {shown} watched
          </span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onSearch} className="size-8 rounded-full bg-card" aria-label="Search titles">
                <Search />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search (Ctrl K)</TooltipContent>
          </Tooltip>

          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(v) => v && onView(v as ViewKey)}
            aria-label="Layout"
            className="rounded-full border bg-card p-0.5"
          >
            <ToggleGroupItem value="list" aria-label="List" className="size-7 min-w-0 rounded-full px-0 data-[state=on]:bg-input">
              <List />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Posters" className="size-7 min-w-0 rounded-full px-0 data-[state=on]:bg-input">
              <LayoutGrid />
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="flex items-center gap-2">
            <Switch id="hide-watched" checked={hide} onCheckedChange={onHide} className="data-[state=checked]:bg-doom" />
            <Label htmlFor="hide-watched" className="text-xs font-semibold whitespace-nowrap text-muted-foreground">
              Hide watched
            </Label>
          </div>
        </div>
      </div>
    </nav>
  );
}
