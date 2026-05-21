import type { LucideIcon } from "lucide-react";

export function FocusCard({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: string[];
  icon: LucideIcon;
}) {
  return (
    <article className="flex min-h-44 flex-col gap-4 border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-background">
          <Icon aria-hidden="true" />
        </span>
        <h3 className="text-base font-semibold leading-6 text-primary">{title}</h3>
      </div>
      <ul className="flex flex-col gap-2 text-sm leading-6 text-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
