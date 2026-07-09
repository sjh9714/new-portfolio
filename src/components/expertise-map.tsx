const expertiseLanes = [
  {
    key: "01",
    title: "Concurrency",
    description: "좌석 경합과 중복 요청을 DB 정합성으로 수렴",
  },
  {
    key: "02",
    title: "Event Recovery",
    description: "커밋 이후 발행 실패를 Outbox·DLT·Replay로 복구",
  },
  {
    key: "03",
    title: "Realtime",
    description: "구독 인가·방 순서·재연결 경계를 분리해 검증",
  },
  {
    key: "04",
    title: "Billing",
    description: "사용량 중복과 Webhook 재전송을 Ledger 불변식으로 흡수",
  },
] as const;

export function ExpertiseMap() {
  return (
    <figure aria-labelledby="expertise-map-title" className="grid gap-5">
      <figcaption className="flex items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Problem map</p>
          <h2
            id="expertise-map-title"
            className="text-foreground mt-2 text-lg font-bold tracking-tight"
          >
            네 문제 영역을 하나의 정합성 관점으로 연결합니다.
          </h2>
        </div>
        <span className="text-muted-foreground hidden font-mono text-[0.68rem] uppercase md:block">
          Source → Boundary → Recovery
        </span>
      </figcaption>
      <ol className="border-border relative grid border-y md:grid-cols-4">
        {expertiseLanes.map((lane, index) => (
          <li
            key={lane.key}
            className="border-border relative grid grid-cols-[2.5rem_1fr] gap-3 border-b py-5 last:border-b-0 md:block md:min-h-48 md:border-r md:border-b-0 md:px-5 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
          >
            <span className="text-primary font-mono text-xs font-semibold">
              {lane.key}
            </span>
            <div className="md:mt-12">
              <h3 className="text-foreground font-mono text-sm font-bold">
                {lane.title}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                {lane.description}
              </p>
            </div>
            {index < expertiseLanes.length - 1 ? (
              <span
                aria-hidden="true"
                className="border-primary bg-background absolute top-[2.1rem] right-[-0.3rem] z-10 hidden size-2 rounded-full border md:block"
              />
            ) : null}
          </li>
        ))}
      </ol>
    </figure>
  );
}
