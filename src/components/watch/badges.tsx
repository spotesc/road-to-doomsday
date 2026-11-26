import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { TIERS, type StoryTitle } from "@/data/titles";
import { cn } from "@/lib/utils";

const tag = "h-5 rounded-full px-2 font-mono text-[8.5px] font-medium tracking-[0.18em] uppercase";

const TIER_STYLES = {
  ess: "border-crimson/80 bg-crimson/30 text-[#e3b6bb]",
  rec: "border-forest bg-doom/60 text-mint",
  opt: "border-white/12 bg-transparent text-steel",
} as const;

export function TierBadge({ title, className }: { title: StoryTitle; className?: string }) {
  return (
    <Badge variant="outline" className={cn(tag, TIER_STYLES[title.tier], className)}>
      {TIERS[title.tier]}
    </Badge>
  );
}

export function PlainBadge({ children }: { children: ReactNode }) {
  return (
    <Badge variant="outline" className={cn(tag, "border-white/12 text-steel")}>
      {children}
    </Badge>
  );
}
