import { notFound, permanentRedirect } from "next/navigation";

import { legacyFlowDestinations } from "@/lib/legacy-routes";

export default async function LegacyFlowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = legacyFlowDestinations.get(slug);
  if (!destination) notFound();
  permanentRedirect(destination);
}
