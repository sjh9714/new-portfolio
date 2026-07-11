import { notFound, permanentRedirect } from "next/navigation";

import { legacyCaseDestinations } from "@/lib/legacy-routes";

export default async function LegacyCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = legacyCaseDestinations.get(slug);
  if (!destination) notFound();
  permanentRedirect(destination);
}
