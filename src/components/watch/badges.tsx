import { Badge } from "@/components/ui/badge";
import { TIERS, type StoryTitle } from "@/data/titles";
import { KINDS, isShow, lengthText } from "@/lib/format";
import type { TitleDetails } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

const tag = "h-5 rounded-[5px] px-1.5 text-[9.5px] font-bold tracking-[0.1em] uppercase";

const TIER_STYLES = {
  ess: "border-marvel/50 bg-marvel/15 text-[#ff6b70]",
  rec: "border-gold/40 bg-gold/12 text-gold",
  opt: "border-input bg-transparent text-faint",
} as const;

export function TierBadge({ title, className }: { title: StoryTitle; className?: string }) {
  return (
    <Badge variant="outline" className={cn(tag, TIER_STYLES[title.tier], className)}>
      {TIERS[title.tier]}
    </Badge>
  );
}

export function TitleBadges({
  title,
  details,
  compact = false,
}: {
  title: StoryTitle;
  details?: TitleDetails;
  compact?: boolean;
}) {
  const length = lengthText(title, details);
  return (
    <div className="flex flex-wrap gap-1.5">
      <TierBadge title={title} />
      {!compact && (
        <>
          <Badge
            variant="outline"
            className={cn(tag, isShow(title) ? "border-sky/35 bg-sky/12 text-sky" : "border-input text-muted-foreground")}
          >
            {KINDS[title.kind]}
          </Badge>
          {length && (
            <Badge variant="outline" className={cn(tag, "border-input text-muted-foreground")}>
              {length}
            </Badge>
          )}
          {title.pick && (
            <Badge variant="outline" className={cn(tag, "border-doom/30 bg-doom/8 text-doom")}>
              Disney+ pick
            </Badge>
          )}
        </>
      )}
    </div>
  );
}
