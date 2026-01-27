import { cn } from "@/lib/utils";

type SizeVariant = "sm" | "md" | "lg";

interface TechPillProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass?: string;
  size?: SizeVariant;
  className?: string;
}

const sizeStyles: Record<SizeVariant, { icon: string; text: string; padding: string }> = {
  sm: { icon: "w-4! h-4!", text: "text-sm", padding: "px-2.5 py-1.25" },
  md: { icon: "w-5! h-5!", text: "text-base", padding: "px-3 py-1.5" },
  lg: { icon: "w-8! h-8!", text: "text-xl", padding: "px-5 py-3" },
};

export default function TechPill({
  label,
  icon: Icon,
  colorClass,
  size = "md",
  className,
}: TechPillProps) {
  const styles = sizeStyles[size];
  return (
    <div
      className={cn(
        "group/tech-pill flex items-center gap-2 rounded-full bg-secondary/60 border border-border/50 hover:border-border hover:bg-secondary transition-all cursor-default",
        styles.padding,
        className
      )}
    >
      <Icon
        className={cn(
          styles.icon,
          colorClass,
          "transition-transform group-hover/tech-pill:scale-110"
        )}
      />
      <span
        className={cn(
          styles.text,
          "text-foreground/80 group-hover/tech-pill:text-foreground transition-colors"
        )}
      >
        {label}
      </span>
    </div>
  );
}
