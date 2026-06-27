// Direction-aware chevrons / arrows. Flipped horizontally in RTL so they
// always point "forward" along the reading direction (BUG-001).
import { ChevronRight, ArrowRight, type LucideProps } from "lucide-react";
import { dirOf, type Lang } from "@/lib/i18n";

type Props = LucideProps & { lang: Lang };

const flipClass = "rtl:-scale-x-100";

export function DirChevron({ lang, className = "", ...rest }: Props) {
  void lang;
  return <ChevronRight className={`${flipClass} ${className}`.trim()} {...rest} />;
}

export function DirArrow({ lang, className = "", ...rest }: Props) {
  void lang;
  return <ArrowRight className={`${flipClass} ${className}`.trim()} {...rest} />;
}

// Helper for callers that need the raw direction
export const isRtl = (lang: Lang) => dirOf(lang) === "rtl";
