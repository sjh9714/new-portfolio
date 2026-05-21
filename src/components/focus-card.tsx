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
    <article className="border-border bg-card flex min-h-44 flex-col gap-4 border p-5">
      <div className="flex items-start gap-3">
        <span className="border-border bg-background flex size-10 shrink-0 items-center justify-center rounded-md border">
          <Icon aria-hidden="true" />
        </span>
        <h3 className="text-primary text-base leading-6 font-semibold">
          {title}
        </h3>
      </div>
      <ul className="text-foreground flex flex-col gap-2 text-sm leading-6">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span
              aria-hidden="true"
              className="bg-primary mt-2 size-1 shrink-0 rounded-full"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
