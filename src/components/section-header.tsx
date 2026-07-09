export function SectionHeader({
  title,
  description,
  action,
  as: Heading = "h2",
  eyebrow,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  eyebrow?: string;
}) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="flex max-w-3xl flex-col gap-3">
        {eyebrow ? <p className="section-kicker">{eyebrow}</p> : null}
        <Heading className="heading-wrap text-foreground text-3xl leading-tight font-bold tracking-[-0.025em] md:text-4xl">
          {title}
        </Heading>
        {description ? (
          <p className="text-muted-foreground max-w-2xl text-base leading-7">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
