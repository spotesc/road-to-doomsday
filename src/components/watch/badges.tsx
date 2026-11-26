import type { ReactNode } from "react";
import { Sparkle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TIERS, type StoryTitle } from "@/data/titles";
import { cn } from "@/lib/utils";

const tag = "h-5 rounded-full px-2 text-[9px] font-semibold tracking-[0.16em] uppercase";

const TIER_STYLES = {
  ess: "border-gold/45 bg-gold/[0.1] text-gold-bright",
  rec: "border-jade/35 bg-jade/[0.08] text-jade",
  opt: "border-white/12 bg-transparent text-faint",
} as const;

export function TierBadge({ title, className }: { title: StoryTitle; className?: string }) {
  return (
    <Badge variant="outline" className={cn(tag, TIER_STYLES[title.tier], className)}>
      {TIERS[title.tier]}
    </Badge>
  );
}

export function PickBadge({ className }: { className?: string }) {
  return (
    <Badge variant="outline" className={cn(tag, "gap-1 border-white/15 text-steel", className)}>
      <Sparkle className="size-2.5 fill-current" />
      Disney+ pick
    </Badge>
  );
}

export function PlainBadge({ children }: { children: ReactNode }) {
  return (
    <Badge variant="outline" className={cn(tag, "border-white/12 text-muted-foreground")}>
      {children}
    </Badge>
  );
}
