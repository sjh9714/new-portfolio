import { ChevronRight } from "lucide-react";

const flows: Record<string, string[]> = {
  "concert-booking": [
    "Client",
    "Queue",
    "Reservation",
    "Payment",
    "Outbox",
    "Kafka",
    "Consumer",
    "DB/Redis",
  ],
  "realtime-chat": [
    "Client",
    "WebSocket App",
    "Kafka",
    "Consumer",
    "DB + Redis",
    "App Instances",
    "Client",
  ],
  "ai-usage-billing-gateway": [
    "JWT/API Key",
    "Gateway",
    "Usage Event",
    "Invoice",
    "Webhook",
    "Ledger/Audit",
  ],
  "msa-shop": [
    "Gateway",
    "Order",
    "Product Reserve",
    "Payment",
    "RabbitMQ",
    "Settlement",
    "Compensation",
  ],
};

export function ArchitectureDiagram({ slug }: { slug: string }) {
  const steps = flows[slug] ?? [];

  if (steps.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md border border-border bg-background p-4">
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
        {steps.map((step, index) => (
          <div key={`${slug}-${step}`} className="flex items-center gap-3">
            <div className="flex min-h-16 min-w-40 flex-1 items-center justify-center rounded-md border border-border bg-card px-4 py-3 text-center text-sm font-semibold text-foreground md:flex-none">
              {step}
            </div>
            {index < steps.length - 1 ? (
              <ChevronRight
                aria-hidden="true"
                className="hidden text-muted-foreground md:block"
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
